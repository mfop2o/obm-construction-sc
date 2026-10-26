import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import Button from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { useTranslation } from '../../i18n'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

/* ============================================================================
   AdminLogin — polished sign-in gate for the content system.
   ========================================================================== */

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Left panel: branding */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-primary-950 p-12 lg:flex">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-900/60" />

        <div className="relative">
          <Logo heightClass="h-10" showWordmark light />
        </div>

        <div className="relative">
          <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-[0.3em] text-accent-400">
            Content Management System
          </p>
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-white xl:text-4xl">
            We Build Strong,<br />
            Finish with<br />
            <span className="text-accent-400">Quality.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-400">
            Manage your construction portfolio, services, team, and client communications from one place.
          </p>
        </div>

        <p className="relative font-display text-[11px] font-medium uppercase tracking-[0.2em] text-primary-600">
          OBM Construction S.C. © {new Date().getFullYear()}
        </p>
      </div>

      {/* Right panel: form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo heightClass="h-10" showWordmark />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-primary-950">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-concrete">
              Sign in to your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-display text-[13px] font-semibold text-primary-900">
                {t('admin.login.email')}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete" />
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
                  className="h-11 w-full rounded-xl border border-primary-200 bg-white pl-10 pr-4 text-[14px] text-primary-950 placeholder:text-concrete shadow-sm transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-display text-[13px] font-semibold text-primary-900">
                {t('admin.login.password')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.login.passwordPlaceholder')}
                  className="h-11 w-full rounded-xl border border-primary-200 bg-white pl-10 pr-11 text-[14px] text-primary-950 placeholder:text-concrete shadow-sm transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-concrete transition-colors hover:text-primary-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="md"
              disabled={busy}
              className="mt-1 h-11 w-full rounded-xl bg-primary-950 font-display font-semibold text-white shadow-sm hover:bg-primary-800 hover:shadow-md"
            >
              {busy ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t('admin.login.signingIn')}
                </span>
              ) : (
                t('admin.login.signIn')
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-[12px] text-concrete">
            {t('admin.login.defaultHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
