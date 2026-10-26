import { useSyncExternalStore } from 'react'
import type {
  Project,
  ProjectCategory,
  ProjectDocument,
  ProjectHistoryEntry,
  ProjectPhoto,
  ProjectStatus,
} from '../data/projects'
import { projectImages } from '../data/images'
import { http } from './api'

/* ============================================================================
   projectsStore — API-backed content store for the OBM "Work" section.
   The database (MySQL via Laravel) is the single source of truth.

   HOW IT WORKS
   - On module load, projects are fetched from GET /api/projects.
   - The public site and admin panel both read from the in-memory cache, which
     re-renders via useSyncExternalStore whenever it changes.
   - Every admin mutation calls the Laravel API, then refreshes the cache.

   Auth note: read helpers are public (no auth). Every mutation is backend
   protected by Sanctum — a 401 is thrown when the session is missing.
   ========================================================================== */

type Listener = () => void

let projects: Project[] = []
let status: 'loading' | 'ready' | 'error' = 'loading'
const listeners = new Set<Listener>()

/** Read an optional text column as '' rather than null/undefined. */
function text(row: Record<string, unknown>, key: string): string | undefined {
  const value = row[key]
  return value === null || value === undefined || value === ''
    ? undefined
    : String(value)
}

/** Read a numeric column, defaulting to null when the column is empty. */
function amount(row: Record<string, unknown>, key: string): number | null {
  const value = Number(row[key])
  return Number.isFinite(value) ? value : null
}

/** Normalise a DB row (nullable fields, JSON arrays) into the Project shape. */
function normalize(row: Record<string, unknown>): Project {
  const scope = Array.isArray(row.scope) ? row.scope : []
  const gallery = Array.isArray(row.gallery) ? row.gallery : []
  return {
    id: (row.id as number) ?? undefined,
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    category: (row.category as ProjectCategory) || 'Commercial',
    year: text(row, 'year') ?? '',
    location: text(row, 'location') ?? '',
    status: (row.status as ProjectStatus) || 'Upcoming',
    client: text(row, 'client') ?? '',
    consultant: text(row, 'consultant'),
    contractor: text(row, 'contractor'),
    region: text(row, 'region'),
    contract_amount: amount(row, 'contract_amount'),
    currency: text(row, 'currency'),
    contract_date: text(row, 'contract_date'),
    start_date: text(row, 'start_date'),
    completion_date: text(row, 'completion_date'),
    acceptance_date: text(row, 'acceptance_date'),
    physical_progress: amount(row, 'physical_progress') ?? 0,
    financial_progress: amount(row, 'financial_progress') ?? 0,
    description: text(row, 'description') ?? '',
    overview: text(row, 'overview') ?? '',
    challenge: text(row, 'challenge') ?? '',
    approach: text(row, 'approach') ?? '',
    result: text(row, 'result') ?? '',
    visual: (row.visual as Project['visual']) || 'facade',
    variant: row.variant ? Number(row.variant) : undefined,
    image: text(row, 'image'),
    size: (row.size as Project['size']) || 'standard',
    featured: Boolean(row.featured),
    scope: scope as Project['scope'],
    gallery: gallery as Project['gallery'],
    photos: Array.isArray(row.photos) ? (row.photos as ProjectPhoto[]) : [],
    history: Array.isArray(row.histories) ? (row.histories as ProjectHistoryEntry[]) : [],
    documents: Array.isArray(row.documents) ? (row.documents as ProjectDocument[]) : [],
    display_image: text(row, 'display_image'),
    cover_photo_url: text(row, 'cover_photo_url'),
  }
}

function emit() {
  listeners.forEach((l) => l())
}

async function refresh(query: ProjectQuery = {}) {
  try {
    const res = await http.get<{ data: Array<Record<string, unknown>> }>(
      '/api/projects',
      { params: query },
    )
    projects = (res.data.data ?? []).map(normalize)
    status = 'ready'
  } catch {
    projects = []
    status = 'error'
  }
  emit()
}

/** Trigger a read from the API and update local state. */
export function refreshProjects(query: ProjectQuery = {}): Promise<void> {
  return refresh(query)
}

void refresh()

/* ---- Public read helpers ---- */

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getRelatedProjects(project: Project, count = 3): Project[] {
  const sameCategory = projects.filter(
    (p) => p.slug !== project.slug && p.category === project.category,
  )
  const others = projects.filter(
    (p) => p.slug !== project.slug && p.category !== project.category,
  )
  return [...sameCategory, ...others].slice(0, count)
}

/**
 * The translation key fragment for a status, used as
 * `projects.status.${projectStatusKey(status)}`.
 */
export function projectStatusKey(status: ProjectStatus): string {
  return status === 'Under Maintenance'
    ? 'maintenance'
    : status.toLowerCase().replace(/\s+/g, '_')
}

export { projectCategories } from '../data/projects'

/** The project lifecycle values, matching App\Enums\ProjectStatus. */
export const projectStatuses: ProjectStatus[] = [
  'Upcoming',
  'Ongoing',
  'Completed',
  'Accepted',
  'Under Maintenance',
  'Suspended',
]

/**
 * The automatic categories a visitor may browse. Each one is derived from a
 * project's status or recency on the server, so nothing moves by hand.
 */
export type ProjectGroup =
  | 'latest'
  | 'previous'
  | 'ongoing'
  | 'completed'
  | 'accepted'
  | 'upcoming'

export const projectGroups: ProjectGroup[] = [
  'latest',
  'previous',
  'ongoing',
  'completed',
  'accepted',
  'upcoming',
]

/** The filters the /projects page can submit to GET /api/projects. */
export interface ProjectQuery {
  search?: string
  group?: ProjectGroup
  status?: ProjectStatus
  region?: string
  year?: string
  category?: ProjectCategory
}

