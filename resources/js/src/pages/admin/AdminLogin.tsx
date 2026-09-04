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
  'w-full h-10 rounded-lg border bg-surface px-4 text-[14px] text-primary-950 ' +
  'placeholder:text-concrete focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent ' +
  'transition-all shadow-sm'

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
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative background element for a professional look */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-stone-50 to-stone-50" />

      <div className="w-full max-w-[420px] relative z-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-primary-200/60 bg-surface px-8 py-8 shadow-2xl shadow-primary-900/5"
          noValidate
        >
          <div className="flex flex-col items-center text-center pb-1">
            <div className="inline-flex mb-4 rounded-full bg-stone-50 p-2 shadow-inner">
              <Logo to="/" heightClass="h-12" circle />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary-950">
              OBM Construction System
            </h1>
            <p className="mt-1.5 text-sm text-concrete-dark">
              Sign in to manage the site
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-primary-900">
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
                className={`${inputBase} border-primary-200 h-10`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-primary-900">
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
                className={`${inputBase} border-primary-200 h-10`}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-2.5 text-sm font-medium text-red-600 border border-red-100" role="alert">
              {error}
            </div>
          )}

          <div className="pt-1">
            <Button type="submit" size="md" className="w-full h-10 text-[15px] rounded-lg shadow-md hover:shadow-lg transition-shadow" disabled={busy}>
              {busy ? t('admin.login.signingIn') : t('admin.login.signIn')}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-[13px] font-medium text-concrete">
          {t('admin.login.defaultHint')}
        </p>
      </div>
    </div>
  )
}
