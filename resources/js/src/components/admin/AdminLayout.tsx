import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { cn } from '../../lib/cn'
import { Logo } from '../ui/Logo'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { useTranslation } from '../../i18n'
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Quote,
  BarChart3,
  Info,
  BriefcaseBusiness,
  Building2,
  Inbox,
  UserRoundSearch,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ============================================================================
   AdminLayout — polished admin shell with modern sidebar and top bar.
   ========================================================================== */

interface AdminLink {
  to: string
  labelKey: string
  icon: LucideIcon
  end?: boolean
  badge?: number
}

const navLinks: AdminLink[] = [
  { to: '/admin',             labelKey: 'admin.nav.dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/projects',    labelKey: 'admin.nav.projects',    icon: Briefcase },
  { to: '/admin/services',    labelKey: 'admin.nav.services',    icon: Wrench },
  { to: '/admin/testimonials',labelKey: 'admin.nav.testimonials',icon: Quote },
  { to: '/admin/home-stats',  labelKey: 'admin.nav.homeStats',   icon: BarChart3 },
  { to: '/admin/about',       labelKey: 'admin.nav.about',       icon: Info },
  { to: '/admin/careers',     labelKey: 'admin.nav.careers',     icon: BriefcaseBusiness },
  { to: '/admin/applications',labelKey: 'admin.nav.applications',icon: UserRoundSearch },
  { to: '/admin/contact-info',labelKey: 'admin.nav.contactInfo', icon: Building2 },
  { to: '/admin/inquiries',   labelKey: 'admin.nav.inquiries',   icon: Inbox },
]

const navGroups = [
  { label: 'Content',  links: navLinks.slice(0, 6) },
  { label: 'HR & Ops', links: navLinks.slice(6) },
]

function BrandMark() {
  const { t } = useTranslation()
  return (
    <Link
      to="/admin"
      className="flex items-center gap-3 px-5 py-4"
    >
      <Logo heightClass="h-8" showWordmark={false} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary-950">
          {t('admin.systemName')}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-concrete">
          {t('admin.adminLabel')}
        </span>
      </div>
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
    <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3" aria-label="Admin navigation">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="mb-1.5 px-3 font-display text-[9px] font-bold uppercase tracking-[0.28em] text-concrete-light">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary-950 text-white shadow-sm'
                      : 'text-concrete-dark hover:bg-primary-100/80 hover:text-primary-950',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-accent-400' : 'text-concrete group-hover:text-accent-500',
                      )}
                    />
                    <span className="flex-1">{t(link.labelKey)}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className={cn(
                        'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-display text-[10px] font-bold',
                        isActive ? 'bg-accent-400 text-primary-950' : 'bg-accent-50 text-accent-600',
                      )}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: pinned section */}
      <div className="border-t border-primary-200/60 pt-3">
        <LanguageSwitcher className="mb-2 px-1" />

        {/* User button */}
        <button
          type="button"
          onClick={() => setAdminOpen((o) => !o)}
          aria-expanded={adminOpen}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-primary-100/80"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-950 text-xs font-bold text-accent-400">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-primary-950">
              {user?.name ?? 'Admin'}
            </span>
            <span className="block truncate text-[11px] text-concrete">
              {user?.email ?? ''}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-concrete transition-transform duration-200',
              adminOpen && 'rotate-180',
            )}
          />
        </button>

        {adminOpen && (
          <div className="mt-1 overflow-hidden rounded-xl border border-primary-200/80 bg-white shadow-lg">
            <NavLink
              to="/admin/settings"
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-concrete-dark hover:bg-primary-50 hover:text-primary-950',
                )
              }
            >
              <Settings className="h-4 w-4 text-concrete" />
              {t('admin.settings')}
            </NavLink>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-concrete-dark hover:bg-primary-50 hover:text-primary-950"
            >
              <ExternalLink className="h-4 w-4 text-concrete" />
              View Website
            </a>
            <div className="mx-3 my-1 h-px bg-primary-100" />
            <button
              type="button"
              onClick={() => {
                onLogout()
                onNavigate?.()
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {t('admin.signOut')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

function PageTitle() {
  const location = useLocation()
  const { t } = useTranslation()

  const titleMap: Record<string, string> = {
    '/admin':              t('admin.nav.dashboard'),
    '/admin/projects':     t('admin.nav.projects'),
    '/admin/services':     t('admin.nav.services'),
    '/admin/testimonials': t('admin.nav.testimonials'),
    '/admin/home-stats':   t('admin.nav.homeStats'),
    '/admin/about':        t('admin.nav.about'),
    '/admin/careers':      t('admin.nav.careers'),
    '/admin/applications': t('admin.nav.applications'),
    '/admin/contact-info': t('admin.nav.contactInfo'),
    '/admin/inquiries':    t('admin.nav.inquiries'),
    '/admin/contacts':     'Messages',
    '/admin/settings':     t('admin.settings'),
    '/admin/data':         'Data Management',
  }

  const path = location.pathname.replace(/\/+$/, '')
  return titleMap[path] ?? 'Admin'
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[230px] flex-col border-r border-primary-100 bg-white shadow-[1px_0_0_0_#f0f0f2] lg:flex">
        <BrandMark />
        <div className="mx-3 mb-1 mt-0.5 h-px bg-primary-100" />
        <NavList onLogout={logout} />
      </aside>

      {/* ── Mobile header + drawer ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-primary-100 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-900 hover:bg-primary-100"
        >
          <Menu size={20} />
        </button>
        <span className="font-display text-sm font-bold text-primary-950">
          {t('admin.mobileHeader')}
        </span>
        <Link
          to="/"
          target="_blank"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-concrete hover:bg-primary-100 hover:text-primary-900"
        >
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-primary-100 px-4 py-3">
          <Logo heightClass="h-8" showWordmark />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-concrete hover:bg-primary-100"
          >
            <X size={18} />
          </button>
        </div>
        <NavList onNavigate={() => setOpen(false)} onLogout={logout} />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="lg:pl-[230px]">
        {/* Top bar (desktop) */}
        <div className="sticky top-0 z-20 hidden items-center justify-between border-b border-primary-100/80 bg-white/90 px-8 py-3.5 backdrop-blur-sm lg:flex">
          <div className="flex items-center gap-2 text-xs text-concrete">
            <span className="font-display font-semibold uppercase tracking-wide text-primary-400">Admin</span>
            <span className="text-primary-200">/</span>
            <span className="font-display font-semibold tracking-wide text-primary-950">
              <PageTitle />
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-100 bg-primary-50/80 text-concrete transition-colors hover:bg-primary-100 hover:text-primary-900"
              aria-label="Search"
            >
              <Search size={14} />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-100 bg-primary-50/80 text-concrete transition-colors hover:bg-primary-100 hover:text-primary-900"
              aria-label="Notifications"
            >
              <Bell size={14} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
            </button>

            {/* View site */}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-100 bg-primary-50/80 px-3 py-1.5 font-display text-[11px] font-semibold text-concrete transition-all hover:border-primary-200 hover:bg-primary-100 hover:text-primary-900"
            >
              <ExternalLink size={11} />
              View Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
