import { useState } from 'react'
import {
  useHomeStats,
  createHomeStat,
  updateHomeStat,
  deleteHomeStat,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { TextInput } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

type StatForm = {
  label: string
  value: string
  suffix: string
}

const blankForm: StatForm = { label: '', value: '', suffix: '' }

export default function AdminHomeStats() {
  const stats = useHomeStats()
  const { t } = useTranslation()

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<StatForm>(blankForm)

  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<StatForm>(blankForm)

  const [errorMessage, setErrorMessage] = useState('')
  const [formError, setFormError] = useState('')

  function validateNumber(v: string): boolean {
    return v !== '' && !Number.isNaN(Number(v))
  }

  function startEdit(id: number) {
    const s = stats.find((x) => x.id === id)
    if (!s) return
    setEditId(id)
    setEditForm({
      label: s.label,
      value: String(s.value),
      suffix: s.suffix ?? '',
    })
    setShowCreate(false)
    setErrorMessage('')
    setFormError('')
  }

  function reset() {
    setEditId(null)
    setEditForm(blankForm)
    setShowCreate(false)
    setCreateForm(blankForm)
    setErrorMessage('')
    setFormError('')
  }

  function handleCreate() {
    if (!validateNumber(createForm.value)) {
      setFormError(t('admin.homeStats.numberError'))
      return
    }
    setFormError('')
    setErrorMessage('')
    void createHomeStat({
      label: createForm.label,
      value: Number(createForm.value),
      suffix: createForm.suffix || null,
    })
      .then(() => {
        setCreateForm(blankForm)
        setShowCreate(false)
      })
      .catch(() => setErrorMessage(t('admin.homeStats.createError')))
  }

  function handleUpdate(id: number) {
    if (!validateNumber(editForm.value)) {
      setFormError(t('admin.homeStats.numberError'))
      return
    }
    setFormError('')
    setErrorMessage('')
    void updateHomeStat(id, {
      label: editForm.label,
      value: Number(editForm.value),
      suffix: editForm.suffix || null,
    })
      .then(() => reset())
      .catch(() => setErrorMessage(t('admin.homeStats.updateError')))
  }

  function handleDelete(id: number) {
    setErrorMessage('')
    void deleteHomeStat(id).catch(() => setErrorMessage(t('admin.homeStats.deleteError')))
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.homeStats.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.homeStats.description')}
          </p>
        </div>
        <Button
          onClick={() => {
            reset()
            setShowCreate(!showCreate)
          }}
        >
          {showCreate ? t('admin.homeStats.closeForm') : t('admin.homeStats.newStat')}
        </Button>
      </header>

      {errorMessage && (
        <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {showCreate && (
        <div className="admin-card-flat p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
            {t('admin.homeStats.newStatForm')}
          </h2>
          <div className="flex flex-col gap-4">
            <TextInput
              id="create-label"
              label={t('admin.homeStats.labelField')}
              required
              value={createForm.label}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, label: e.target.value }))
              }
              hint="e.g. Years of Experience, Projects Completed"
            />
            <TextInput
              id="create-value"
              label={t('admin.homeStats.value')}
              required
              value={createForm.value}
              onChange={(e) => {
                setCreateForm((f) => ({ ...f, value: e.target.value }))
                setFormError('')
              }}
              error={formError || undefined}
              hint="Must be a number"
            />
            <TextInput
              id="create-suffix"
              label={t('admin.homeStats.suffix')}
              value={createForm.suffix}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, suffix: e.target.value }))
              }
              hint="Optional suffix, e.g. +, %, M"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCreate}
                disabled={!createForm.label || !createForm.value}
              >
                {t('admin.homeStats.create')}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {t('admin.homeStats.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {stats.length === 0 && !showCreate ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.homeStats.noStats')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.homeStats.noStatsDesc')}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => {
                reset()
                setShowCreate(true)
              }}
            >
              {t('admin.homeStats.createStat')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {stats.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
              >
                {editId === s.id ? (
                  <div className="w-full">
                    <h3 className="mb-3 font-display text-sm font-semibold text-primary-950">
                      {t('admin.homeStats.editStat')}
                    </h3>
                    <div className="flex flex-col gap-4">
                      <TextInput
                        id={`edit-label-${s.id}`}
                        label={t('admin.homeStats.labelField')}
                        required
                        value={editForm.label}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            label: e.target.value,
                          }))
                        }
                      />
                      <TextInput
                        id={`edit-value-${s.id}`}
                        label={t('admin.homeStats.value')}
                        required
                        value={editForm.value}
                        onChange={(e) => {
                          setEditForm((f) => ({
                            ...f,
                            value: e.target.value,
                          }))
                          setFormError('')
                        }}
                        error={formError || undefined}
                      />
                      <TextInput
                        id={`edit-suffix-${s.id}`}
                        label={t('admin.homeStats.suffix')}
                        value={editForm.suffix}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            suffix: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleUpdate(s.id)}
                          disabled={!editForm.label || !editForm.value}
                        >
                          {t('admin.homeStats.save')}
                        </Button>
                        <Button variant="ghost" onClick={reset}>
                          {t('admin.homeStats.cancel')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 flex-1 items-baseline gap-2">
                      <span className="font-display text-2xl font-bold tabular-nums text-primary-950">
                        {s.value.toLocaleString()}
                        {s.suffix}
                      </span>
                      <span className="truncate text-sm text-concrete">
                        {s.label}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <EditButton
                        label={`Edit ${s.label}`}
                        onClick={() => startEdit(s.id)}
                      />
                      <DeleteButton
                        label={`Delete ${s.label}`}
                        onDelete={() => handleDelete(s.id)}
                      />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
