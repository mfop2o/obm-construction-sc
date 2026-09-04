import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project, ProjectCategory } from '../../data/projects'
import {
  createProject,
  getProjectBySlug,
  projectCategories,
  updateProject,
  useProjects,
} from '../../lib/projectsStore'
import { TextArea, TextInput, Select } from '../../components/admin/fields'
import Button from '../../components/ui/Button'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminProjectEditor — create & edit form for a single project.
   Manages every visible field including scope facts and gallery entries.
   ========================================================================== */

const statuses = ['Completed', 'In Progress', 'Upcoming'] as const
const visuals = ['facade', 'road', 'framework'] as const
const sizes = ['standard', 'tall', 'wide'] as const

interface ScopeRow {
  key: string
  value: string
}

interface GalleryRow {
  visual: (typeof visuals)[number]
  variant: string
  alt: string
}

interface FormState {
  title: string
  category: ProjectCategory | ''
  year: string
  location: string
  status: (typeof statuses)[number] | ''
  client: string
  description: string
  overview: string
  challenge: string
  approach: string
  result: string
  visual: (typeof visuals)[number]
  size: (typeof sizes)[number]
  image: string
  featured: boolean
  scope: ScopeRow[]
  gallery: GalleryRow[]
}

const emptyScope: ScopeRow = { key: '', value: '' }
const emptyGallery: GalleryRow = { visual: 'facade', variant: '1', alt: '' }

function formFromProject(p?: Project): FormState {
  return {
    title: p?.title ?? '',
    category: p?.category ?? '',
    year: p?.year ?? '',
    location: p?.location ?? '',
    status: p?.status ?? '',
    client: p?.client ?? '',
    description: p?.description ?? '',
    overview: p?.overview ?? '',
    challenge: p?.challenge ?? '',
    approach: p?.approach ?? '',
    result: p?.result ?? '',
    visual: p?.visual ?? 'facade',
    size: p?.size ?? 'standard',
    image: p?.image ?? '',
    featured: p?.featured ?? false,
    scope: p?.scope?.length ? p.scope : [emptyScope],
    gallery: p?.gallery?.length
      ? p.gallery.map((g) => ({ visual: g.visual, variant: String(g.variant ?? 1), alt: g.alt }))
      : [emptyGallery],
  }
}

type Errors = Partial<Record<keyof FormState, string>>

