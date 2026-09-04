import { useState } from 'react'
import {
  useServices,
  createService,
  updateService,
  deleteService,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { TextInput, TextArea } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

type ServiceForm = {
  title: string
  description: string
  overview: string
  image: string
  image_key: string
  capabilities: string
}

const blankForm: ServiceForm = {
  title: '',
  description: '',
  overview: '',
  image: '',
  image_key: '',
  capabilities: '',
}

const IMAGE_HINT =
  'Visual key used in ProjectVisual components. Valid options: facade, crane, road, framework, gears, blueprint, concrete, scaffolding, survey'
const IMAGE_KEY_HINT =
  'Key into the public photo registry. Valid options: building, roads, civil, commercial, residential, infrastructure'

export default function AdminServices() {
  const services = useServices()
  const { t } = useTranslation()

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<ServiceForm>(blankForm)

  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<ServiceForm>(blankForm)

  const [errorMessage, setErrorMessage] = useState('')

  function parseCapabilities(raw: string): string[] {
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  function capabilitiesString(arr: string[]): string {
    return arr.join('\n')
  }

  function startEdit(id: number) {
    const s = services.find((x) => x.id === id)
    if (!s) return
    setEditId(id)
    setEditForm({
      title: s.title,
      description: s.description,
      overview: s.overview,
      image: s.image,
      image_key: s.image_key ?? '',
      capabilities: capabilitiesString(s.capabilities),
    })
    setShowCreate(false)
    setErrorMessage('')
  }

  function reset() {
    setEditId(null)
    setEditForm(blankForm)
    setShowCreate(false)
    setCreateForm(blankForm)
    setErrorMessage('')
  }

  function handleCreate() {
    setErrorMessage('')
    void createService({
      title: createForm.title,
      description: createForm.description,
      overview: createForm.overview,
      image: createForm.image,
      image_key: createForm.image_key || null,
      capabilities: parseCapabilities(createForm.capabilities),
    })
      .then(() => {
        setCreateForm(blankForm)
        setShowCreate(false)
      })
      .catch(() => {
        setErrorMessage(t('admin.services.createError'))
      })
  }

  function handleUpdate(id: number) {
    setErrorMessage('')
    void updateService(id, {
      title: editForm.title,
      description: editForm.description,
      overview: editForm.overview,
      image: editForm.image,
      image_key: editForm.image_key || null,
      capabilities: parseCapabilities(editForm.capabilities),
    })
      .then(() => {
        reset()
      })
      .catch(() => {
        setErrorMessage(t('admin.services.updateError'))
      })
  }

  function handleDelete(id: number) {
    setErrorMessage('')
    void deleteService(id).catch(() => {
      setErrorMessage(t('admin.services.deleteError'))
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.services.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.services.description')}
          </p>
        </div>
        <Button
          onClick={() => {
            reset()
            setShowCreate(!showCreate)
          }}
        >
          {showCreate ? t('admin.services.closeForm') : t('admin.services.newService')}
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
            {t('admin.services.newServiceForm')}
          </h2>
          <div className="flex flex-col gap-4">
            <TextInput
              id="create-title"
              label={t('admin.services.titleField')}
              required
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <TextArea
              id="create-description"
              label={t('admin.services.description')}
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <TextArea
              id="create-overview"
              label={t('admin.services.overview')}
              value={createForm.overview}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, overview: e.target.value }))
              }
            />
            <TextInput
              id="create-image"
              label={t('admin.services.imageKey')}
              value={createForm.image}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, image: e.target.value }))
              }
              hint={IMAGE_HINT}
            />
            <TextInput
              id="create-image-key"
              label={t('admin.services.photoRegistry')}
              value={createForm.image_key}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, image_key: e.target.value }))
              }
              hint={IMAGE_KEY_HINT}
            />
            <TextArea
              id="create-capabilities"
              label={t('admin.services.capabilities')}
              rows={4}
              value={createForm.capabilities}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, capabilities: e.target.value }))
              }
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleCreate} disabled={!createForm.title}>
                {t('admin.services.create')}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {t('admin.services.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {services.length === 0 && !showCreate ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.services.noServices')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.services.noServicesDesc')}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => {
                reset()
                setShowCreate(true)
              }}
            >
              {t('admin.services.createService')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
              >
                {editId === s.id ? (
                  <div className="w-full">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-display text-sm font-semibold text-primary-950">
                        {t('admin.services.editService')}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <TextInput
                        id={`edit-title-${s.id}`}
                        label={t('admin.services.titleField')}
                        required
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, title: e.target.value }))
                        }
                      />
                      <TextArea
                        id={`edit-description-${s.id}`}
                        label={t('admin.services.description')}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                      <TextArea
                        id={`edit-overview-${s.id}`}
                        label={t('admin.services.overview')}
                        value={editForm.overview}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            overview: e.target.value,
                          }))
                        }
                      />
                      <TextInput
                        id={`edit-image-${s.id}`}
                        label={t('admin.services.imageKey')}
                        value={editForm.image}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            image: e.target.value,
                          }))
                        }
                        hint={IMAGE_HINT}
                      />
                      <TextInput
                        id={`edit-image-key-${s.id}`}
                        label={t('admin.services.photoRegistry')}
                        value={editForm.image_key}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            image_key: e.target.value,
                          }))
                        }
                        hint={IMAGE_KEY_HINT}
                      />
                      <TextArea
                        id={`edit-capabilities-${s.id}`}
                        label={t('admin.services.capabilities')}
                        rows={4}
                        value={editForm.capabilities}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            capabilities: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleUpdate(s.id)}
                          disabled={!editForm.title}
                        >
                          {t('admin.services.save')}
                        </Button>
                        <Button variant="ghost" onClick={reset}>
                          {t('admin.services.cancel')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate font-display font-semibold text-primary-950">
                        {s.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-concrete">
                        {s.description || t('admin.services.noDescription')}
                        {s.capabilities.length > 0 &&
                          ` · ${s.capabilities.length} ${s.capabilities.length === 1 ? 'capability' : 'capabilities'}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <EditButton
                        label={`Edit ${s.title}`}
                        onClick={() => startEdit(s.id)}
                      />
                      <DeleteButton
                        label={`Delete ${s.title}`}
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
