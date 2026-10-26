import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, RefreshCw } from 'lucide-react'
import Button from '../../components/ui/Button'
import { DeleteButton } from '../../components/admin/actions'
import { Select, TextArea, TextInput } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'
import {
  applicationAttachmentUrl,
  deleteApplication,
  fetchApplicationSummary,
  jobApplicationStatuses,
  refreshApplications,
  updateApplicationNote,
  updateApplicationStatus,
  useApplications,
  useApplicationsReady,
  type ApplicationFilters,
  type ApplicationSummary,
  type JobApplication,
  type JobApplicationStatus,
} from '../../lib/recruitmentStore'
import { cn } from '../../lib/cn'

/* ============================================================================
   AdminApplications — the HR triage dashboard.

   Applicants arrive from the public careers form. HR reads the CV, moves an
   applicant through the triage statuses, records internal notes, and clears
   out applications that must not be retained. The whole inbox is fetched once
   and narrowed in the view by status, vacancy, and a free-text search across
   name, email, phone, and the generated reference.
   ========================================================================== */

const emptyFilters: ApplicationFilters = { status: '', search: '', opening_id: '' }

/** Tailwind classes per triage status, so the board reads at a glance. */
const statusTone: Record<JobApplicationStatus, string> = {
  new: 'bg-primary-100 text-primary-900',
  under_review: 'bg-amber-100 text-amber-900',
  shortlisted: 'bg-sky-100 text-sky-900',
  interview: 'bg-violet-100 text-violet-900',
  selected: 'bg-green-100 text-green-900',
  rejected: 'bg-red-100 text-red-900',
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

export default function AdminApplications() {
  const { t } = useTranslation()
  const applications = useApplications()
  const ready = useApplicationsReady()

  const [filters, setFilters] = useState<ApplicationFilters>(emptyFilters)
  const [summary, setSummary] = useState<ApplicationSummary | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Load the whole inbox once, then narrow it in the view — the dataset is a
  // single employer's applicant list, so no round trip per keystroke.
  useEffect(() => {
    void refreshApplications()
    void fetchApplicationSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
  }, [])

  /** Narrow the loaded inbox to the active search and filters. */
  const filtered = useMemo(() => {
    const needle = (filters.search ?? '').trim().toLowerCase()

    return applications.filter((a) => {
      if (filters.status && a.status !== filters.status) return false
      if (filters.opening_id && a.opening_id !== filters.opening_id) return false
      if (!needle) return true

      return [a.full_name, a.email, a.phone, a.application_number, a.position_applied_for]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle))
    })
  }, [applications, filters])

  function handleFilter(patch: Partial<ApplicationFilters>) {
    setFilters((f) => ({ ...f, ...patch }))
  }

  async function handleRefresh() {
    try {
      await refreshApplications()
      setSummary(await fetchApplicationSummary())
    } catch {
      setErrorMessage(t('admin.applications.refreshError'))
    }
  }

  function toggleExpanded(application: JobApplication) {
    if (expandedId === application.id) return setExpandedId(null)
    setExpandedId(application.id)
    setNoteDraft(application.admin_note ?? '')
  }

  async function handleStatus(application: JobApplication, status: JobApplicationStatus) {
    setErrorMessage('')
    setBusyId(application.id)
    try {
      await updateApplicationStatus(application.id, status)
      setSummary(await fetchApplicationSummary())
    } catch {
      setErrorMessage(t('admin.applications.statusError'))
    } finally {
      setBusyId(null)
    }
  }

  async function handleSaveNote(application: JobApplication) {
    setErrorMessage('')
    setBusyId(application.id)
    try {
      await updateApplicationNote(application.id, noteDraft)
    } catch {
      setErrorMessage(t('admin.applications.noteError'))
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(application: JobApplication) {
    setErrorMessage('')
    setBusyId(application.id)
    try {
      await deleteApplication(application.id)
      setSummary(await fetchApplicationSummary())
      if (expandedId === application.id) setExpandedId(null)
    } catch {
      setErrorMessage(t('admin.applications.deleteError'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.applications.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">{t('admin.applications.description')}</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleRefresh()}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {t('admin.applications.refresh')}
        </Button>
      </header>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* ── Pipeline counters ── */}

      {summary && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <div className="admin-card-flat p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-concrete">
              {t('admin.applications.total')}
            </dt>
            <dd className="mt-1 font-display text-2xl font-bold text-primary-950">
              {summary.total}
            </dd>
          </div>
          {jobApplicationStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                handleFilter({ status: filters.status === status ? '' : status })
              }
              className={cn(
                'admin-card-flat p-4 text-left transition-colors hover:bg-primary-50',
                filters.status === status && 'ring-2 ring-accent-400',
              )}
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-concrete">
                {t(`admin.applications.status.${status}`)}
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-primary-950">
                {summary.by_status[status] ?? 0}
              </dd>
            </button>
          ))}
        </dl>
      )}

      {/* ── Filters ── */}

      <div className="admin-card-flat grid gap-4 p-5 sm:grid-cols-[1fr_12rem_12rem]">
        <TextInput
          id="application-search"
          label={t('admin.applications.search')}
          type="search"
          value={filters.search ?? ''}
          placeholder={t('admin.applications.searchPlaceholder')}
          onChange={(e) => handleFilter({ search: e.target.value })}
        />
        <Select
          id="application-status"
          label={t('admin.applications.statusLabel')}
          value={filters.status ?? ''}
          placeholder={t('admin.applications.allStatuses')}
          options={jobApplicationStatuses.map((status) => ({
            value: status,
            label: t(`admin.applications.status.${status}`),
          }))}
          onChange={(e) =>
            handleFilter({ status: e.target.value as JobApplicationStatus | '' })
          }
        />
        <Select
          id="application-opening"
          label={t('admin.applications.vacancy')}
          value={String(filters.opening_id ?? '')}
          placeholder={t('admin.applications.allVacancies')}
          options={vacancyOptions(applications)}
          onChange={(e) =>
            handleFilter({ opening_id: e.target.value ? Number(e.target.value) : '' })
          }
        />
      </div>

      {/* ── Applicant list ── */}

      {!ready ? (
        <div className="admin-card-flat border-dashed p-10 text-center text-sm text-concrete">
          {t('admin.applications.loading')}
        </div>
      ) : applications.length === 0 ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-primary-300" aria-hidden="true" />
          <p className="mt-3 font-display text-base font-semibold text-primary-950">
            {t('admin.applications.noApplications')}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-concrete">
            {t('admin.applications.noApplicationsDesc')}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card-flat border-dashed p-10 text-center text-sm text-concrete">
          {t('admin.applications.noMatches')}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((application) => {
            const expanded = expandedId === application.id

            return (
              <li key={application.id} className="admin-card-flat overflow-hidden">
                <div className="flex flex-wrap items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          statusTone[application.status],
                        )}
                      >
                        {t(`admin.applications.status.${application.status}`)}
                      </span>
                      <span className="font-mono text-xs text-concrete">
                        {application.application_number}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-lg font-semibold text-primary-950">
                      {application.full_name}
                    </p>
                    <p className="mt-0.5 text-sm text-concrete-dark">
                      {application.position_applied_for}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-concrete">
                      <a href={`mailto:${application.email}`} className="hover:text-accent-600">
                        {application.email}
                      </a>
                      <a href={`tel:${application.phone}`} className="hover:text-accent-600">
                        {application.phone}
                      </a>
                      <span>{formatDate(application.applied_at ?? application.created_at)}</span>
                      {application.opening && <span>{application.opening.title}</span>}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Select
                      id={`status-${application.id}`}
                      label={t('admin.applications.statusLabel')}
                      value={application.status}
                      className="h-10 min-w-[11rem] [&>label]:sr-only"
                      options={jobApplicationStatuses.map((status) => ({
                        value: status,
                        label: t(`admin.applications.status.${status}`),
                      }))}
                      onChange={(e) =>
                        void handleStatus(application, e.target.value as JobApplicationStatus)
                      }
                      disabled={busyId === application.id}
                    />
                    <Button size="sm" variant="outline" onClick={() => toggleExpanded(application)}>
                      {expanded
                        ? t('admin.applications.close')
                        : t('admin.applications.review')}
                    </Button>
                    <DeleteButton
                      label={t('admin.applications.delete')}
                      onDelete={() => void handleDelete(application)}
                    />
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-primary-100 bg-primary-50/40 p-5">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Applicant details */}
                      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                        <Detail label={t('admin.applications.gender')} value={application.gender} />
                        <Detail
                          label={t('admin.applications.dateOfBirth')}
                          value={formatDate(application.date_of_birth)}
                        />
                        <Detail label={t('admin.applications.address')} value={application.address} />
                        <Detail
                          label={t('admin.applications.yearsOfExperience')}
                          value={
                            application.years_of_experience === null
                              ? null
                              : String(application.years_of_experience)
                          }
                        />
                        <Detail
                          label={t('admin.applications.education')}
                          value={application.education}
                        />
                        <Detail label={t('admin.applications.skills')} value={application.skills} />
                        <Detail
                          label={t('admin.applications.workExperience')}
                          value={application.work_experience}
                          wide
                        />
                        <Detail
                          label={t('admin.applications.coverLetter')}
                          value={application.cover_letter}
                          wide
                        />
                      </dl>

                      {/* Attachments + note */}
                      <div className="flex flex-col gap-4">
                        <AttachmentRow
                          id={application.id}
                          kind="cv"
                          name={application.cv_name}
                          size={application.cv_size}
                          label={t('admin.applications.cv')}
                          downloadLabel={t('admin.applications.download')}
                        />
                        <AttachmentRow
                          id={application.id}
                          kind="certificates"
                          name={application.certificates_name}
                          size={application.certificates_size}
                          label={t('admin.applications.certificates')}
                          downloadLabel={t('admin.applications.download')}
                        />

                        <TextArea
                          id={`note-${application.id}`}
                          label={t('admin.applications.internalNote')}
                          hint={t('admin.applications.internalNoteHint')}
                          rows={4}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                        />
                        <div>
                          <Button
                            size="sm"
                            onClick={() => void handleSaveNote(application)}
                            disabled={busyId === application.id}
                          >
                            {t('admin.applications.saveNote')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string
  value: string | null
  wide?: boolean
}) {
  if (!value) return null

  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-concrete">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-primary-900">{value}</dd>
    </div>
  )
}

function AttachmentRow({
  id,
  kind,
  name,
  size,
  label,
  downloadLabel,
}: {
  id: number
  kind: 'cv' | 'certificates'
  name: string | null
  size: number | null
  label: string
  downloadLabel: string
}) {
  if (!name) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-sm border border-dashed border-primary-200 px-4 py-3 text-sm text-concrete">
        <span className="flex items-center gap-2">
          <FileText size={16} aria-hidden="true" />
          {label}
        </span>
        <span>—</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-primary-200 bg-surface px-4 py-3">
      <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-primary-950">
        <FileText size={16} className="shrink-0 text-accent-500" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block truncate">{name}</span>
          <span className="block text-xs font-normal text-concrete">{formatBytes(size)}</span>
        </span>
      </span>
      <a
        href={applicationAttachmentUrl(id, kind)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-primary-800 transition-colors hover:bg-primary-100 hover:text-primary-950"
        title={`${downloadLabel} ${name}`}
        aria-label={`${downloadLabel} ${name}`}
      >
        <Download size={16} aria-hidden="true" />
      </a>
    </div>
  )
}

/** Distinct vacancies present in the current page of results. */
function vacancyOptions(applications: JobApplication[]): { value: string; label: string }[] {
  const seen = new Map<number, string>()
  applications.forEach((a) => {
    if (a.opening) seen.set(a.opening.id, a.opening.title)
  })

  return [...seen.entries()]
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([value, label]) => ({ value: String(value), label }))
}