export default function AdminProjectEditor() {
  const { slug } = useParams<{ slug: string }>()
  useProjects()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const project = slug ? getProjectBySlug(slug) : undefined
  const { t } = useTranslation()

  const [form, setForm] = useState<FormState>(() => formFromProject(project))
  const [errors, setErrors] = useState<Errors>({})

  function set<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function setScope(index: number, row: ScopeRow) {
    setForm((f) => {
      const scope = f.scope.map((r, i) => (i === index ? row : r))
      return { ...f, scope }
    })
  }

  function setGallery(index: number, row: GalleryRow) {
    setForm((f) => {
      const gallery = f.gallery.map((r, i) => (i === index ? row : r))
      return { ...f, gallery }
    })
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.category) e.category = 'Select a category.'
    if (!form.status) e.status = 'Select a status.'
    const scopeKeys = form.scope
      .map((r) => r.key.trim())
      .filter(Boolean)
      .map((k) => k.toLowerCase())
    if (scopeKeys.length !== new Set(scopeKeys).size) {
      e.scope = 'Scope keys must be unique.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    const scope = form.scope
      .filter((r) => r.key.trim() && r.value.trim())
      .map((r) => ({ key: r.key.trim(), value: r.value.trim() }))

    const gallery = form.gallery
      .filter((g) => g.alt.trim())
      .map((g) => ({
        visual: g.visual,
        variant: Number(g.variant) || 1,
        alt: g.alt.trim(),
      }))

    const base = {
      title: form.title.trim(),
      category: form.category as ProjectCategory,
      year: form.year.trim(),
      location: form.location.trim(),
      status: form.status as Project['status'],
      client: form.client.trim(),
      description: form.description.trim(),
      overview: form.overview.trim(),
      challenge: form.challenge.trim(),
      approach: form.approach.trim(),
      result: form.result.trim(),
      visual: form.visual,
      size: form.size,
      image: form.image.trim() || undefined,
      featured: form.featured,
      scope,
      gallery,
    }

    if (isEdit && slug) {
      try {
        await updateProject(slug, base)
        navigate('/admin/projects')
      } catch {
        setErrors((e) => ({ ...e, title: 'Could not save. Check your connection or session.' }))
      }
    } else {
      try {
        await createProject(base)
        navigate('/admin/projects')
      } catch {
        setErrors((e) => ({ ...e, title: 'Could not create project. Check your connection or session.' }))
      }
    }
  }

  // If editing a slug that no longer exists, show a not-found state.
  if (isEdit && slug && !project) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-bold text-primary-950">
          Project not found
        </h1>
        <Button as="link" to="/admin/projects">
          Back to projects
        </Button>
      </div>
    )
  }

  function addScopeRow() {
    setForm((f) => ({ ...f, scope: [...f.scope, emptyScope] }))
  }

  function removeScopeRow(index: number) {
    setForm((f) => ({
      ...f,
      scope: f.scope.length > 1 ? f.scope.filter((_, i) => i !== index) : [emptyScope],
    }))
  }

  function addGalleryRow() {
    setForm((f) => ({ ...f, gallery: [...f.gallery, emptyGallery] }))
  }

  function removeGalleryRow(index: number) {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.length > 1 ? f.gallery.filter((_, i) => i !== index) : [emptyGallery],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {isEdit ? t('admin.projects.editProject', 'Edit project') : t('admin.projects.newProject')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {isEdit ? `Editing "${form.title || slug}"` : t('admin.projects.fillFields', 'Fill in the fields below.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
            {t('admin.projects.cancel', 'Cancel')}
          </Button>
          <Button type="submit">{isEdit ? t('admin.projects.saveChanges', 'Save changes') : t('admin.projects.createProject')}</Button>
        </div>
      </header>

      {/* Core */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">{t('admin.projects.coreInfo', 'Core info')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextInput id="title" label={t('admin.projects.titleField', 'Title')} required value={form.title} error={errors.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Riverside Community Center" />
          </div>
          <Select id="category" label={t('admin.projects.category', 'Category')} required value={form.category} error={errors.category} onChange={(e) => set('category', e.target.value as ProjectCategory)} options={projectCategories.map((c) => ({ value: c, label: c }))} placeholder={t('admin.projects.selectCategory', 'Select a category')} />
          <Select id="status" label={t('admin.projects.status', 'Status')} required value={form.status} error={errors.status} onChange={(e) => set('status', e.target.value as FormState['status'])} options={statuses.map((s) => ({ value: s, label: s }))} placeholder={t('admin.projects.selectStatus', 'Select a status')} />
          <TextInput id="year" label={t('admin.projects.year', 'Year')} value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="e.g. 2023" />
          <TextInput id="location" label={t('admin.projects.location', 'Location')} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Addis Ababa, Ethiopia" />
          <TextInput id="client" label={t('admin.projects.client', 'Client')} value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Client organisation (optional)" />
          <TextInput id="image" label={t('admin.projects.imageUrl', 'Image URL')} value={form.image} onChange={(e) => set('image', e.target.value)} hint="Optional. Overrides the default illustration. Paste a photo URL." />
        </div>
      </section>

      {/* Text */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">{t('admin.projects.copy', 'Copy')}</h2>
        <div className="flex flex-col gap-4">
          <TextInput id="description" label={t('admin.projects.shortDescription', 'Short description (cards & meta)')} value={form.description} onChange={(e) => set('description', e.target.value)} />
          <TextArea id="overview" label={t('admin.projects.overview', 'Overview')} rows={3} value={form.overview} onChange={(e) => set('overview', e.target.value)} />
          <TextArea id="challenge" label={t('admin.projects.challenge', 'Challenge')} rows={3} value={form.challenge} onChange={(e) => set('challenge', e.target.value)} hint="The problem section of the detail page." />
          <TextArea id="approach" label={t('admin.projects.approach', 'Approach')} rows={3} value={form.approach} onChange={(e) => set('approach', e.target.value)} />
          <TextArea id="result" label={t('admin.projects.result', 'Result')} rows={3} value={form.result} onChange={(e) => set('result', e.target.value)} />
        </div>
      </section>

      {/* Presentation */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">{t('admin.projects.presentation', 'Presentation')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="visual" label={t('admin.projects.visualStyle', 'Visual style')} value={form.visual} onChange={(e) => set('visual', e.target.value as (typeof visuals)[number])} options={visuals.map((v) => ({ value: v, label: v }))} />
          <Select id="size" label={t('admin.projects.gridSize', 'Grid size')} value={form.size} onChange={(e) => set('size', e.target.value as (typeof sizes)[number])} options={sizes.map((s) => ({ value: s, label: s }))} />
        </div>
        <label className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-900">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 accent-accent-400"
          />
          {t('admin.projects.featureThis', 'Feature this project (shown in the featured banner)')}
        </label>
      </section>

      {/* Scope */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-primary-950">{t('admin.projects.scopeFacts', 'Scope facts')}</h2>
          <Button type="button" size="sm" variant="outline" onClick={addScopeRow}>{t('admin.projects.addRow', 'Add row')}</Button>
        </div>
        {errors.scope && <p className="mb-3 text-xs font-medium text-red-600">{errors.scope}</p>}
        <div className="flex flex-col gap-3">
          {form.scope.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <TextInput id={`scope-key-${i}`} label={i === 0 ? t('admin.projects.key', 'Key') : ''} value={row.key} onChange={(e) => setScope(i, { ...row, key: e.target.value })} placeholder="e.g. Area" />
              <TextInput id={`scope-value-${i}`} label={i === 0 ? t('admin.projects.value', 'Value') : ''} value={row.value} onChange={(e) => setScope(i, { ...row, value: e.target.value })} placeholder="e.g. 12,000 m²" />
              <button type="button" onClick={() => removeScopeRow(i)} aria-label={`Remove scope row ${i + 1}`} className="inline-flex h-12 items-center justify-center px-2 text-concrete hover:text-red-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-primary-950">{t('admin.projects.gallery', 'Gallery')}</h2>
          <Button type="button" size="sm" variant="outline" onClick={addGalleryRow}>{t('admin.projects.addImage', 'Add image')}</Button>
        </div>
        <div className="flex flex-col gap-3">
          {form.gallery.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
              <TextInput id={`gallery-alt-${i}`} label={i === 0 ? t('admin.projects.captionAlt', 'Caption / alt text') : ''} value={row.alt} onChange={(e) => setGallery(i, { ...row, alt: e.target.value })} placeholder="Describe the image" />
              <Select id={`gallery-visual-${i}`} label={i === 0 ? t('admin.projects.visual', 'Visual') : ''} value={row.visual} onChange={(e) => setGallery(i, { ...row, visual: e.target.value as (typeof visuals)[number] })} options={visuals.map((v) => ({ value: v, label: v }))} />
              <div className="flex items-center gap-1">
                <TextInput id={`gallery-variant-${i}`} label={i === 0 ? t('admin.projects.variant', 'Variant') : ''} value={row.variant} onChange={(e) => setGallery(i, { ...row, variant: e.target.value })} className="w-20" />
                <button type="button" onClick={() => removeGalleryRow(i)} aria-label={`Remove gallery image ${i + 1}`} className="inline-flex h-12 items-center justify-center px-2 text-concrete hover:text-red-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-concrete">
          Gallery images use the site's visual styles. Photo URLs for individual
          gallery slots are not yet supported — the featured image URL above and
          the seed registry apply.
        </p>
      </section>

      <div className="flex items-center justify-end gap-2 pb-4">
        <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>{t('admin.projects.cancel', 'Cancel')}</Button>
        <Button type="submit">{isEdit ? t('admin.projects.saveChanges', 'Save changes') : t('admin.projects.createProject')}</Button>
      </div>
    </form>
  )
}
