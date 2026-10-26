import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, FileText, Star, Trash2, Upload } from 'lucide-react'
import type {
  Project,
  ProjectCategory,
  ProjectHistoryEntry,
  ProjectStatus,
} from '../../data/projects'
import {
  addProjectHistory,
  createProject,
  deleteProjectDocument,
  deleteProjectHistory,
  deleteProjectPhoto,
  getProjectBySlug,
  projectCategories,
  projectStatuses,
  projectStatusKey,
  reorderProjectPhoto,
  setProjectPhotoCover,
  updateProject,
  updateProjectHistory,
  updateProjectPhoto,
  uploadProjectDocument,
  uploadProjectPhotos,
  useProjects,
} from '../../lib/projectsStore'
import { TextArea, TextInput, Select } from '../../components/admin/fields'
import { DeleteButton } from '../../components/admin/actions'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminProjectEditor — create & edit form for a single project.

   The scalar record (core info, contract facts, copy, presentation, scope)
   is saved as one request. Photography, the history timeline and documents are
   managed by their own endpoints, so each row action saves immediately instead
   of forcing a whole-project resubmit.
   ========================================================================== */

const visuals = ['facade', 'road', 'framework'] as const
const sizes = ['standard', 'tall', 'wide'] as const

interface ScopeRow {
  key: string
  value: string
}

interface HistoryDraft {
  occurred_on: string
  title: string
  description: string
}

interface FormState {
  title: string
  category: ProjectCategory | ''
  year: string
  location: string
  region: string
  status: ProjectStatus | ''
  client: string
  consultant: string
  contractor: string
  contract_amount: string
  currency: string
  contract_date: string
  start_date: string
  completion_date: string
  acceptance_date: string
  physical_progress: string
  financial_progress: string
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
  gallery: Project['gallery']
}

const emptyScope: ScopeRow = { key: '', value: '' }
const emptyHistory: HistoryDraft = { occurred_on: '', title: '', description: '' }

