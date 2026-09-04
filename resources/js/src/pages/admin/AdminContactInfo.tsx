import { useState } from 'react'
import {
  useContactData,
  updateContactSettings,
  createOffice,
  updateOffice,
  deleteOffice,
} from '../../lib/contentStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { TextInput } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminContactInfo — company contact settings + offices list.
   ========================================================================== */

export default function AdminContactInfo() {
  const { settings, offices } = useContactData()
  const { t } = useTranslation()

  /* ---- Contact settings form ---- */
  const [phone, setPhone] = useState(settings.phone)
  const [email, setEmail] = useState(settings.email)
  const [address1, setAddress1] = useState(settings.address_line_1)
  const [address2, setAddress2] = useState(settings.address_line_2 ?? '')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState('')

  async function handleSaveSettings() {
    setSettingsSaving(true)
    setSettingsError('')
    setSettingsSaved(false)
    try {
      await updateContactSettings({
        phone,
        email,
        address_line_1: address1,
        address_line_2: address2,
      })
      setSettingsSaved(true)
    } catch {
      setSettingsError(t('admin.contactInfo.settingsError'))
    } finally {
      setSettingsSaving(false)
    }
  }

  /* ---- Offices ---- */
  const [editId, setEditId] = useState<number | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [officeForm, setOfficeForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  })
  const [officeSaving, setOfficeSaving] = useState(false)
  const [officeError, setOfficeError] = useState('')

  function openEditOffice(o: (typeof offices)[number]) {
    setEditId(o.id)
    setShowNew(false)
    setOfficeForm({
      name: o.name,
      address: o.address ?? '',
      city: o.city ?? '',
      phone: o.phone ?? '',
      email: o.email ?? '',
    })
  }

  function openNewOffice() {
    setEditId(null)
    setShowNew(true)
    setOfficeForm({ name: '', address: '', city: '', phone: '', email: '' })
  }

  function closeOfficeForm() {
    setEditId(null)
    setShowNew(false)
    setOfficeForm({ name: '', address: '', city: '', phone: '', email: '' })
  }

  async function handleSaveOffice() {
    setOfficeSaving(true)
    setOfficeError('')
    try {
      const input = {
        name: officeForm.name,
        address: officeForm.address || null,
        city: officeForm.city || null,
        phone: officeForm.phone || null,
        email: officeForm.email || null,
      }
      if (editId) {
        await updateOffice(editId, input)
      } else {
        await createOffice(input)
      }
      closeOfficeForm()
    } catch {
      setOfficeError(t('admin.contactInfo.officeError'))
    } finally {
      setOfficeSaving(false)
    }
  }

  const showOfficeForm = showNew || editId !== null

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.contactInfo.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.contactInfo.description')}
          </p>
        </div>
      </header>

      {/* ---- Section 1: Contact Settings ---- */}
      <section className="admin-card-flat p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.contactInfo.companyDetails')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="phone"
            label={t('admin.contactInfo.phone')}
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setSettingsSaved(false)
            }}
          />
          <TextInput
            id="email"
            label={t('admin.contactInfo.email')}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setSettingsSaved(false)
            }}
          />
          <TextInput
            id="address_line_1"
            label={t('admin.contactInfo.addressLine1')}
            required
            value={address1}
            onChange={(e) => {
              setAddress1(e.target.value)
              setSettingsSaved(false)
            }}
          />
          <TextInput
            id="address_line_2"
            label={t('admin.contactInfo.addressLine2')}
            value={address2}
            onChange={(e) => {
              setAddress2(e.target.value)
              setSettingsSaved(false)
            }}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSaveSettings} disabled={settingsSaving}>
            {settingsSaving ? t('admin.contactInfo.saving') : t('admin.contactInfo.save')}
          </Button>
          {settingsSaved && (
            <span className="text-sm font-medium text-green-600">{t('admin.contactInfo.saved')}</span>
          )}
          {settingsError && (
            <span className="text-sm font-medium text-red-600">
              {settingsError}
            </span>
          )}
        </div>
      </section>

      {/* ---- Section 2: Offices List ---- */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.contactInfo.offices')}
        </h2>

        {officeError && (
          <div className="mb-4 rounded-sm border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700">
            {officeError}
          </div>
        )}

        {offices.length === 0 && !showOfficeForm ? (
          <div className="admin-card-flat border-dashed p-10 text-center">
            <p className="font-display text-lg font-semibold text-primary-950">
              {t('admin.contactInfo.noOffices')}
            </p>
            <div className="mt-6">
              <Button onClick={openNewOffice}>{t('admin.contactInfo.addOffice')}</Button>
            </div>
          </div>
        ) : (
          <div className="admin-card-flat overflow-hidden">
            <ul className="divide-y divide-primary-100">
              {offices.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-primary-950">
                      {o.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-concrete">
                      {[o.address, o.city].filter(Boolean).join(', ') || '—'}{' '}
                      · {o.phone || '—'} · {o.email || '—'}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <EditButton
                      label={`Edit ${o.name}`}
                      onClick={() => openEditOffice(o)}
                    />
                    <DeleteButton
                      label={`Delete ${o.name}`}
                      onDelete={() => {
                        void deleteOffice(o.id).catch(() => {
                          setOfficeError(t('admin.contactInfo.deleteError'))
                        })
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- Section 3: New office form (inline, always visible after clicking Add) ---- */}
        {!showOfficeForm ? (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={openNewOffice}>
              {t('admin.contactInfo.addOffice')}
            </Button>
          </div>
        ) : (
          <div className="mt-4 rounded-sm border border-primary-200 bg-surface p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-primary-950">
              {editId ? t('admin.contactInfo.editOffice') : t('admin.contactInfo.newOffice')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                id="office_name"
                label={t('admin.contactInfo.nameField')}
                required
                value={officeForm.name}
                onChange={(e) =>
                  setOfficeForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <TextInput
                id="office_address"
                label={t('admin.contactInfo.address')}
                value={officeForm.address}
                onChange={(e) =>
                  setOfficeForm((f) => ({ ...f, address: e.target.value }))
                }
              />
              <TextInput
                id="office_city"
                label={t('admin.contactInfo.city')}
                value={officeForm.city}
                onChange={(e) =>
                  setOfficeForm((f) => ({ ...f, city: e.target.value }))
                }
              />
              <TextInput
                id="office_phone"
                label={t('admin.contactInfo.phone')}
                value={officeForm.phone}
                onChange={(e) =>
                  setOfficeForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
              <TextInput
                id="office_email"
                label={t('admin.contactInfo.email')}
                value={officeForm.email}
                onChange={(e) =>
                  setOfficeForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={handleSaveOffice} disabled={officeSaving}>
                {officeSaving ? t('admin.contactInfo.saving') : editId ? t('admin.contactInfo.update') : t('admin.contactInfo.create')}
              </Button>
              <Button variant="ghost" onClick={closeOfficeForm}>
                {t('admin.contactInfo.cancel')}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
