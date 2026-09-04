import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { cn } from '../../lib/cn'
import { Logo } from '../ui/Logo'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminLayout — protected-ish content "system" shell with a responsive sidebar.
   ========================================================================== */

interface AdminLink {
  to: string
  labelKey: string
  end?: boolean
}

const navLinks: AdminLink[] = [
  { to: '/admin', labelKey: 'admin.nav.dashboard', end: true },
  { to: '/admin/projects', labelKey: 'admin.nav.projects' },
  { to: '/admin/services', labelKey: 'admin.nav.services' },
  { to: '/admin/testimonials', labelKey: 'admin.nav.testimonials' },
  { to: '/admin/home-stats', labelKey: 'admin.nav.homeStats' },
  { to: '/admin/about', labelKey: 'admin.nav.about' },
  { to: '/admin/careers', labelKey: 'admin.nav.careers' },
  { to: '/admin/contact-info', labelKey: 'admin.nav.contactInfo' },
  { to: '/admin/contacts', labelKey: 'admin.nav.contacts' },
]

function BrandMark() {
  const { t } = useTranslation()
  return (
    <Link
      to="/admin"
      className="flex items-center gap-3 border-b border-primary-200/60 bg-surface/80 px-6 py-4"
    >
      <Logo heightClass="h-9" showWordmark={false} />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-primary-950">
          {t('admin.systemName')}
        </span>
        <span className="text-[11px] font-medium text-concrete">{t('admin.adminLabel')}</span>
      </span>
    </Link>
  )
}

function NavList({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void
  onLogout: () => void
}) {
  const [adminOpen, setAdminOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
      <div className="flex flex-col gap-0.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent-400/10 text-primary-950'
                  : 'text-concrete-dark hover:bg-primary-100/70 hover:text-primary-950',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-400 transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {t(link.labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* —— bottom: pinned —— */}
      <div className="mt-auto border-t border-primary-200/60 pt-3">
        <LanguageSwitcher className="mb-2" />
        <button
          type="button"
          onClick={() => setAdminOpen((o) => !o)}
          aria-expanded={adminOpen}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-primary-100/70"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400 text-xs font-bold text-primary-950">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-primary-950">
              {user?.name ?? 'Admin'}
            </span>
            <span className="block truncate text-[11px] text-concrete">
              {user?.email ?? ''}
            </span>
          </span>
          <svg
            className={cn(
              'h-4 w-4 shrink-0 text-concrete transition-transform duration-200',
              adminOpen && 'rotate-180',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {adminOpen && (
          <div className="mt-1 flex flex-col gap-0.5 rounded-md border border-primary-200/60 bg-surface p-1.5 shadow-sm">
            <NavLink
              to="/admin/settings"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent-400/10 text-primary-950'
                    : 'text-concrete-dark hover:bg-primary-100/70 hover:text-primary-950',
                )
              }
            >
              {t('admin.settings')}
            </NavLink>
            <button
              type="button"
              onClick={() => {
                onLogout()
                onNavigate?.()
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] font-medium text-concrete-dark transition-colors hover:bg-primary-100/70 hover:text-primary-950"
            >
              {t('admin.signOut')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-primary-100 bg-primary-50/70 lg:flex">
        <BrandMark />
        <NavList onLogout={logout} />
      </aside>

      {/* Mobile header + drawer */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-primary-100 bg-surface px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="inline-flex h-10 w-10 items-center justify-center text-primary-900 hover:bg-primary-100"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="font-display text-sm font-bold uppercase tracking-wide text-primary-950">
          {t('admin.mobileHeader')}
        </span>
        <span className="w-10" aria-hidden="true" />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform bg-primary-50/70 shadow-xl transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="inline-flex h-10 w-10 items-center justify-center text-concrete hover:bg-primary-100 hover:text-primary-950"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <NavList onNavigate={() => setOpen(false)} onLogout={logout} />
      </div>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