function num(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Only send a field when it holds something, so blanks clear the column. */
function orNull(value: string): string | null {
  return value.trim() === '' ? null : value.trim()
}

function formFromProject(p?: Project): FormState {
  return {
    title: p?.title ?? '',
    category: p?.category ?? '',
    year: p?.year ?? '',
    location: p?.location ?? '',
    region: p?.region ?? '',
    status: p?.status ?? '',
    client: p?.client ?? '',
    consultant: p?.consultant ?? '',
    contractor: p?.contractor ?? '',
    contract_amount: p?.contract_amount === null || p?.contract_amount === undefined ? '' : String(p.contract_amount),
    currency: p?.currency ?? '',
    contract_date: p?.contract_date ?? '',
    start_date: p?.start_date ?? '',
    completion_date: p?.completion_date ?? '',
    acceptance_date: p?.acceptance_date ?? '',
    physical_progress: p?.physical_progress === undefined ? '' : String(p.physical_progress),
    financial_progress: p?.financial_progress === undefined ? '' : String(p.financial_progress),
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
    gallery: p?.gallery ?? [],
  }
}

type Errors = Partial<Record<keyof FormState, string>>

/** The payload the project endpoints accept, without the relation arrays. */
type ProjectPayload = Omit<Project, 'slug' | 'photos' | 'history' | 'documents'>

export default function AdminProjectEditor() {
  const { slug } = useParams<{ slug: string }>()
  useProjects()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const project = slug ? getProjectBySlug(slug) : undefined

  const [form, setForm] = useState<FormState>(() => formFromProject(project))
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [banner, setBanner] = useState('')

  /* ---- photography ---- */
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoCaption, setPhotoCaption] = useState('')
  const [busyPhoto, setBusyPhoto] = useState(false)
  const photoInput = useRef<HTMLInputElement>(null)

  /* ---- history ---- */
  const [historyDraft, setHistoryDraft] = useState<HistoryDraft>(emptyHistory)
  const [busyHistory, setBusyHistory] = useState(false)

  /* ---- documents ---- */
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState('')
  const [busyDocument, setBusyDocument] = useState(false)
  const documentInput = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function setScopeRow(index: number, row: ScopeRow) {
    setForm((f) => ({ ...f, scope: f.scope.map((r, i) => (i === index ? row : r)) }))
  }

  function setGalleryRow(index: number, row: Project['gallery'][number]) {
    setForm((f) => ({ ...f, gallery: f.gallery.map((r, i) => (i === index ? row : r)) }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.title.trim()) e.title = t('admin.projects.validation.titleRequired')
    if (!form.category.trim()) e.category = t('admin.projects.validation.categoryRequired')
    if (!form.status) e.status = t('admin.projects.validation.statusRequired')

    const scopeKeys = form.scope
      .map((r) => r.key.trim())
      .filter(Boolean)
      .map((k) => k.toLowerCase())
    if (scopeKeys.length !== new Set(scopeKeys).size) {
      e.scope = t('admin.projects.validation.scopeKeysUnique')
    }

    const physical = num(form.physical_progress)
    if (physical !== null && (physical < 0 || physical > 100)) {
      e.physical_progress = t('admin.projects.validation.progressRange')
    }
    const financial = num(form.financial_progress)
    if (financial !== null && (financial < 0 || financial > 100)) {
      e.financial_progress = t('admin.projects.validation.progressRange')
    }
    if (form.completion_date && form.start_date && form.completion_date < form.start_date) {
      e.completion_date = t('admin.projects.validation.completionAfterStart')
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    const payload: ProjectPayload = {
      title: form.title.trim(),
      category: form.category as ProjectCategory,
      year: form.year.trim(),
      location: form.location.trim(),
      region: orNull(form.region) ?? undefined,
      status: form.status as ProjectStatus,
      client: form.client.trim(),
      consultant: orNull(form.consultant) ?? undefined,
      contractor: orNull(form.contractor) ?? undefined,
      contract_amount: num(form.contract_amount),
      currency: orNull(form.currency) ?? undefined,
      contract_date: orNull(form.contract_date),
      start_date: orNull(form.start_date),
      completion_date: orNull(form.completion_date),
      acceptance_date: orNull(form.acceptance_date),
      physical_progress: num(form.physical_progress) ?? 0,
      financial_progress: num(form.financial_progress) ?? 0,
      description: form.description.trim(),
      overview: form.overview.trim(),
      challenge: form.challenge.trim(),
      approach: form.approach.trim(),
      result: form.result.trim(),
      visual: form.visual,
      size: form.size,
      image: orNull(form.image) ?? undefined,
      featured: form.featured,
      scope: form.scope
        .filter((r) => r.key.trim() && r.value.trim())
        .map((r) => ({ key: r.key.trim(), value: r.value.trim() })),
      gallery: form.gallery.filter((g) => g.alt.trim()),
    }

    setSaving(true)
    setBanner('')
    try {
      if (isEdit && slug) {
        await updateProject(slug, payload)
        navigate('/admin/projects')
      } else {
        await createProject({ ...payload, photos: [], history: [], documents: [] })
        navigate('/admin/projects')
      }
    } catch {
      setErrors((e) => ({ ...e, title: t('admin.projects.validation.saveFailed') }))
      setSaving(false)
    }
  }

  /* ---- photography handlers ---- */

  async function handlePhotoUpload() {
    if (!slug || photoFiles.length === 0) return
    setBusyPhoto(true)
    setBanner('')
    try {
      await uploadProjectPhotos(slug, photoFiles, photoCaption || undefined)
      setPhotoFiles([])
      setPhotoCaption('')
      if (photoInput.current) photoInput.current.value = ''
    } catch {
      setBanner(t('admin.projects.validation.photoUploadFailed'))
    } finally {
      setBusyPhoto(false)
    }
  }

  async function saveCaption(photoId: number, caption: string) {
    if (!slug) return
    await updateProjectPhoto(slug, photoId, caption.trim() || null)
  }

  /* ---- history handlers ---- */

  async function submitHistory() {
    if (!slug || !historyDraft.occurred_on || !historyDraft.title.trim()) return
    setBusyHistory(true)
    try {
      await addProjectHistory(slug, {
        occurred_on: historyDraft.occurred_on,
        title: historyDraft.title.trim(),
        description: historyDraft.description.trim() || null,
      })
      setHistoryDraft(emptyHistory)
    } finally {
      setBusyHistory(false)
    }
  }

  async function patchHistory(entry: ProjectHistoryEntry, patch: Partial<HistoryDraft>) {
    if (!slug) return
    await updateProjectHistory(slug, entry.id, {
      occurred_on: patch.occurred_on ?? entry.occurred_on,
      title: patch.title ?? entry.title,
      description: patch.description ?? entry.description,
    })
  }

  /* ---- document handlers ---- */

  async function submitDocument() {
    if (!slug || !documentFile) return
    setBusyDocument(true)
    setBanner('')
    try {
      await uploadProjectDocument(slug, documentFile, documentTitle || undefined)
      setDocumentFile(null)
      setDocumentTitle('')
      if (documentInput.current) documentInput.current.value = ''
    } catch {
      setBanner(t('admin.projects.validation.documentUploadFailed'))
    } finally {
      setBusyDocument(false)
    }
  }

  if (isEdit && slug && !project) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-bold text-primary-950">
          {t('admin.projects.notFound')}
        </h1>
        <Button as="link" to="/admin/projects">
          {t('admin.projects.backToProjects')}
        </Button>
      </div>
    )
  }

  const photos = project?.photos ?? []
  const history = project?.history ?? []
  const documents = project?.documents ?? []

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {isEdit ? t('admin.projects.editProject') : t('admin.projects.newProject')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {isEdit ? form.title || slug : t('admin.projects.fillFields')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
            {t('admin.projects.cancel')}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? t('admin.projects.saving')
              : isEdit
                ? t('admin.projects.saveChanges')
                : t('admin.projects.createProject')}
          </Button>
        </div>
      </header>

      {banner && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {banner}
        </p>
      )}

      {/* ---- Core ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.coreInfo')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextInput
              id="title"
              label={t('admin.projects.titleField')}
              required
              value={form.title}
              error={errors.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>
          <Select
            id="category"
            label={t('admin.projects.category')}
            required
            value={form.category}
            error={errors.category}
            placeholder={t('admin.projects.selectCategory')}
            onChange={(e) => set('category', e.target.value)}
            options={projectCategories.map((c) => ({ value: c, label: c }))}
          />
          <Select
            id="status"
            label={t('admin.projects.status')}
            required
            value={form.status}
            error={errors.status}
            placeholder={t('admin.projects.selectStatus')}
            onChange={(e) => set('status', e.target.value as ProjectStatus)}
            options={projectStatuses.map((s) => ({
              value: s,
              label: t(`projects.status.${projectStatusKey(s)}`),
            }))}
          />
          <TextInput
            id="year"
            label={t('admin.projects.year')}
            value={form.year}
            onChange={(e) => set('year', e.target.value)}
          />
          <TextInput
            id="location"
            label={t('admin.projects.location')}
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
          />
          <TextInput
            id="region"
            label={t('admin.projects.region')}
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
          />
          <TextInput
            id="client"
            label={t('admin.projects.client')}
            value={form.client}
            onChange={(e) => set('client', e.target.value)}
          />
          <TextInput
            id="consultant"
            label={t('admin.projects.consultant')}
            value={form.consultant}
            onChange={(e) => set('consultant', e.target.value)}
          />
          <TextInput
            id="contractor"
            label={t('admin.projects.contractor')}
            value={form.contractor}
            onChange={(e) => set('contractor', e.target.value)}
          />
          <TextInput
            id="image"
            label={t('admin.projects.imageUrl')}
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            hint={t('admin.projects.imageUrlHint')}
          />
        </div>
      </section>

      {/* ---- Contract facts ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.contractFacts')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput
            id="contract_amount"
            label={t('admin.projects.contractAmount')}
            type="number"
            min="0"
            step="0.01"
            value={form.contract_amount}
            onChange={(e) => set('contract_amount', e.target.value)}
          />
          <TextInput
            id="currency"
            label={t('admin.projects.currency')}
            value={form.currency}
            onChange={(e) => set('currency', e.target.value)}
            placeholder="ETB"
          />
          <TextInput
            id="physical_progress"
            label={t('admin.projects.physicalProgress')}
            type="number"
            min="0"
            max="100"
            value={form.physical_progress}
            error={errors.physical_progress}
            onChange={(e) => set('physical_progress', e.target.value)}
          />
          <TextInput
            id="financial_progress"
            label={t('admin.projects.financialProgress')}
            type="number"
            min="0"
            max="100"
            value={form.financial_progress}
            error={errors.financial_progress}
            onChange={(e) => set('financial_progress', e.target.value)}
          />
          <TextInput
            id="contract_date"
            label={t('admin.projects.contractDate')}
            type="date"
            value={form.contract_date}
            onChange={(e) => set('contract_date', e.target.value)}
          />
          <TextInput
            id="start_date"
            label={t('admin.projects.startDate')}
            type="date"
            value={form.start_date}
            onChange={(e) => set('start_date', e.target.value)}
          />
          <TextInput
            id="completion_date"
            label={t('admin.projects.completionDate')}
            type="date"
            value={form.completion_date}
            error={errors.completion_date}
            onChange={(e) => set('completion_date', e.target.value)}
          />
          <TextInput
            id="acceptance_date"
            label={t('admin.projects.acceptanceDate')}
            type="date"
            value={form.acceptance_date}
            onChange={(e) => set('acceptance_date', e.target.value)}
          />
        </div>
      </section>

      {/* ---- Copy ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.copy')}
        </h2>
        <div className="flex flex-col gap-4">
          <TextArea
            id="description"
            label={t('admin.projects.shortDescription')}
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
          <TextArea
            id="overview"
            label={t('admin.projects.overview')}
            rows={3}
            value={form.overview}
            onChange={(e) => set('overview', e.target.value)}
          />
          <TextArea
            id="challenge"
            label={t('admin.projects.challenge')}
            rows={3}
            value={form.challenge}
            onChange={(e) => set('challenge', e.target.value)}
          />
          <TextArea
            id="approach"
            label={t('admin.projects.approach')}
            rows={3}
            value={form.approach}
            onChange={(e) => set('approach', e.target.value)}
          />
          <TextArea
            id="result"
            label={t('admin.projects.result')}
            rows={3}
            value={form.result}
            onChange={(e) => set('result', e.target.value)}
          />
        </div>
      </section>

      {/* ---- Presentation ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.presentation')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="visual"
            label={t('admin.projects.visualStyle')}
            value={form.visual}
            onChange={(e) => set('visual', e.target.value as (typeof visuals)[number])}
            options={visuals.map((v) => ({ value: v, label: v }))}
          />
          <Select
            id="size"
            label={t('admin.projects.gridSize')}
            value={form.size}
            onChange={(e) => set('size', e.target.value as (typeof sizes)[number])}
            options={sizes.map((v) => ({ value: v, label: v }))}
          />
        </div>
        <label className="mt-5 flex items-center gap-2 text-sm font-medium text-primary-900">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 accent-accent-400"
          />
          {t('admin.projects.featureThis')}
        </label>
      </section>

      {/* ---- Scope ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-primary-950">
            {t('admin.projects.scopeFacts')}
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setForm((f) => ({ ...f, scope: [...f.scope, emptyScope] }))}
          >
            {t('admin.projects.addRow')}
          </Button>
        </div>
        {errors.scope && (
          <p className="mb-3 text-xs font-medium text-red-600">{errors.scope}</p>
        )}
        <div className="flex flex-col gap-3">
          {form.scope.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
              <TextInput
                id={`scope-key-${i}`}
                label={i === 0 ? t('admin.projects.key') : ''}
                value={row.key}
                onChange={(e) => setScopeRow(i, { ...row, key: e.target.value })}
              />
              <TextInput
                id={`scope-value-${i}`}
                label={i === 0 ? t('admin.projects.value') : ''}
                value={row.value}
                onChange={(e) => setScopeRow(i, { ...row, value: e.target.value })}
              />
              <RemoveRow
                label={t('admin.projects.removeRow', { index: i + 1 })}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    scope: f.scope.length > 1 ? f.scope.filter((_, j) => j !== i) : [emptyScope],
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---- Illustration gallery ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-primary-950">
            {t('admin.projects.gallery')}
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setForm((f) => ({
                ...f,
                gallery: [...f.gallery, { visual: 'facade', variant: 0, alt: '' }],
              }))
            }
          >
            {t('admin.projects.addImage')}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {form.gallery.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
              <TextInput
                id={`gallery-alt-${i}`}
                label={i === 0 ? t('admin.projects.captionAlt') : ''}
                value={row.alt}
                onChange={(e) => setGalleryRow(i, { ...row, alt: e.target.value })}
              />
              <Select
                id={`gallery-visual-${i}`}
                label={i === 0 ? t('admin.projects.visual') : ''}
                value={row.visual}
                onChange={(e) =>
                  setGalleryRow(i, { ...row, visual: e.target.value as 'facade' })
                }
                options={visuals.map((v) => ({ value: v, label: v }))}
              />
              <RemoveRow
                label={t('admin.projects.removeRow', { index: i + 1 })}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    gallery: f.gallery.filter((_, j) => j !== i),
                  }))
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-concrete">{t('admin.projects.galleryHint')}</p>
      </section>

      {/* ---- Photography ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.photography')}
        </h2>
        {!isEdit ? (
          <p className="mt-2 text-sm text-concrete">{t('admin.projects.photographyAfterSave')}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-concrete">{t('admin.projects.photographyHint')}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex flex-col gap-3">
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))}
                  className="block w-full text-sm text-primary-900 file:mr-3 file:rounded-sm file:border-0 file:bg-primary-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-primary-900 hover:file:bg-primary-200"
                />
                <TextInput
                  id="photo-caption"
                  label={t('admin.projects.photoCaption')}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                />
              </div>
              <Button type="button" onClick={handlePhotoUpload} disabled={busyPhoto || photoFiles.length === 0}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                {t('admin.projects.uploadPhotos')}
              </Button>
            </div>

            <ul className="mt-6 flex flex-col gap-3">
              {photos.map((photo, index) => (
                <li
                  key={photo.id}
                  className="flex flex-wrap items-center gap-3 border border-primary-100 p-3"
                >
                  {photo.url && (
                    <img
                      src={photo.url}
                      alt={photo.caption ?? ''}
                      className="h-16 w-24 shrink-0 object-cover"
                    />
                  )}
                  <div className="min-w-[12rem] flex-1">
                    <p className="truncate text-xs text-concrete">
                      {photo.original_name ?? ''}
                    </p>
                    <BlurField
                      id={`photo-caption-${photo.id}`}
                      label={t('admin.projects.photoCaption')}
                      initial={photo.caption ?? ''}
                      onSave={(value) => saveCaption(photo.id, value)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {photo.is_cover ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-accent-600">
                        <Star className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('admin.projects.cover')}
                      </span>
                    ) : (
                      <IconAction
                        label={t('admin.projects.makeCover')}
                        onClick={() => slug && setProjectPhotoCover(slug, photo.id)}
                      >
                        <Star className="h-4 w-4" aria-hidden="true" />
                      </IconAction>
                    )}
                    <IconAction
                      label={t('admin.projects.moveUp')}
                      disabled={index === 0}
                      onClick={() => slug && reorderProjectPhoto(slug, photo.id, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </IconAction>
                    <IconAction
                      label={t('admin.projects.moveDown')}
                      disabled={index === photos.length - 1}
                      onClick={() => slug && reorderProjectPhoto(slug, photo.id, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </IconAction>
                    <DeleteButton
                      label={t('admin.projects.deletePhoto')}
                      onDelete={() => slug && deleteProjectPhoto(slug, photo.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ---- History ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.history')}
        </h2>
        {!isEdit ? (
          <p className="mt-2 text-sm text-concrete">{t('admin.projects.historyAfterSave')}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-concrete">{t('admin.projects.historyHint')}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {history.map((entry) => (
                <li key={entry.id} className="border border-primary-100 p-3">
                  <div className="flex flex-wrap items-end gap-3">
                    <BlurField
                      id={`history-date-${entry.id}`}
                      label={t('admin.projects.occurredOn')}
                      type="date"
                      className="w-44"
                      initial={entry.occurred_on}
                      onSave={(value) => patchHistory(entry, { occurred_on: value })}
                    />
                    <BlurField
                      id={`history-title-${entry.id}`}
                      label={t('admin.projects.milestone')}
                      className="min-w-[12rem] flex-1"
                      initial={entry.title}
                      onSave={(value) =>
                        value.trim() ? patchHistory(entry, { title: value.trim() }) : undefined
                      }
                    />
                    <DeleteButton
                      label={t('admin.projects.deleteMilestone')}
                      onDelete={() => slug && deleteProjectHistory(slug, entry.id)}
                    />
                  </div>
                  <BlurField
                    id={`history-description-${entry.id}`}
                    label={t('admin.projects.milestoneDescription')}
                    initial={entry.description ?? ''}
                    multiline
                    onSave={(value) => patchHistory(entry, { description: value })}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 border-t border-primary-100 pt-5 sm:grid-cols-[10rem_1fr]">
              <TextInput
                id="history-new-date"
                label={t('admin.projects.occurredOn')}
                type="date"
                value={historyDraft.occurred_on}
                onChange={(e) => setHistoryDraft((d) => ({ ...d, occurred_on: e.target.value }))}
              />
              <TextInput
                id="history-new-title"
                label={t('admin.projects.milestone')}
                value={historyDraft.title}
                onChange={(e) => setHistoryDraft((d) => ({ ...d, title: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <TextArea
                  id="history-new-description"
                  label={t('admin.projects.milestoneDescription')}
                  rows={2}
                  value={historyDraft.description}
                  onChange={(e) =>
                    setHistoryDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={submitHistory}
                  disabled={busyHistory || !historyDraft.occurred_on || !historyDraft.title.trim()}
                >
                  {t('admin.projects.addMilestone')}
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ---- Documents ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-primary-950">
          {t('admin.projects.documents')}
        </h2>
        {!isEdit ? (
          <p className="mt-2 text-sm text-concrete">{t('admin.projects.documentsAfterSave')}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-concrete">{t('admin.projects.documentsHint')}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className="flex items-center gap-3 border border-primary-100 p-3"
                >
                  <FileText className="h-4 w-4 shrink-0 text-concrete" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm text-primary-900">
                    {document.title ?? document.original_name}
                  </span>
                  <DeleteButton
                    label={t('admin.projects.deleteDocument')}
                    onDelete={() => slug && deleteProjectDocument(slug, document.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <input
                  ref={documentInput}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-primary-900 file:mr-3 file:rounded-sm file:border-0 file:bg-primary-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-primary-900 hover:file:bg-primary-200"
                />
              </div>
              <TextInput
                id="document-title"
                label={t('admin.projects.documentTitle')}
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
              <Button
                type="button"
                onClick={submitDocument}
                disabled={busyDocument || !documentFile}
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {t('admin.projects.uploadDocument')}
              </Button>
            </div>
          </>
        )}
      </section>

      <div className="flex items-center justify-end gap-2 pb-4">
        <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
          {t('admin.projects.cancel')}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving
            ? t('admin.projects.saving')
            : isEdit
              ? t('admin.projects.saveChanges')
              : t('admin.projects.createProject')}
        </Button>
      </div>
    </form>
  )
}

/** A trash button matching the inline rows used by the scope and gallery lists. */
function RemoveRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-12 w-12 items-center justify-center text-concrete hover:text-red-600"
    >
      <Trash2 className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

/** A small icon action used inside the photography rows. */
function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-primary-800 transition-colors hover:bg-primary-100 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/** A labelled field that persists on blur, so timeline rows stay inline-editable. */
function BlurField({
  id,
  label,
  initial,
  type = 'text',
  multiline = false,
  className,
  onSave,
}: {
  id: string
  label: string
  initial: string
  type?: string
  multiline?: boolean
  className?: string
  onSave: (value: string) => void | Promise<void>
}) {
  const [value, setValue] = useState(initial)
  const control =
    'mt-1.5 w-full border border-primary-200 bg-surface px-4 text-sm text-primary-950 focus:outline-none focus:ring-2 focus:ring-accent-400'

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="text-sm font-medium text-primary-900">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (value !== initial) void onSave(value)
          }}
          className={`${control} resize-y py-3`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (value !== initial) void onSave(value)
          }}
          className={`${control} h-12`}
        />
      )}
    </div>
  )
}