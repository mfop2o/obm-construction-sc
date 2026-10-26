import { useSyncExternalStore } from 'react'
import { http } from './api'

/* ============================================================================
   recruitmentStore — online recruitment: public vacancies, candidate
   applications, and the HR triage dashboard.

   The public careers page reads vacancies. Candidates submit through
   `submitApplication`, which posts multipart form data and receives the
   generated OBM-YYYY-##### reference. The admin dashboard reads applications
   and moves them through the triage statuses.

   Every admin mutation is Sanctum-protected server-side.
   ========================================================================== */

type Listener = () => void

/* ---- Vacancies ---- */

export interface Opening {
  id: number
  title: string
  department: string | null
  location: string | null
  type: string
  blurb: string | null
  qualification: string | null
  responsibilities: string | null
  experience_years: number | null
  deadline: string | null
  is_active: boolean
  sort_order: number
  /** Serialised by the API: whether the vacancy still accepts applications. */
  is_accepting_applications: boolean
}

let openings: Opening[] = []
let openingsReady = false
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((l) => l())
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function normalizeOpening(row: Record<string, unknown>): Opening {
  const deadline =
    row.deadline === null || row.deadline === undefined ? null : String(row.deadline)

  // The list endpoint omits `is_accepting_applications`, so fall back to the
  // advertised deadline the same way Opening::isClosed() does.
  const accepting =
    row.is_accepting_applications === undefined
      ? !deadline || new Date(deadline).getTime() >= Date.now()
      : Boolean(row.is_accepting_applications)

  return {
    id: Number(row.id),
    title: String(row.title ?? ''),
    department: row.department === null || row.department === undefined ? null : String(row.department),
    location: row.location === null || row.location === undefined ? null : String(row.location),
    type: String(row.type ?? ''),
    blurb: row.blurb === null || row.blurb === undefined ? null : String(row.blurb),
    qualification:
      row.qualification === null || row.qualification === undefined
        ? null
        : String(row.qualification),
    responsibilities:
      row.responsibilities === null || row.responsibilities === undefined
        ? null
        : String(row.responsibilities),
    experience_years:
      row.experience_years === null || row.experience_years === undefined
        ? null
        : Number(row.experience_years),
    deadline,
    is_active: Boolean(row.is_active),
    sort_order: Number(row.sort_order ?? 0),
    is_accepting_applications: accepting,
  }
}

async function refreshOpenings() {
  try {
    const res = await http.get<{
      data: { openings?: Array<Record<string, unknown>> }
    }>('/api/careers')
    openings = (res.data.data?.openings ?? []).map(normalizeOpening)
  } catch {
    // Keep the last known vacancies on failure.
  }
  openingsReady = true
  emit()
}

export function useOpenings(): Opening[] {
  useSyncExternalStore(subscribe, () => openings)
  return openings
}

export function useOpeningsReady(): boolean {
  useSyncExternalStore(subscribe, () => openingsReady)
  return openingsReady
}

export function refreshOpeningsSync(): void {
  void refreshOpenings()
}

export function getOpeningById(id: number): Opening | undefined {
  return openings.find((o) => o.id === id)
}

/** The vacancies a visitor can still apply to. */
export function getAcceptingOpenings(): Opening[] {
  return openings.filter((o) => o.is_active && o.is_accepting_applications)
}

void refreshOpenings()

/* ---- Applications ---- */

/** Mirrors App\Enums\JobApplicationStatus. */
export type JobApplicationStatus =
  | 'new'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'selected'
  | 'rejected'

export const jobApplicationStatuses: JobApplicationStatus[] = [
  'new',
  'under_review',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
]

export interface JobApplication {
  id: number
  application_number: string
  opening_id: number | null
  position_applied_for: string
  full_name: string
  gender: string | null
  date_of_birth: string | null
  phone: string
  email: string
  address: string | null
  education: string | null
  work_experience: string | null
  skills: string | null
  years_of_experience: number | null
  cover_letter: string | null
  admin_note: string | null
  status: JobApplicationStatus
  applied_at: string | null
  cv_path: string
  cv_name: string | null
  cv_mime: string | null
  cv_size: number | null
  certificates_path: string | null
  certificates_name: string | null
  certificates_mime: string | null
  certificates_size: number | null
  created_at: string
  updated_at: string
  /** Appended by the API on the detail endpoint. */
  cv_url?: string | null
  certificates_url?: string | null
  /** Eager-loaded on the list endpoint. */
  opening?: { id: number; title: string } | null
}

