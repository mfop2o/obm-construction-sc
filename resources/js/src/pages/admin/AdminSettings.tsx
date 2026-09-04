import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import Button from '../../components/ui/Button'
import { TextInput } from '../../components/admin/fields'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminSettings — profile details (name / email) and password for the
   signed-in administrator. Updates go through PUT /api/users/{id}.
   ========================================================================== */

export default function AdminSettings() {
  const { user, updateProfile } = useAuth()
  const { t } = useTranslation()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  async function handleSaveProfile() {
    setProfileSaving(true)
    setProfileError('')
    setProfileSaved(false)
    try {
      await updateProfile({ name, email })
      setProfileSaved(true)
    } catch {
      setProfileError(t('admin.settings.profileError'))
    } finally {
      setProfileSaving(false)
    }
  }

  async function handleSavePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordError(t('admin.settings.passwordMismatch'))
      return
    }
    if (newPassword.length < 8) {
      setPasswordError(t('admin.settings.passwordTooShort'))
      return
    }
    setPasswordSaving(true)
    setPasswordError('')
    setPasswordSaved(false)
    try {
      await updateProfile({
        name: user?.name ?? name,
        email: user?.email ?? email,
        password: newPassword,
      })
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSaved(true)
    } catch {
      setPasswordError(t('admin.settings.passwordError'))
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary-950">
          {t('admin.settings.title')}
        </h1>
        <p className="mt-1 text-sm text-concrete">
          {t('admin.settings.description')}
        </p>
      </header>

      {/* ---- Profile details ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-primary-950">
          {t('admin.settings.profileDetails')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="profile_name"
            label={t('admin.settings.name')}
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setProfileSaved(false)
            }}
          />
          <TextInput
            id="profile_email"
            label={t('admin.settings.email')}
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setProfileSaved(false)
            }}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSaveProfile} disabled={profileSaving}>
            {profileSaving ? t('admin.settings.saving') : t('admin.settings.save')}
          </Button>
          {profileSaved && (
            <span className="text-sm font-medium text-green-600">{t('admin.settings.saved')}</span>
          )}
          {profileError && (
            <span className="text-sm font-medium text-red-600">
              {profileError}
            </span>
          )}
        </div>
      </section>

      {/* ---- Change password ---- */}
      <section className="rounded-sm border border-primary-100 bg-surface p-5">
        <h2 className="mb-1 font-display text-lg font-semibold text-primary-950">
          {t('admin.settings.changePassword')}
        </h2>
        <p className="mb-4 text-sm text-concrete">
          {t('admin.settings.passwordDescription')}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="new_password"
            label={t('admin.settings.newPassword')}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setPasswordSaved(false)
            }}
          />
          <TextInput
            id="confirm_password"
            label={t('admin.settings.confirmPassword')}
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setPasswordSaved(false)
            }}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSavePassword} disabled={passwordSaving}>
            {passwordSaving ? t('admin.settings.saving') : t('admin.settings.changePasswordBtn')}
          </Button>
          {passwordSaved && (
            <span className="text-sm font-medium text-green-600">{t('admin.settings.saved')}</span>
          )}
          {passwordError && (
            <span className="text-sm font-medium text-red-600">
              {passwordError}
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
