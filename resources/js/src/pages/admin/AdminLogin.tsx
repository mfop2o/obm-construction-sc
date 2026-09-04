import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import Button from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminLogin — sign-in gate for the content system (Sanctum SPA session).
   ========================================================================== */

const inputBase =
  'w-full h-14 rounded-none border bg-surface px-4 text-base text-primary-950 ' +
  'placeholder:text-concrete focus:outline-none focus:ring-2 focus:ring-accent-400 ' +
  'transition-colors'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError(t('admin.login.enterCredentials'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch {
      setError(t('admin.login.invalidCredentials'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex">
            <Logo to="/" heightClass="h-14" circle />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary-950">
            {t('admin.login.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.login.description')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-sm border border-primary-100 bg-surface p-6 shadow-sm"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-primary-900">
              {t('admin.login.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin.login.emailPlaceholder')}
              className={`${inputBase} border-primary-200`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-primary-900">
              {t('admin.login.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.login.passwordPlaceholder')}
              className={`${inputBase} border-primary-200`}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? t('admin.login.signingIn') : t('admin.login.signIn')}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-concrete">
          {t('admin.login.defaultHint')}
        </p>
      </div>
    </div>
  )
}
