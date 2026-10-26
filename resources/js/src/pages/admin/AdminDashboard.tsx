import { Link } from 'react-router-dom'
import {
  projectCategories,
  projectStatuses,
  projectStatusKey,
  useProjects,
  useProjectsStatus,
  getProjectImage,
} from '../../lib/projectsStore'
import {
  useCareersData,
  useContacts,
  useHomeStats,
  useServices,
  useTestimonials,
  useAboutData,
  useContentReady,
  useContactsReady,
} from '../../lib/contentStore'
import { useTranslation } from '../../i18n'
import {
  Briefcase,
  Wrench,
  Quote,
  BriefcaseBusiness,
  BarChart3,
  Trophy,
  Mail,
  ArrowUpRight,
  FolderOpen,
  Star,
  Users,
  TrendingUp,
  ChevronRight,
  Activity,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ============================================================================
   AdminDashboard — modern overview of the dynamic content system.
   ========================================================================== */

interface StatCard {
  label: string
  value: number
  to: string
  icon: LucideIcon
  color: string
  bg: string
}

const categoryColors = [
  'bg-primary-700',
  'bg-accent-500',
  'bg-primary-500',
  'bg-accent-600',
  'bg-primary-400',
  'bg-accent-400',
  'bg-primary-600',
  'bg-accent-700',
]

const statusColors = [
  'bg-primary-500',
  'bg-accent-400',
  'bg-emerald-500',
  'bg-primary-400',
  'bg-accent-500',
  'bg-primary-700',
]

export default function AdminDashboard() {
  const projects = useProjects()
  const projectsReady = useProjectsStatus()
  const testimonials = useTestimonials()
  const services = useServices()
  const careers = useCareersData()
  const stats = useHomeStats()
  const about = useAboutData()
  const contacts = useContacts()
  const contentReady = useContentReady()
  const contactsReady = useContactsReady()
  const ready = contentReady && contactsReady && projectsReady !== 'loading'
  const { t } = useTranslation()

  const unreadContacts = contacts.filter((c) => !c.read).length
  const featured = projects.filter((p) => p.featured)
  const maxCategoryCount = Math.max(
    ...projectCategories.map((c) => projects.filter((p) => p.category === c).length),
    1,
  )
  const maxStatusCount = Math.max(
    ...projectStatuses.map((s) => projects.filter((p) => p.status === s).length),
    1,
  )

  const statCards: StatCard[] = [
    {
      label: t('admin.dashboard.projects'),
      value: projects.length,
      to: '/admin/projects',
      icon: Briefcase,
      color: 'text-accent-600',
      bg: 'bg-accent-50',
    },
    {
      label: t('admin.dashboard.services'),
      value: services.length,
      to: '/admin/services',
      icon: Wrench,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('admin.dashboard.testimonials'),
      value: testimonials.length,
      to: '/admin/testimonials',
      icon: Quote,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: t('admin.dashboard.openings'),
      value: careers.openings.length,
      to: '/admin/careers',
      icon: BriefcaseBusiness,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.dashboard.homeStats'),
      value: stats.length,
      to: '/admin/home-stats',
      icon: BarChart3,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: t('admin.dashboard.milestones'),
      value: about.milestones.length,
      to: '/admin/about',
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: t('admin.dashboard.unreadMessages'),
      value: unreadContacts,
      to: '/admin/contacts',
      icon: Mail,
      color: unreadContacts > 0 ? 'text-red-600' : 'text-slate-600',
      bg: unreadContacts > 0 ? 'bg-red-50' : 'bg-slate-50',
    },
  ]

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-100 border-t-primary-900" />
          <span className="font-display text-xs font-medium uppercase tracking-wider text-concrete">Loading…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {/* ── Page header ──────────────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent-500" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-concrete">
              Overview
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-950 sm:text-3xl">
            {t('admin.dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.dashboard.description')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-950 px-4 py-2.5 font-display text-sm font-semibold text-white transition-all hover:bg-primary-800 hover:shadow-md"
          >
            <FolderOpen className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </header>

      {/* ── Stat cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.slice(0, 4).map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group relative overflow-hidden rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-concrete">{s.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-primary-950">
                    {s.value}
                  </p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 text-primary-200 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary-400" />
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {statCards.slice(4).map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group relative overflow-hidden rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-concrete">{s.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-primary-950">
                    {s.value}
                  </p>
                  {s.label === t('admin.dashboard.unreadMessages') && unreadContacts > 0 && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                      <TrendingUp className="h-3 w-3" />
                      Needs attention
                    </span>
                  )}
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <ChevronRight className="absolute bottom-4 right-4 h-4 w-4 text-primary-200 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary-400" />
            </Link>
          )
        })}
      </div>

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-sm font-semibold text-primary-950">Quick Actions</h2>
          <span className="rounded-full bg-primary-100 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-concrete">
            Shortcuts
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {[
            { to: '/admin/projects/new', icon: FolderOpen, label: 'New Project' },
            { to: '/admin/contacts',     icon: Mail,       label: 'View Messages', badge: unreadContacts },
            { to: '/admin/testimonials', icon: Star,       label: 'Add Testimonial' },
            { to: '/admin/careers',      icon: Users,      label: 'Manage Careers' },
          ].map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="inline-flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-2.5 font-display text-[13px] font-medium text-primary-900 transition-all hover:border-primary-200 hover:bg-white hover:shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-accent-500" />
                {action.label}
                {action.badge !== undefined && action.badge > 0 && (
                  <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1.5 font-display text-[10px] font-bold text-white">
                    {action.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Charts + featured ─────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* By category */}
        <section className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-sm font-semibold text-primary-950">
            {t('admin.dashboard.projectsByCategory')}
          </h2>
          <ul className="mt-5 flex flex-col gap-3.5">
            {projectCategories.map((category, index) => {
              const count = projects.filter((p) => p.category === category).length
              const pct = Math.round((count / maxCategoryCount) * 100)
              return (
                <li key={category}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${categoryColors[index % categoryColors.length]}`}
                      />
                      <span className="font-display text-[13px] font-medium text-primary-900">{category}</span>
                    </div>
                    <span className="font-display text-[12px] font-semibold tabular-nums text-concrete">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className={`h-full rounded-full ${categoryColors[index % categoryColors.length]} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* By status */}
        <section className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-sm font-semibold text-primary-950">
            {t('admin.dashboard.projectsByStatus')}
          </h2>
          <ul className="mt-5 flex flex-col gap-3.5">
            {projectStatuses.map((status, index) => {
              const count = projects.filter((p) => p.status === status).length
              const pct = Math.round((count / maxStatusCount) * 100)
              return (
                <li key={status}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${statusColors[index % statusColors.length]}`}
                      />
                      <span className="font-display text-[13px] font-medium text-primary-900">
                        {t(`projects.status.${projectStatusKey(status)}`)}
                      </span>
                    </div>
                    <span className="font-display text-[12px] font-semibold tabular-nums text-concrete">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className={`h-full rounded-full ${statusColors[index % statusColors.length]} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Featured projects */}
        <section className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-primary-950">
              {t('admin.dashboard.featuredProject')}
            </h2>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1 font-display text-xs font-semibold text-accent-600 transition-colors hover:text-accent-500"
            >
              {t('admin.dashboard.viewAll')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {featured.slice(0, 4).map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/admin/projects/${p.slug}`}
                    className="flex items-center gap-3.5 rounded-xl border border-primary-100 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/50"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-primary-100">
                      {getProjectImage(p) ? (
                        <img src={getProjectImage(p)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-900 font-display text-xs font-bold text-accent-400">
                          {p.title.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[13px] font-semibold text-primary-900">
                        {p.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-concrete">
                        {p.category} · {p.status} · {p.year}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary-200" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary-200 bg-primary-50/50 px-4 py-10 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                <Briefcase className="h-5 w-5 text-concrete" />
              </div>
              <p className="font-display text-sm font-semibold text-primary-900">
                {t('admin.dashboard.noFeatured')}
              </p>
              <Link
                to="/admin/projects"
                className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-accent-600 hover:text-accent-500"
              >
                Set featured project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* Recent messages */}
        <section className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-primary-950">
              Recent Messages
            </h2>
            <Link
              to="/admin/contacts"
              className="inline-flex items-center gap-1 font-display text-xs font-semibold text-accent-600 transition-colors hover:text-accent-500"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {contacts.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {contacts.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link
                    to="/admin/contacts"
                    className="flex items-start gap-3.5 rounded-xl border border-primary-100 p-3 transition-all hover:border-primary-200 hover:bg-primary-50/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-950 font-display text-[11px] font-bold text-accent-400">
                      {(c.name ?? 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-[13px] font-semibold text-primary-900">
                          {c.name ?? 'Unknown'}
                        </p>
                        {!c.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-concrete">{c.email}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary-200 bg-primary-50/50 px-4 py-10 text-center">
              <Mail className="mb-2 h-8 w-8 text-primary-200" />
              <p className="font-display text-sm font-semibold text-primary-900">No messages yet</p>
            </div>
          )}
        </section>
      </div>

      <p className="text-[11px] text-concrete-light">
        {t('admin.dashboard.footerNote')}
      </p>
    </div>
  )
}
