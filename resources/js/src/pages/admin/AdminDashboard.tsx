import { Link } from 'react-router-dom'
import { projectCategories, useProjects, getProjectImage } from '../../lib/projectsStore'
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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ============================================================================
   AdminDashboard — overview of the dynamic content system.
   ========================================================================== */

interface StatCard {
  label: string
  value: number
  to: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
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

export default function AdminDashboard() {
  const projects = useProjects()
  const testimonials = useTestimonials()
  const services = useServices()
  const careers = useCareersData()
  const stats = useHomeStats()
  const about = useAboutData()
  const contacts = useContacts()
  const contentReady = useContentReady()
  const contactsReady = useContactsReady()
  const ready = contentReady && contactsReady
  const { t } = useTranslation()

  const unreadContacts = contacts.filter((c) => !c.read).length
  const featured = projects.filter((p) => p.featured)
  const maxCategoryCount = Math.max(
    ...projectCategories.map((c) => projects.filter((p) => p.category === c).length),
    1,
  )

  const statCards: StatCard[] = [
    { label: t('admin.dashboard.projects'), value: projects.length, to: '/admin/projects', icon: Briefcase, iconBg: 'bg-accent-50', iconColor: 'text-accent-600' },
    { label: t('admin.dashboard.services'), value: services.length, to: '/admin/services', icon: Wrench, iconBg: 'bg-accent-50', iconColor: 'text-accent-600' },
    { label: t('admin.dashboard.testimonials'), value: testimonials.length, to: '/admin/testimonials', icon: Quote, iconBg: 'bg-primary-100', iconColor: 'text-primary-700' },
    { label: t('admin.dashboard.openings'), value: careers.openings.length, to: '/admin/careers', icon: BriefcaseBusiness, iconBg: 'bg-accent-50', iconColor: 'text-accent-600' },
    { label: t('admin.dashboard.homeStats'), value: stats.length, to: '/admin/home-stats', icon: BarChart3, iconBg: 'bg-primary-100', iconColor: 'text-primary-700' },
    { label: t('admin.dashboard.milestones'), value: about.milestones.length, to: '/admin/about', icon: Trophy, iconBg: 'bg-accent-50', iconColor: 'text-accent-600' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.dashboard.description')}
          </p>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              to={s.to}
              className="admin-stat group flex items-start justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-concrete-dark">{s.label}</p>
                <p className="font-display text-3xl font-bold text-primary-950">
                  {s.value}
                </p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
            </Link>
          )
        })}

        {/* Unread messages - highlighted */}
        <Link
          to="/admin/contacts"
          className="admin-stat group flex items-start justify-between"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-concrete-dark">{t('admin.dashboard.unreadMessages')}</p>
            <p className="font-display text-3xl font-bold text-primary-950">
              {unreadContacts}
            </p>
            {unreadContacts > 0 && (
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent-600">
                <TrendingUp className="h-3 w-3" />
                New messages
              </span>
            )}
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 transition-transform duration-200 group-hover:scale-110">
            <Mail className="h-5 w-5 text-accent-600" />
          </div>
        </Link>
      </div>

      {/* Quick actions */}
      <section className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-concrete">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-medium text-primary-900 transition-all hover:border-accent-400 hover:bg-accent-400/5 hover:shadow-sm"
          >
            <FolderOpen className="h-4 w-4 text-accent-500" />
            New Project
            <ArrowUpRight className="h-3.5 w-3.5 text-concrete" />
          </Link>
          <Link
            to="/admin/contacts"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-medium text-primary-900 transition-all hover:border-accent-400 hover:bg-accent-400/5 hover:shadow-sm"
          >
            <Mail className="h-4 w-4 text-accent-500" />
            View Messages
            {unreadContacts > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                {unreadContacts}
              </span>
            )}
          </Link>
          <Link
            to="/admin/testimonials"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-medium text-primary-900 transition-all hover:border-accent-400 hover:bg-accent-400/5 hover:shadow-sm"
          >
            <Star className="h-4 w-4 text-accent-500" />
            Add Testimonial
          </Link>
          <Link
            to="/admin/careers"
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2.5 text-sm font-medium text-primary-900 transition-all hover:border-accent-400 hover:bg-accent-400/5 hover:shadow-sm"
          >
            <Users className="h-4 w-4 text-accent-500" />
            Manage Careers
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By category */}
        <section className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-display text-base font-semibold text-primary-950">
            {t('admin.dashboard.projectsByCategory')}
          </h2>
          <ul className="flex flex-col gap-4">
            {projectCategories.map((category, index) => {
              const count = projects.filter((p) => p.category === category).length
              const pct = Math.round((count / maxCategoryCount) * 100)
              return (
                <li key={category}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${categoryColors[index % categoryColors.length]}`} />
                      <span className="font-medium text-primary-900">{category}</span>
                    </div>
                    <span className="text-xs font-semibold text-concrete">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className={`h-full rounded-full ${categoryColors[index % categoryColors.length]} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Featured */}
        <section className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-primary-950">
              {t('admin.dashboard.featuredProject')}
            </h2>
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-500 hover:underline"
            >
              {t('admin.dashboard.viewAll')}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {featured.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-center gap-3 rounded-lg border border-primary-100 p-3 transition-colors hover:bg-primary-50/50"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary-100 bg-stone-100">
                    {getProjectImage(p) ? (
                      <img src={getProjectImage(p)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-900 text-xs font-bold text-white">
                        {p.title.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary-900">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs text-concrete">
                      {p.category} &middot; {p.status} &middot; {p.year}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-concrete transition-colors group-hover:text-accent-500" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary-200 bg-primary-50/30 px-4 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Briefcase className="h-5 w-5 text-concrete" />
              </div>
              <p className="text-sm font-medium text-primary-900">
                {t('admin.dashboard.noFeatured')}
              </p>
              <Link
                to="/admin/projects"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-500 hover:underline"
              >
                Set featured project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
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
