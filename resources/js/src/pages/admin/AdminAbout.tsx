import { useState } from 'react'
import {
  useAboutData,
  updateAboutSettings,
  createAboutValue,
  updateAboutValue,
  deleteAboutValue,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../../lib/contentStore'
import { TextArea, TextInput } from '../../components/admin/fields'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { useTranslation } from '../../i18n'

export default function AdminAbout() {
  const { settings, values, milestones } = useAboutData()
  const { t } = useTranslation()

  const [mission, setMission] = useState(settings.mission)
  const [vision, setVision] = useState(settings.vision)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState('')

  const [editingValueId, setEditingValueId] = useState<number | null>(null)
  const [valueTitle, setValueTitle] = useState('')
  const [valueDescription, setValueDescription] = useState('')
  const [newValueTitle, setNewValueTitle] = useState('')
  const [newValueDescription, setNewValueDescription] = useState('')
  const [valueError, setValueError] = useState('')

  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null)
  const [msYear, setMsYear] = useState('')
  const [msTitle, setMsTitle] = useState('')
  const [msDescription, setMsDescription] = useState('')
  const [newMsYear, setNewMsYear] = useState('')
  const [newMsTitle, setNewMsTitle] = useState('')
  const [newMsDescription, setNewMsDescription] = useState('')
  const [msError, setMsError] = useState('')

  function handleSaveSettings() {
    setSettingsError('')
    setSettingsSaved(false)
    void updateAboutSettings({ mission, vision })
      .then(() => setSettingsSaved(true))
      .catch((e: unknown) => setSettingsError(e instanceof Error ? e.message : t('admin.about.saveError')))
  }

  function startEditValue(v: { id: number; title: string; description: string }) {
    setEditingValueId(v.id)
    setValueTitle(v.title)
    setValueDescription(v.description)
    setValueError('')
  }

  function handleSaveValue(id: number) {
    setValueError('')
    void updateAboutValue(id, { title: valueTitle, description: valueDescription })
      .then(() => { setEditingValueId(null) })
      .catch((e: unknown) => setValueError(e instanceof Error ? e.message : t('admin.about.updateError')))
  }

  function handleCreateValue() {
    setValueError('')
    void createAboutValue({ title: newValueTitle, description: newValueDescription })
      .then(() => { setNewValueTitle(''); setNewValueDescription('') })
      .catch((e: unknown) => setValueError(e instanceof Error ? e.message : t('admin.about.createError')))
  }

  function handleDeleteValue(id: number) {
    setValueError('')
    void deleteAboutValue(id).catch((e: unknown) =>
      setValueError(e instanceof Error ? e.message : t('admin.about.deleteError')),
    )
  }

  function startEditMilestone(m: { id: number; year: string; title: string; description: string | null }) {
    setEditingMilestoneId(m.id)
    setMsYear(m.year)
    setMsTitle(m.title)
    setMsDescription(m.description ?? '')
    setMsError('')
  }

  function handleSaveMilestone(id: number) {
    setMsError('')
    void updateMilestone(id, { year: msYear, title: msTitle, description: msDescription })
      .then(() => { setEditingMilestoneId(null) })
      .catch((e: unknown) => setMsError(e instanceof Error ? e.message : t('admin.about.updateError')))
  }

  function handleCreateMilestone() {
    setMsError('')
    void createMilestone({ year: newMsYear, title: newMsTitle, description: newMsDescription })
      .then(() => { setNewMsYear(''); setNewMsTitle(''); setNewMsDescription('') })
      .catch((e: unknown) => setMsError(e instanceof Error ? e.message : t('admin.about.createError')))
  }

  function handleDeleteMilestone(id: number) {
    setMsError('')
    void deleteMilestone(id).catch((e: unknown) =>
      setMsError(e instanceof Error ? e.message : t('admin.about.deleteError')),
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">{t('admin.about.title')}</h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.about.description')}
          </p>
        </div>
      </header>

      {/* ---- Mission & Vision ---- */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-primary-950">
          {t('admin.about.missionVision')}
        </h2>
        {settingsError && (
          <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {settingsError}
          </div>
        )}
        <div className="admin-card-flat p-6">
          <div className="flex flex-col gap-4">
            <TextArea
              id="mission"
              label={t('admin.about.mission')}
              rows={3}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              required
            />
            <TextArea
              id="vision"
              label={t('admin.about.vision')}
              rows={3}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              required
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSaveSettings}>{t('admin.about.save')}</Button>
              {settingsSaved && (
                <span className="text-sm text-green-600">{t('admin.about.saved')}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Core Values ---- */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-primary-950">
          {t('admin.about.coreValues')}
        </h2>
        {valueError && (
          <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {valueError}
          </div>
        )}
        {values.length > 0 && (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {values.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
                >
                  {editingValueId === v.id ? (
                    <div className="flex flex-1 flex-col gap-3">
                      <TextInput
                        id={`value-title-${v.id}`}
                        label={t('admin.about.titleField')}
                        value={valueTitle}
                        onChange={(e) => setValueTitle(e.target.value)}
                        required
                      />
                      <TextArea
                        id={`value-desc-${v.id}`}
                        label={t('admin.about.descriptionField')}
                        rows={2}
                        value={valueDescription}
                        onChange={(e) => setValueDescription(e.target.value)}
                        required
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleSaveValue(v.id)}>
                          {t('admin.about.save')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingValueId(null)}
                        >
                          {t('admin.about.cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display font-semibold text-primary-950">
                          {v.title}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-concrete">
                          {v.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditButton
                          label={`Edit ${v.title}`}
                          onClick={() => startEditValue(v)}
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

        <div className="admin-card-flat border-dashed p-6">
          <h3 className="font-display text-sm font-semibold text-primary-950">
            {t('admin.about.newValue')}
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            <TextInput
              id="new-value-title"
              label={t('admin.about.titleField')}
              value={newValueTitle}
              onChange={(e) => setNewValueTitle(e.target.value)}
              required
            />
            <TextArea
              id="new-value-desc"
              label={t('admin.about.descriptionField')}
              rows={2}
              value={newValueDescription}
              onChange={(e) => setNewValueDescription(e.target.value)}
              required
            />
            <div>
              <Button size="sm" onClick={handleCreateValue}>
                {t('admin.about.addValue')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Milestones ---- */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold text-primary-950">
          {t('admin.about.milestones')}
        </h2>
        {msError && (
          <div className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msError}
          </div>
        )}
        {milestones.length > 0 && (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {milestones.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
                >
                  {editingMilestoneId === m.id ? (
                    <div className="flex flex-1 flex-col gap-3">
                      <TextInput
                        id={`ms-year-${m.id}`}
                        label={t('admin.about.year')}
                        value={msYear}
                        onChange={(e) => setMsYear(e.target.value)}
                        required
                      />
                      <TextInput
                        id={`ms-title-${m.id}`}
                        label={t('admin.about.titleField')}
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        required
                      />
                      <TextArea
                        id={`ms-desc-${m.id}`}
                        label={t('admin.about.descriptionField')}
                        rows={2}
                        value={msDescription}
                        onChange={(e) => setMsDescription(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleSaveMilestone(m.id)}>
                          {t('admin.about.save')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMilestoneId(null)}
                        >
                          {t('admin.about.cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-900">
                            {m.year}
                          </span>
                          <p className="truncate font-display font-semibold text-primary-950">
                            {m.title}
                          </p>
                        </div>
                        {m.description && (
                          <p className="mt-0.5 truncate text-sm text-concrete">
                            {m.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <EditButton
                          label={`Edit ${m.title}`}
                          onClick={() => startEditMilestone(m)}
                        />
                        <DeleteButton
                          label={`Delete ${m.title}`}
                          onDelete={() => handleDeleteMilestone(m.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-card-flat border-dashed p-6">
          <h3 className="font-display text-sm font-semibold text-primary-950">
            {t('admin.about.newMilestone')}
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            <TextInput
              id="new-ms-year"
              label={t('admin.about.year')}
              value={newMsYear}
              onChange={(e) => setNewMsYear(e.target.value)}
              required
            />
            <TextInput
              id="new-ms-title"
              label={t('admin.about.titleField')}
              value={newMsTitle}
              onChange={(e) => setNewMsTitle(e.target.value)}
              required
            />
            <TextArea
              id="new-ms-desc"
              label={t('admin.about.descriptionField')}
              rows={2}
              value={newMsDescription}
              onChange={(e) => setNewMsDescription(e.target.value)}
            />
            <div>
              <Button size="sm" onClick={handleCreateMilestone}>
                {t('admin.about.addMilestone')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
