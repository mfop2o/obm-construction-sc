import { useSyncExternalStore } from 'react'
import type { Project, ProjectCategory } from '../data/projects'
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

/** Normalise a DB row (nullable fields, JSON arrays) into the Project shape. */
function normalize(row: Record<string, unknown>): Project {
  const scope = Array.isArray(row.scope) ? row.scope : []
  const gallery = Array.isArray(row.gallery) ? row.gallery : []
  return {
    id: (row.id as number) ?? undefined,
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    category: (row.category as ProjectCategory) || 'Commercial',
    year: row.year ? String(row.year) : '',
    location: row.location ? String(row.location) : '',
    status: (row.status as Project['status']) || 'Upcoming',
    client: row.client ? String(row.client) : '',
    description: row.description ? String(row.description) : '',
    overview: row.overview ? String(row.overview) : '',
    challenge: row.challenge ? String(row.challenge) : '',
    approach: row.approach ? String(row.approach) : '',
    result: row.result ? String(row.result) : '',
    visual: (row.visual as Project['visual']) || 'facade',
    variant: row.variant ? Number(row.variant) : undefined,
    image: row.image ? String(row.image) : undefined,
    size: (row.size as Project['size']) || 'standard',
    featured: Boolean(row.featured),
    scope: scope as Project['scope'],
    gallery: gallery as Project['gallery'],
  }
}

function emit() {
  listeners.forEach((l) => l())
}

async function refresh() {
  try {
    const res = await http.get<{ data: Array<Record<string, unknown>> }>(
      '/api/projects',
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
export function refreshProjects(): Promise<void> {
  return refresh()
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

export const projectCategories: ProjectCategory[] = [
  'Commercial',
  'Residential',
  'Infrastructure',
  'Mixed-Use',
  'Renovation',
]

export function getProjectImage(project: Project): string {
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
