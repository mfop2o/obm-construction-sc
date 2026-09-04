import { useState } from 'react'
import {
  useCareersData,
  createOpening,
  updateOpening,
  deleteOpening,
  createCareerValue,
  updateCareerValue,
  deleteCareerValue,
  createCareerBenefit,
  updateCareerBenefit,
  deleteCareerBenefit,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { TextInput, TextArea } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

/* ---- Opening form ---- */

type OpeningForm = {
  title: string
  department: string
  location: string
  type: string
  blurb: string
}

const blankOpening: OpeningForm = {
  title: '',
  department: '',
  location: '',
  type: '',
  blurb: '',
}

/* ---- Value form ---- */

type ValueForm = {
  title: string
  text: string
}

const blankValue: ValueForm = { title: '', text: '' }

/* ---- Benefit form ---- */

type BenefitForm = { text: string }

const blankBenefit: BenefitForm = { text: '' }

export default function AdminCareers() {
  const data = useCareersData()
  const { t } = useTranslation()

  /* ---- UI state ---- */
  const [errorMessage, setErrorMessage] = useState('')

  /* Opening states */
  const [showCreateOpening, setShowCreateOpening] = useState(false)
  const [createOpeningForm, setCreateOpeningForm] =
    useState<OpeningForm>(blankOpening)
  const [editOpeningId, setEditOpeningId] = useState<number | null>(null)
  const [editOpeningForm, setEditOpeningForm] =
    useState<OpeningForm>(blankOpening)

  /* Value states */
  const [showCreateValue, setShowCreateValue] = useState(false)
  const [createValueForm, setCreateValueForm] =
    useState<ValueForm>(blankValue)
  const [editValueId, setEditValueId] = useState<number | null>(null)
  const [editValueForm, setEditValueForm] =
    useState<ValueForm>(blankValue)

  /* Benefit states */
  const [showCreateBenefit, setShowCreateBenefit] = useState(false)
  const [createBenefitForm, setCreateBenefitForm] =
    useState<BenefitForm>(blankBenefit)
  const [editBenefitId, setEditBenefitId] = useState<number | null>(null)
  const [editBenefitForm, setEditBenefitForm] =
    useState<BenefitForm>(blankBenefit)

  /* ---- Opening handlers ---- */

  function handleCreateOpening() {
    setErrorMessage('')
    void createOpening({
      title: createOpeningForm.title,
      department: createOpeningForm.department || undefined,
      location: createOpeningForm.location || undefined,
      type: createOpeningForm.type || undefined,
      blurb: createOpeningForm.blurb || undefined,
    })
      .then(() => {
        setCreateOpeningForm(blankOpening)
        setShowCreateOpening(false)
      })
      .catch(() => setErrorMessage(t('admin.careers.createOpeningError')))
  }

  function handleUpdateOpening(id: number) {
    setErrorMessage('')
    void updateOpening(id, {
      title: editOpeningForm.title,
      department: editOpeningForm.department || undefined,
      location: editOpeningForm.location || undefined,
      type: editOpeningForm.type || undefined,
      blurb: editOpeningForm.blurb || undefined,
    })
      .then(() => {
        setEditOpeningId(null)
        setEditOpeningForm(blankOpening)
      })
      .catch(() => setErrorMessage(t('admin.careers.updateOpeningError')))
  }

  function handleDeleteOpening(id: number) {
    setErrorMessage('')
    void deleteOpening(id).catch(() => setErrorMessage(t('admin.careers.deleteOpeningError')))
  }

  function startEditOpening(id: number) {
    const o = data.openings.find((x) => x.id === id)
    if (!o) return
    setEditOpeningId(id)
    setEditOpeningForm({
      title: o.title,
      department: o.department ?? '',
      location: o.location ?? '',
      type: o.type ?? '',
      blurb: o.blurb ?? '',
    })
  }

  /* ---- Value handlers ---- */

  function handleCreateValue() {
    setErrorMessage('')
    void createCareerValue(createValueForm)
      .then(() => {
        setCreateValueForm(blankValue)
        setShowCreateValue(false)
      })
      .catch(() => setErrorMessage(t('admin.careers.createValueError')))
  }

  function handleUpdateValue(id: number) {
    setErrorMessage('')
    void updateCareerValue(id, editValueForm)
      .then(() => {
        setEditValueId(null)
        setEditValueForm(blankValue)
      })
      .catch(() => setErrorMessage(t('admin.careers.updateValueError')))
  }

  function handleDeleteValue(id: number) {
    setErrorMessage('')
    void deleteCareerValue(id).catch(() => setErrorMessage(t('admin.careers.deleteValueError')))
  }

  function startEditValue(id: number) {
    const v = data.values.find((x) => x.id === id)
    if (!v) return
    setEditValueId(id)
    setEditValueForm({ title: v.title, text: v.text })
  }

  /* ---- Benefit handlers ---- */

  function handleCreateBenefit() {
    setErrorMessage('')
    void createCareerBenefit(createBenefitForm)
      .then(() => {
        setCreateBenefitForm(blankBenefit)
        setShowCreateBenefit(false)
      })
      .catch(() => setErrorMessage(t('admin.careers.createBenefitError')))
  }

  function handleUpdateBenefit(id: number) {
    setErrorMessage('')
    void updateCareerBenefit(id, editBenefitForm)
      .then(() => {
        setEditBenefitId(null)
        setEditBenefitForm(blankBenefit)
      })
      .catch(() => setErrorMessage(t('admin.careers.updateBenefitError')))
  }

  function handleDeleteBenefit(id: number) {
    setErrorMessage('')
    void deleteCareerBenefit(id).catch(() => setErrorMessage(t('admin.careers.deleteBenefitError')))
  }

  function startEditBenefit(id: number) {
    const b = data.benefits.find((x) => x.id === id)
    if (!b) return
    setEditBenefitId(id)
    setEditBenefitForm({ text: b.text })
  }

  /* ---- Render ---- */

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.careers.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.careers.description')}{' '}
            {data.openings.length} {t('admin.careers.openings')}{data.openings.length !== 1 && 's'},{' '}
            {data.values.length} {t('admin.careers.values')}{data.values.length !== 1 && 's'},{' '}
            {data.benefits.length} {t('admin.careers.benefits')}{data.benefits.length !== 1 && 's'}.
          </p>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* ───────────────── OPENINGS ───────────────── */}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">
              {t('admin.careers.openings')}
            </h2>
            <p className="mt-0.5 text-sm text-concrete">
              {data.openings.length} current opening
              {data.openings.length !== 1 && 's'}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditOpeningId(null)
              setShowCreateOpening(!showCreateOpening)
            }}
          >
            {showCreateOpening ? t('admin.careers.closeForm') : t('admin.careers.newOpening')}
          </Button>
        </div>

        {showCreateOpening && (
          <div className="admin-card-flat p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-primary-950">
              {t('admin.careers.newOpeningForm')}
            </h3>
            <div className="flex flex-col gap-4">
              <TextInput
                id="create-opening-title"
                label={t('admin.careers.titleField')}
                required
                value={createOpeningForm.title}
                onChange={(e) =>
                  setCreateOpeningForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
              />
              <TextInput
                id="create-opening-dept"
                label={t('admin.careers.department')}
                value={createOpeningForm.department}
                onChange={(e) =>
                  setCreateOpeningForm((f) => ({
                    ...f,
                    department: e.target.value,
                  }))
                }
              />
              <TextInput
                id="create-opening-location"
                label={t('admin.careers.location')}
                value={createOpeningForm.location}
                onChange={(e) =>
                  setCreateOpeningForm((f) => ({
                    ...f,
                    location: e.target.value,
                  }))
                }
              />
              <TextInput
                id="create-opening-type"
                label={t('admin.careers.type')}
                value={createOpeningForm.type}
                onChange={(e) =>
                  setCreateOpeningForm((f) => ({
                    ...f,
                    type: e.target.value,
                  }))
                }
                hint="e.g. Full-time, Part-time, Contract"
              />
              <TextArea
                id="create-opening-blurb"
                label={t('admin.careers.blurb')}
                rows={3}
                value={createOpeningForm.blurb}
                onChange={(e) =>
                  setCreateOpeningForm((f) => ({
                    ...f,
                    blurb: e.target.value,
                  }))
                }
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCreateOpening}
                  disabled={!createOpeningForm.title}
                >
                  {t('admin.careers.create')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateOpening(false)
                    setCreateOpeningForm(blankOpening)
                  }}
                >
                  {t('admin.careers.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {data.openings.length === 0 && !showCreateOpening ? (
          <div className="admin-card-flat border-dashed p-8 text-center">
            <p className="font-display text-base font-semibold text-primary-950">
              {t('admin.careers.noOpenings')}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-concrete">
              {t('admin.careers.noOpeningsDesc')}
            </p>
          </div>
        ) : (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {data.openings.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
                >
                  {editOpeningId === o.id ? (
                    <div className="w-full">
                      <h3 className="mb-3 font-display text-sm font-semibold text-primary-950">
                        {t('admin.careers.editOpening')}
                      </h3>
                      <div className="flex flex-col gap-4">
                        <TextInput
                          id={`edit-opening-title-${o.id}`}
                          label={t('admin.careers.titleField')}
                          required
                          value={editOpeningForm.title}
                          onChange={(e) =>
                            setEditOpeningForm((f) => ({
                              ...f,
                              title: e.target.value,
                            }))
                          }
                        />
                        <TextInput
                          id={`edit-opening-dept-${o.id}`}
                          label={t('admin.careers.department')}
                          value={editOpeningForm.department}
                          onChange={(e) =>
                            setEditOpeningForm((f) => ({
                              ...f,
                              department: e.target.value,
                            }))
                          }
                        />
                        <TextInput
                          id={`edit-opening-location-${o.id}`}
                          label={t('admin.careers.location')}
                          value={editOpeningForm.location}
                          onChange={(e) =>
                            setEditOpeningForm((f) => ({
                              ...f,
                              location: e.target.value,
                            }))
                          }
                        />
                        <TextInput
                          id={`edit-opening-type-${o.id}`}
                          label={t('admin.careers.type')}
                          value={editOpeningForm.type}
                          onChange={(e) =>
                            setEditOpeningForm((f) => ({
                              ...f,
                              type: e.target.value,
                            }))
                          }
                        />
                        <TextArea
                          id={`edit-opening-blurb-${o.id}`}
                          label={t('admin.careers.blurb')}
                          rows={3}
                          value={editOpeningForm.blurb}
                          onChange={(e) =>
                            setEditOpeningForm((f) => ({
                              ...f,
                              blurb: e.target.value,
                            }))
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleUpdateOpening(o.id)}
                            disabled={!editOpeningForm.title}
                          >
                            {t('admin.careers.save')}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditOpeningId(null)
                              setEditOpeningForm(blankOpening)
                            }}
                          >
                            {t('admin.careers.cancel')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-display font-semibold text-primary-950">
                          {o.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-concrete">
                          {[o.department, o.location, o.type]
                            .filter(Boolean)
                            .join(' · ') || t('admin.careers.noMetadata')}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditButton
                          label={`Edit ${o.title}`}
                          onClick={() => startEditOpening(o.id)}
                        />
                        <DeleteButton
                          label={`Delete ${o.title}`}
                          onDelete={() => handleDeleteOpening(o.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ───────────────── VALUES ───────────────── */}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">
              {t('admin.careers.values')}
            </h2>
            <p className="mt-0.5 text-sm text-concrete">
              {data.values.length} value{data.values.length !== 1 && 's'}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditValueId(null)
              setShowCreateValue(!showCreateValue)
            }}
          >
            {showCreateValue ? t('admin.careers.closeForm') : t('admin.careers.newValue')}
          </Button>
        </div>

        {showCreateValue && (
          <div className="admin-card-flat p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-primary-950">
              {t('admin.careers.newValueForm')}
            </h3>
            <div className="flex flex-col gap-4">
              <TextInput
                id="create-value-title"
                label={t('admin.careers.titleField')}
                required
                value={createValueForm.title}
                onChange={(e) =>
                  setCreateValueForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
              />
              <TextArea
                id="create-value-text"
                label={t('admin.careers.textField')}
                rows={3}
                value={createValueForm.text}
                onChange={(e) =>
                  setCreateValueForm((f) => ({
                    ...f,
                    text: e.target.value,
                  }))
                }
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCreateValue}
                  disabled={!createValueForm.title}
                >
                  {t('admin.careers.create')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateValue(false)
                    setCreateValueForm(blankValue)
                  }}
                >
                  {t('admin.careers.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {data.values.length === 0 && !showCreateValue ? (
          <div className="admin-card-flat border-dashed p-8 text-center">
            <p className="font-display text-base font-semibold text-primary-950">
              {t('admin.careers.noValues')}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-concrete">
              {t('admin.careers.noValuesDesc')}
            </p>
          </div>
        ) : (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {data.values.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
                >
                  {editValueId === v.id ? (
                    <div className="w-full">
                      <h3 className="mb-3 font-display text-sm font-semibold text-primary-950">
                        {t('admin.careers.editValue')}
                      </h3>
                      <div className="flex flex-col gap-4">
                        <TextInput
                          id={`edit-value-title-${v.id}`}
                          label={t('admin.careers.titleField')}
                          required
                          value={editValueForm.title}
                          onChange={(e) =>
                            setEditValueForm((f) => ({
                              ...f,
                              title: e.target.value,
                            }))
                          }
                        />
                        <TextArea
                          id={`edit-value-text-${v.id}`}
                          label={t('admin.careers.textField')}
                          rows={3}
                          value={editValueForm.text}
                          onChange={(e) =>
                            setEditValueForm((f) => ({
                              ...f,
                              text: e.target.value,
                            }))
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleUpdateValue(v.id)}
                            disabled={!editValueForm.title}
                          >
                            {t('admin.careers.save')}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditValueId(null)
                              setEditValueForm(blankValue)
                            }}
                          >
                            {t('admin.careers.cancel')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-display font-semibold text-primary-950">
                          {v.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-concrete">
                          {v.text || t('admin.careers.noText')}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditButton
                          label={`Edit ${v.title}`}
                          onClick={() => startEditValue(v.id)}
                        />
                        <DeleteButton
                          label={`Delete ${v.title}`}
                          onDelete={() => handleDeleteValue(v.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ───────────────── BENEFITS ───────────────── */}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">
              {t('admin.careers.benefits')}
            </h2>
            <p className="mt-0.5 text-sm text-concrete">
              {data.benefits.length} benefit{data.benefits.length !== 1 && 's'}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditBenefitId(null)
              setShowCreateBenefit(!showCreateBenefit)
            }}
          >
            {showCreateBenefit ? t('admin.careers.closeForm') : t('admin.careers.newBenefit')}
          </Button>
        </div>

        {showCreateBenefit && (
          <div className="admin-card-flat p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-primary-950">
              {t('admin.careers.newBenefitForm')}
            </h3>
            <div className="flex flex-col gap-4">
              <TextInput
                id="create-benefit-text"
                label={t('admin.careers.textField')}
                required
                value={createBenefitForm.text}
                onChange={(e) =>
                  setCreateBenefitForm({ text: e.target.value })
                }
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCreateBenefit}
                  disabled={!createBenefitForm.text}
                >
                  {t('admin.careers.create')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateBenefit(false)
                    setCreateBenefitForm(blankBenefit)
                  }}
                >
                  {t('admin.careers.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {data.benefits.length === 0 && !showCreateBenefit ? (
          <div className="admin-card-flat border-dashed p-8 text-center">
            <p className="font-display text-base font-semibold text-primary-950">
              {t('admin.careers.noBenefits')}
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-concrete">
              {t('admin.careers.noBenefitsDesc')}
            </p>
          </div>
        ) : (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {data.benefits.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
                >
                  {editBenefitId === b.id ? (
                    <div className="w-full">
                      <h3 className="mb-3 font-display text-sm font-semibold text-primary-950">
                        {t('admin.careers.editBenefit')}
                      </h3>
                      <div className="flex flex-col gap-4">
                        <TextInput
                          id={`edit-benefit-text-${b.id}`}
                          label={t('admin.careers.textField')}
                          required
                          value={editBenefitForm.text}
                          onChange={(e) =>
                            setEditBenefitForm({ text: e.target.value })
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleUpdateBenefit(b.id)}
                            disabled={!editBenefitForm.text}
                          >
                            {t('admin.careers.save')}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditBenefitId(null)
                              setEditBenefitForm(blankBenefit)
                            }}
                          >
                            {t('admin.careers.cancel')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-display font-semibold text-primary-950">
                          {b.text}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditButton
                          label={`Edit ${b.text}`}
                          onClick={() => startEditBenefit(b.id)}
                        />
                        <DeleteButton
                          label={`Delete ${b.text}`}
                          onDelete={() => handleDeleteBenefit(b.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
