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

/* ============================================================================
   AdminDashboard — overview of the dynamic content system.
   ========================================================================== */

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

  const statCards = [
    { label: t('admin.dashboard.projects'), value: projects.length, to: '/admin/projects' },
    { label: t('admin.dashboard.services'), value: services.length, to: '/admin/services' },
    { label: t('admin.dashboard.testimonials'), value: testimonials.length, to: '/admin/testimonials' },
    { label: t('admin.dashboard.openings'), value: careers.openings.length, to: '/admin/careers' },
    { label: t('admin.dashboard.homeStats'), value: stats.length, to: '/admin/home-stats' },
    { label: t('admin.dashboard.milestones'), value: about.milestones.length, to: '/admin/about' },
  ]

  return (
    <div className="flex flex-col gap-8">
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
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="admin-stat group"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-concrete">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary-950 transition-colors group-hover:text-accent-600">
              {s.value}
            </p>
            <svg className="absolute right-4 top-5 h-5 w-5 text-primary-200 transition-colors group-hover:text-accent-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        ))}

        <Link
          to="/admin/contacts"
          className="admin-stat group"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-concrete">{t('admin.dashboard.unreadMessages')}</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent-500 transition-colors group-hover:text-accent-600">
            {unreadContacts}
          </p>
          <svg className="absolute right-4 top-5 h-5 w-5 text-primary-200 transition-colors group-hover:text-accent-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By category */}
        <section className="admin-card-flat p-6">
          <h2 className="mb-5 font-display text-base font-semibold text-primary-950">
            {t('admin.dashboard.projectsByCategory')}
          </h2>
          <ul className="flex flex-col gap-3">
            {projectCategories.map((category) => {
              const count = projects.filter((p) => p.category === category).length
              const pct = Math.round((count / maxCategoryCount) * 100)
              return (
                <li key={category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-primary-900">{category}</span>
                    <span className="text-xs font-semibold text-concrete">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className="h-full rounded-full bg-accent-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Featured */}
        <section className="admin-card-flat p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-primary-950">
              {t('admin.dashboard.featuredProject')}
            </h2>
            <Link
              to="/admin/projects"
              className="text-xs font-medium text-accent-600 hover:text-accent-500 hover:underline"
            >
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          {featured.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {featured.map((p) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-primary-100 bg-stone-100">
                    {getProjectImage(p) ? (
                      <img src={getProjectImage(p)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-900 text-[10px] font-bold text-white">
                        {p.title.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary-900">{p.title}</p>
                    <p className="truncate text-xs text-concrete">{p.category} &middot; {p.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed border-primary-200 bg-primary-50/50 px-4 py-6 text-center">
              <p className="text-sm text-concrete">
                {t('admin.dashboard.noFeatured')}
              </p>
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