/**
 * The principal image for a project: uploaded photography wins over the
 * illustration registry, and the illustration registry wins over nothing.
 */
export function getProjectImage(project: Project): string {
  if (project.display_image) return project.display_image
  if (project.image) return project.image
  return projectImages[project.slug] ?? ''
}

/* ---- Store subscription hook ---- */

export function useProjects(): Project[] {
  useSyncExternalStore(subscribe, getSnapshot)
  return projects
}

export function useProjectsStatus(): 'loading' | 'ready' | 'error' {
  useSyncExternalStore(subscribe, getStatusSnapshot)
  return status
}

export function getProjectsSnapshot(): Project[] {
  return projects
}

function getSnapshot(): Project[] {
  return projects
}

function getStatusSnapshot(): 'loading' | 'ready' | 'error' {
  return status
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/* ---- Admin CRUD (mutations) ---- */

function findId(slug: string): number | undefined {
  return projects.find((p) => p.slug === slug)?.id
}

export async function createProject(
  input: Omit<Project, 'slug'>,
): Promise<Project> {
  const res = await http.post<{ data: Record<string, unknown> }>(
    '/api/projects',
    input,
  )
  await refresh()
  return normalize(res.data.data)
}

export async function updateProject(
  slug: string,
  patch: Partial<Omit<Project, 'slug'>>,
): Promise<Project | undefined> {
  const id = findId(slug)
  if (!id) return undefined
  const res = await http.put<{ data: Record<string, unknown> }>(
    `/api/projects/${id}`,
    patch,
  )
  await refresh()
  return normalize(res.data.data)
}

export async function deleteProject(slug: string): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.delete(`/api/projects/${id}`)
  await refresh()
}

export async function reorderProject(
  slug: string,
  direction: 'up' | 'down',
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  const res = await http.post<{ data: Array<Record<string, unknown>> }>(
    `/api/projects/${id}/reorder`,
    { direction },
  )
  projects = (res.data.data ?? []).map(normalize)
  emit()
}

export async function setFeaturedProject(slug: string): Promise<void> {
  const id = findId(slug)
  if (!id) return
  const res = await http.post<{ data: Array<Record<string, unknown>> }>(
    `/api/projects/${id}/featured`,
  )
  projects = (res.data.data ?? []).map(normalize)
  emit()
}

/* ---- Admin: photography ---- */

/** Upload one or more project photographs. The first becomes the cover. */
export async function uploadProjectPhotos(
  slug: string,
  photos: File[],
  caption?: string,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  const body = new FormData()
  photos.forEach((file) => body.append('photos[]', file))
  if (caption) body.append('caption', caption)

  await http.post(`/api/projects/${id}/photos`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  await refresh()
}

/** Update a photograph's caption. */
export async function updateProjectPhoto(
  slug: string,
  photoId: number,
  caption: string | null,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.patch(`/api/projects/${id}/photos/${photoId}`, { caption })
  await refresh()
}

/** Promote a photograph to be the project cover. */
export async function setProjectPhotoCover(
  slug: string,
  photoId: number,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.post(`/api/projects/${id}/photos/${photoId}/cover`)
  await refresh()
}

/** Move a photograph within the gallery ordering. */
export async function reorderProjectPhoto(
  slug: string,
  photoId: number,
  direction: 'up' | 'down',
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.post(`/api/projects/${id}/photos/reorder`, { photo_id: photoId, direction })
  await refresh()
}

/** Delete a photograph and its file. */
export async function deleteProjectPhoto(
  slug: string,
  photoId: number,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.delete(`/api/projects/${id}/photos/${photoId}`)
  await refresh()
}

/* ---- Admin: history timeline ---- */

/** Record a dated milestone on the project history timeline. */
export async function addProjectHistory(
  slug: string,
  entry: { occurred_on: string; title: string; description?: string | null },
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.post(`/api/projects/${id}/histories`, entry)
  await refresh()
}

/** Update an existing timeline entry. */
export async function updateProjectHistory(
  slug: string,
  historyId: number,
  patch: Partial<{ occurred_on: string; title: string; description: string | null }>,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.put(`/api/projects/${id}/histories/${historyId}`, patch)
  await refresh()
}

/** Delete a timeline entry. */
export async function deleteProjectHistory(
  slug: string,
  historyId: number,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.delete(`/api/projects/${id}/histories/${historyId}`)
  await refresh()
}

/* ---- Admin: documents ---- */

/** Attach a downloadable document to a project. */
export async function uploadProjectDocument(
  slug: string,
  document: File,
  title?: string,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  const body = new FormData()
  body.append('document', document)
  if (title) body.append('title', title)

  await http.post(`/api/projects/${id}/documents`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  await refresh()
}

/** Delete a project document and its file. */
export async function deleteProjectDocument(
  slug: string,
  documentId: number,
): Promise<void> {
  const id = findId(slug)
  if (!id) return
  await http.delete(`/api/projects/${id}/documents/${documentId}`)
  await refresh()
}

/** The public download endpoint for a project document. */
export function projectDocumentUrl(projectId: number, documentId: number): string {
  return `/api/projects/${projectId}/documents/${documentId}`
}

export async function resetProjects(): Promise<void> {
  const res = await http.post<{ data: Array<Record<string, unknown>> }>(
    '/api/projects/reset',
  )
  projects = (res.data.data ?? []).map(normalize)
  emit()
}

/** Bulk-replace all projects from an exported backup. */
export async function importProjects(
  items: Array<Partial<Omit<Project, 'id'>>>,
): Promise<void> {
  const res = await http.post<{ data: Array<Record<string, unknown>> }>(
    '/api/projects/import',
    { projects: items },
  )
  projects = (res.data.data ?? []).map(normalize)
  emit()
}
