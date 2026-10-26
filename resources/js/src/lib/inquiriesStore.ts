import { useSyncExternalStore } from 'react'
import { http } from './api'

/* ============================================================================
   inquiriesStore — API-backed store for project inquiries ("Request a Quote").
   Mirrors the contentStore contact pattern: the admin list is fetched once at
   module load, cached in-memory, and re-rendered via useSyncExternalStore.
   Every admin mutation calls the Laravel API then refreshes the cache.

   Public submission goes directly through `submitInquiry` (no caching needed —
   the visitor gets back only the created id). Admin reads/mutations are
   Sanctum-protected.
   ========================================================================== */

type Listener = () => void

export interface Inquiry {
  id: number
  name: string
  company: string | null
  email: string
  phone: string | null
  project_type: string | null
  project_location: string | null
  budget_range: string | null
  start_timeline: string | null
  message: string
  preferred_contact: string | null
  consent: boolean
  attachment_path: string | null
  attachment_name: string | null
  attachment_size: number | null
  attachment_mime: string | null
  status: string
  internal_note: string | null
  follow_up_at: string | null
  read: boolean
  created_at: string
  updated_at: string
  attachment_url?: string | null
}

let inquiries: Inquiry[] = []
let ready = false
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((l) => l())
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function refreshInquiries() {
  try {
    const res = await http.get<{ data: Inquiry[] }>('/api/inquiries')
    inquiries = res.data.data ?? []
  } catch {
    // Keep last known values on failure.
  }
  ready = true
  emit()
}

export function useInquiries(): Inquiry[] {
  useSyncExternalStore(subscribe, () => inquiries)
  return inquiries
}

export function useInquiriesReady(): boolean {
  useSyncExternalStore(subscribe, () => ready)
  return ready
}

export function refreshInquiriesSync(): void {
  void refreshInquiries()
}

void refreshInquiries()

/* ---- Public: submit a project inquiry / request a quote ---- */

export interface InquiryInput {
  name: string
  company?: string
  email: string
  phone?: string
  project_type?: string
  project_location?: string
  budget_range?: string
  start_timeline?: string
  message: string
  preferred_contact?: 'email' | 'phone'
  consent: boolean
  attachment?: File
}

export async function submitInquiry(input: InquiryInput): Promise<{ id: number }> {
  const fd = new FormData()
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === false) continue
    if (key === 'attachment' && value instanceof File) {
      fd.append('attachment', value)
      continue
    }
    fd.append(key, String(value))
  }
  // consent must be sent as truthy string so the API's `accepted` rule matches.
  if (input.consent) fd.set('consent', '1')

  // Store original name so the visitor can see it too.
  if (input.attachment) {
    fd.append('attachment_name', input.attachment.name)
  }

  const res = await http.post<{ data: { id: number } }>('/api/inquiries', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

/* ---- Admin mutations ---- */

export async function updateInquiryStatus(id: number, status: string): Promise<void> {
  await http.patch(`/api/inquiries/${id}/status`, { status })
  await refreshInquiries()
}

export async function updateInquiryRead(id: number, read: boolean): Promise<void> {
  await http.patch(`/api/inquiries/${id}/read`, { read })
  await refreshInquiries()
}

export async function updateInquiryNote(
  id: number,
  input: { internal_note?: string | null; follow_up_at?: string | null },
): Promise<void> {
  await http.put(`/api/inquiries/${id}/note`, input)
  await refreshInquiries()
}

export async function deleteInquiry(id: number): Promise<void> {
  await http.delete(`/api/inquiries/${id}`)
  await refreshInquiries()
}
