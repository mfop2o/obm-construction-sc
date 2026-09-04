import { useEffect, useState } from 'react'
import {
  useContacts,
  useContactsReady,
  refreshContactsSync,
  markContactRead,
  deleteContact,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { DeleteButton } from '../../components/admin/actions'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminContacts — incoming form submissions.
   Newest first (API already returns that order).
   ========================================================================== */

export default function AdminContacts() {
  const contacts = useContacts()
  const ready = useContactsReady()
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    refreshContactsSync()
  }, [])

  if (!ready && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="h-8 w-8 animate-spin text-primary-400"
          viewBox="0 0 24 24"
          fill="none"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.contacts.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.contacts.description')}
          </p>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.contacts.noMessages')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.contacts.noMessagesDesc')}
          </p>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {contacts.map((c) => (
              <li
                key={c.id}
                className={`flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center ${!c.read ? 'bg-accent-400/5 font-medium' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display font-semibold text-primary-950">
                      {c.name}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        !c.read
                          ? 'bg-accent-400/20 text-accent-600'
                          : 'bg-primary-100 text-concrete'
                      }`}
                    >
                      {!c.read ? t('admin.contacts.unread') : t('admin.contacts.read')}
                    </span>
                    {c.project_type && (
                      <span className="text-xs text-concrete">
                        {c.project_type}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-concrete">
                    {c.email} ·{' '}
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-primary-800">
                    {c.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void markContactRead(c.id, !c.read).catch(() => {
                        setErrorMessage(t('admin.contacts.readError'))
                      })
                    }}
                  >
                    {c.read ? t('admin.contacts.markUnread') : t('admin.contacts.markRead')}
                  </Button>
                  <DeleteButton
                    label={`Delete message from ${c.name}`}
                    onDelete={() => {
                      void deleteContact(c.id).catch(() => {
                        setErrorMessage(t('admin.contacts.deleteError'))
                      })
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