export interface ApplicationFilters {
  status?: JobApplicationStatus | ''
  search?: string
  opening_id?: number | ''
}

export interface ApplicationSummary {
  total: number
  by_status: Record<JobApplicationStatus, number>
}

let applications: JobApplication[] = []
let applicationsReady = false

async function loadApplications(filters: ApplicationFilters = {}) {
  try {
    const res = await http.get<{ data: JobApplication[] }>('/api/job-applications', {
      params: {
        status: filters.status || undefined,
        search: filters.search || undefined,
        opening_id: filters.opening_id || undefined,
      },
    })
    applications = res.data.data ?? []
  } catch {
    // Keep the last known list on failure.
  }
  applicationsReady = true
  emit()
}

export function useApplications(): JobApplication[] {
  useSyncExternalStore(subscribe, () => applications)
  return applications
}

export function useApplicationsReady(): boolean {
  useSyncExternalStore(subscribe, () => applicationsReady)
  return applicationsReady
}

export function refreshApplications(filters: ApplicationFilters = {}): Promise<void> {
  return loadApplications(filters)
}

/** The recruitment dashboard counters, or null before the first load resolves. */
export async function fetchApplicationSummary(): Promise<ApplicationSummary | null> {
  const res = await http.get<{ data: ApplicationSummary }>('/api/job-applications/summary')
  return res.data.data
}

export async function updateApplicationStatus(
  id: number,
  status: JobApplicationStatus,
): Promise<void> {
  await http.patch(`/api/job-applications/${id}/status`, { status })
  await refreshApplications()
}

export async function updateApplicationNote(
  id: number,
  adminNote: string | null,
): Promise<void> {
  await http.put(`/api/job-applications/${id}/note`, {
    admin_note: adminNote && adminNote.trim() ? adminNote.trim() : null,
  })
  await refreshApplications()
}

export async function deleteApplication(id: number): Promise<void> {
  await http.delete(`/api/job-applications/${id}`)
  await refreshApplications()
}

/** The HR download endpoint for an applicant's CV or certificates. */
export function applicationAttachmentUrl(
  id: number,
  kind: 'cv' | 'certificates',
): string {
  return `/api/job-applications/${id}/attachment?kind=${kind}`
}

/* ---- Public: submit an application ---- */

export interface ApplicationInput {
  opening_id?: number
  position_applied_for: string
  full_name: string
  gender?: string
  date_of_birth?: string
  phone: string
  email: string
  address?: string
  education?: string
  work_experience?: string
  skills?: string
  years_of_experience?: number
  cover_letter?: string
  consent: boolean
  cv: File
  certificates?: File
}

export interface ApplicationReceipt {
  application_number: string
  position_applied_for: string
  applied_at: string
}

export async function submitApplication(
  input: ApplicationInput,
): Promise<ApplicationReceipt> {
  const body = new FormData()
  body.append('position_applied_for', input.position_applied_for)
  body.append('full_name', input.full_name)
  body.append('phone', input.phone)
  body.append('email', input.email)
  body.append('consent', input.consent ? '1' : '0')

  if (input.opening_id) body.append('opening_id', String(input.opening_id))
  if (input.gender) body.append('gender', input.gender)
  if (input.date_of_birth) body.append('date_of_birth', input.date_of_birth)
  if (input.address) body.append('address', input.address)
  if (input.education) body.append('education', input.education)
  if (input.work_experience) body.append('work_experience', input.work_experience)
  if (input.skills) body.append('skills', input.skills)
  if (input.years_of_experience !== undefined && input.years_of_experience !== null) {
    body.append('years_of_experience', String(input.years_of_experience))
  }
  if (input.cover_letter) body.append('cover_letter', input.cover_letter)
  body.append('cv', input.cv)
  if (input.certificates) body.append('certificates', input.certificates)

  const res = await http.post<{ data: ApplicationReceipt }>('/api/job-applications', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data.data
}