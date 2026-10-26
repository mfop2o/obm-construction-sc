import { useEffect, useState } from 'react'
import {
  useInquiries,
  useInquiriesReady,
  refreshInquiriesSync,
  updateInquiryStatus,
  updateInquiryRead,
  deleteInquiry,
} from '../../lib/inquiriesStore'
import { DeleteButton } from '../../components/admin/actions'
import { useTranslation } from '../../i18n'
import { FileText } from 'lucide-react'

/* ============================================================================
   AdminInquiries â€” triage of "Request a Quote" submissions.
   Status + read flag + internal note + follow-up + attachment, newest first.
   ========================================================================== */

const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'closed'] as const
type Status = (typeof statuses)[number]

export default function AdminInquiries() {
  const inquiries = useInquiries()
  const ready = useInquiriesReady()
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Status | 'all' | 'unread'>('all')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    refreshInquiriesSync()
  }, [])

  const applyFilter = (q: (typeof inquiries)[number]): boolean => {
    if (filter === 'unread') return !q.read
    if (filter === 'all') return true
    return q.status === filter
  }
  const visible = inquiries.filter(applyFilter)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.inquiries.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">{t('admin.inquiries.description')}</p>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-concrete">{t('admin.inquiries.filters')}:</span>
        {(['all', 'unread', ...statuses] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filter === s
                ? 'border-accent-500 bg-accent-400/15 text-accent-700'
                : 'border-primary-200 text-concrete-dark hover:border-accent-300'
            }`}
          >
            {t(`admin.inquiries.filter${s === 'all' ? 'All' : s === 'unread' ? 'Unread' : s[0].toUpperCase() + s.slice(1)}`)}
          </button>
        ))}
      </div>

      {!ready && inquiries.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-accent-500" />
        </div>
      ) : visible.length === 0 ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.inquiries.noInquiries')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.inquiries.noInquiriesDesc')}
          </p>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {visible.map((q) => {
              const StatusLabel =
                statuses[statuses.indexOf(q.status as Status)]
              return (
                <li
                  key={q.id}
                  className={`flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start ${
                    !q.read ? 'bg-accent-400/5' : ''
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display font-semibold text-primary-950">
                        {q.name}
                        {q.company ? ` â€” ${q.company}` : ''}
                      </p>
                      {!q.read && (
                        <span className="rounded-full bg-accent-400/20 px-2 py-0.5 text-xs font-semibold text-accent-700">
                          {t('admin.inquiries.unread')}
                        </span>
                      )}
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-800">
                        {t(`admin.inquiries.status${StatusLabel[0].toUpperCase()}${StatusLabel.slice(1)}`)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-concrete-dark">{q.message}</p>

                    <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs text-concrete-dark sm:grid-cols-2">
                      {q.email && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.email')}Â·</dt>
                          <dd className="truncate text-primary-900">{q.email}</dd>
                        </div>
                      )}
                      {q.phone && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.phone')}Â·</dt>
                          <dd className="text-primary-900">{q.phone}</dd>
                        </div>
                      )}
                      {q.project_type && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.projectType')}Â·</dt>
                          <dd className="text-primary-900">{q.project_type}</dd>
                        </div>
                      )}
                      {q.budget_range && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.budget')}Â·</dt>
                          <dd className="text-primary-900">{q.budget_range}</dd>
                        </div>
                      )}
                      {q.project_location && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.location')}Â·</dt>
                          <dd className="text-primary-900">{q.project_location}</dd>
                        </div>
                      )}
                      {q.start_timeline && (
                        <div className="flex gap-1.5">
                          <dt className="text-concrete">{t('admin.inquiries.timeline')}Â·</dt>
                          <dd className="text-primary-900">{q.start_timeline}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        aria-label={t('admin.inquiries.status')}
                        value={q.status}
                        onChange={(e) => {
                          updateInquiryStatus(q.id, e.target.value).catch(() =>
                            setErrorMessage(t('admin.inquiries.updateError')),
                          )
                        }}
                        className="rounded-sm border border-primary-200 bg-white px-2 py-1 text-xs font-medium text-primary-900"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {t(`admin.inquiries.status${s[0].toUpperCase()}${s.slice(1)}`)}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          updateInquiryRead(q.id, !q.read).catch(() =>
                            setErrorMessage(t('admin.inquiries.updateError')),
                          )
                        }}
                        className="text-xs font-medium text-accent-600 hover:text-accent-700"
                      >
                        {q.read
                          ? t('admin.inquiries.markUnread')
                          : t('admin.inquiries.markRead')}
                      </button>

                      <DeleteButton
                        label={`${t('admin.inquiries.delete')}: ${q.name}`}
                        onDelete={() => {
                          deleteInquiry(q.id).catch(() =>
                            setErrorMessage(t('admin.inquiries.deleteError')),
                          )
                        }}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
