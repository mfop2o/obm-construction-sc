import { useState } from 'react'
import {
  useTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { TextInput, TextArea } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminTestimonials — list / create / edit / delete testimonials.
   ========================================================================== */

interface FormState {
  quote: string
  name: string
  role: string
  company: string
  featured: boolean
}

const emptyForm: FormState = {
  quote: '',
  name: '',
  role: '',
  company: '',
  featured: false,
}

export default function AdminTestimonials() {
  const testimonials = useTestimonials()
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(te: (typeof testimonials)[number]) {
    setEditId(te.id)
    setForm({
      quote: te.quote,
      name: te.name,
      role: te.role ?? '',
      company: te.company ?? '',
      featured: te.featured,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
  }

  async function handleSave() {
    setSaving(true)
    setErrorMessage('')
    try {
      const input = {
        quote: form.quote,
        name: form.name,
        role: form.role || null,
        company: form.company || null,
        featured: form.featured,
      }
      if (editId) {
        await updateTestimonial(editId, input)
      } else {
        await createTestimonial(input)
      }
      closeForm()
    } catch {
      setErrorMessage(t('admin.testimonials.saveError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.testimonials.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.testimonials.description')}
          </p>
        </div>
        {!showForm && (
          <Button onClick={openNew}>{t('admin.testimonials.newTestimonial')}</Button>
        )}
      </header>

      {errorMessage && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {showForm && (
        <div className="admin-card-flat p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
            {editId ? t('admin.testimonials.editTestimonial') : t('admin.testimonials.newTestimonialForm')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextArea
                id="quote"
                label={t('admin.testimonials.quote')}
                required
                rows={3}
                value={form.quote}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quote: e.target.value }))
                }
              />
            </div>
            <TextInput
              id="name"
              label={t('admin.testimonials.name')}
              required
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <TextInput
              id="role"
              label={t('admin.testimonials.role')}
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
            />
            <TextInput
              id="company"
              label={t('admin.testimonials.company')}
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-primary-900">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      featured: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded-sm border-primary-300 text-accent-500 focus:ring-accent-400"
                />
                {t('admin.testimonials.featured')}
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t('admin.testimonials.save') + '…' : editId ? t('admin.testimonials.update') : t('admin.testimonials.create')}
            </Button>
            <Button variant="ghost" onClick={closeForm}>
              {t('admin.testimonials.cancel')}
            </Button>
          </div>
        </div>
      )}

      {testimonials.length === 0 && !showForm ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.testimonials.noTestimonials')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.testimonials.noTestimonialsDesc')}
          </p>
          <div className="mt-6">
            <Button onClick={openNew}>{t('admin.testimonials.createTestimonial')}</Button>
          </div>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {testimonials.map((te) => (
              <li
                key={te.id}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display font-semibold text-primary-950">
                      {te.name}
                    </p>
                    {te.featured && (
                      <span className="inline-flex items-center rounded-full bg-accent-400/20 px-2 py-0.5 text-xs font-semibold text-accent-600">
                        {t('admin.testimonials.featured')}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 mt-0.5 text-sm text-primary-800 italic">
                    &ldquo;{te.quote}&rdquo;
                  </p>
                  <p className="mt-0.5 text-xs text-concrete">
                    {[te.role, te.company].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      void updateTestimonial(te.id, {
                        featured: !te.featured,
                      }).catch(() => {
                        setErrorMessage(t('admin.testimonials.featuredError'))
                      })
                    }
                    className={`rounded-sm px-2 py-1 text-xs font-medium ${
                      te.featured
                        ? 'text-concrete hover:bg-primary-100'
                        : 'text-accent-600 hover:bg-accent-400/10'
                    }`}
                  >
                    {te.featured ? t('admin.testimonials.unfeature') : t('admin.testimonials.feature')}
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <EditButton
                      label={`Edit testimonial from ${te.name}`}
                      onClick={() => openEdit(te)}
                    />
                    <DeleteButton
                      label={`Delete testimonial from ${te.name}`}
                      onDelete={() => {
                        void deleteTestimonial(te.id).catch(() => {
                          setErrorMessage(t('admin.testimonials.deleteError'))
                        })
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
