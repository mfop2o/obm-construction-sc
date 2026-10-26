import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Container,
  Section,
} from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectGrid } from '../components/projects/ProjectGrid'
import {
  useProjects,
  getProjectBySlug,
  getProjectImage,
  projectCategories,
  projectStatuses,
  projectGroups,
  projectStatusKey,
  refreshProjects,
  type ProjectGroup,
  type ProjectQuery,
} from '../lib/projectsStore'
import type { ProjectStatus } from '../data/projects'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

/* ============================================================================
   /projects — the OBM projects portfolio.

   Search, filters and the automatic categories are resolved by the Laravel API,
   so the public page and the admin panel share one derivation of the categories.
   Selecting a filter or category reloads the in-memory store from the API.
   ========================================================================== */

/** The filter state the visitor has chosen. An empty string means "any". */
type Filters = Record<keyof ProjectQuery, string>

const EMPTY_FILTERS: Filters = {
  search: '',
  group: '',
  status: '',
  region: '',
  year: '',
  category: '',
}

function FeaturedBanner({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug)
  const { t } = useTranslation()
  if (!project) return null
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative block overflow-hidden bg-primary-900"
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        <img
          src={getProjectImage(project)}
          alt={`${project.title} — ${project.category} project`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/35 to-primary-950/20" />

      <Container className="relative flex min-h-[480px] flex-col justify-end py-12 md:min-h-[560px] md:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
          {t('projects.featuredLabel')}
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl text-base text-primary-200">
              {project.overview}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary-200">
              <span>{project.category}</span>
              <span>{project.location}</span>
              <span>{project.year}</span>
              <span className="text-accent-300">{project.status}</span>
            </div>
          </div>
          <span className="flex h-14 w-14 items-center justify-center border border-white/25 bg-surface/10 text-white backdrop-blur transition-colors duration-300 group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-primary-950">
            <ArrowUpRight size={24} strokeWidth={1.5} />
          </span>
        </div>
      </Container>
    </Link>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('projects.title'),
    description: t('projects.description'),
  })

  const projects = useProjects()

  // The text the visitor has typed, which is only applied when they submit.
  const [draft, setDraft] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  /** Regions and years actually present, so a facet never offers a dead end. */
  const { regions, years } = useMemo(() => {
    const regionSet = new Set<string>()
    const yearSet = new Set<string>()
    projects.forEach((p) => {
      if (p.region) regionSet.add(p.region)
      if (p.year) yearSet.add(p.year)
    })
    return {
      regions: [...regionSet].sort(),
      years: [...yearSet].sort((a, b) => b.localeCompare(a)),
    }
  }, [projects])

  const activeCount = Object.values(filters).filter(Boolean).length

  /** Convert the filter state into the API query, dropping empty values. */
  function toQuery(state: Filters): ProjectQuery {
    return {
      search: state.search || undefined,
      group: (state.group || undefined) as ProjectGroup | undefined,
      status: (state.status || undefined) as ProjectStatus | undefined,
      region: state.region || undefined,
      year: state.year || undefined,
      category: state.category || undefined,
    }
  }

  /** Apply the whole filter state at once and reload the store. */
  function apply(state: Filters) {
    setFilters(state)
    void refreshProjects(toQuery(state))
  }

  /** Set a single filter and reload immediately. */
  function setFilter(key: keyof Filters, value: string) {
    apply({ ...filters, [key]: value })
  }

  /** Clear every filter and reload the full portfolio. */
  function reset() {
    setDraft('')
    apply(EMPTY_FILTERS)
  }

  const featuredBanner = projects.find((p) => p.featured) ?? projects[0]
  const showFeatured = activeCount === 0 && Boolean(featuredBanner)

  return (
    <>
      <PageHero
        eyebrow={t('projects.heroEyebrow')}
        title={t('projects.heroTitle')}
        description={t('projects.heroDescription')}
        breadcrumb={[{ label: t('projects.breadcrumbHome'), to: '/' }, { label: t('projects.breadcrumbProjects') }]}
      />

      {/* Search, automatic categories and facets */}
      <Section as="section" padding="none" className="bg-background">
        <Container className="py-8 md:py-10">
          <div className="flex flex-col gap-6">
            <form
              role="search"
              aria-label={t('projects.searchLabel')}
              onSubmit={(e) => {
                e.preventDefault()
                setFilter('search', draft.trim())
              }}
              className="flex flex-col gap-4 md:flex-row md:items-center"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-concrete"
                />
                <input
                  type="search"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t('projects.searchPlaceholder')}
                  aria-label={t('projects.searchLabel')}
                  className="w-full border border-primary-200 bg-transparent py-3 pl-12 pr-4 text-sm text-primary-950 placeholder:text-concrete focus:border-primary-900 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  {t('projects.searchAction')}
                </Button>
                {activeCount > 0 && (
                  <Button type="button" variant="ghost" onClick={reset}>
                    <X size={16} />
                    {t('projects.clearFilters')}
                  </Button>
                )}
              </div>
            </form>

            {/* Automatic categories, each derived on the server */}
            <div className="flex flex-wrap gap-2">
              {projectGroups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFilter('group', filters.group === g ? '' : g)}
                  aria-pressed={filters.group === g}
                  className={cn(
                    'px-5 py-2.5 font-display text-sm font-medium transition-all duration-300',
                    filters.group === g
                      ? 'bg-primary-900 text-white'
                      : 'border border-primary-200 bg-transparent text-concrete-dark hover:border-primary-900 hover:text-primary-950',
                  )}
                >
                  {t(`projects.groups.${g}`)}
                </button>
              ))}
            </div>

            {/* Facets */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FacetSelect
                label={t('projects.filterCategory')}
                anyLabel={t('projects.anyCategory')}
                value={filters.category}
                onChange={(value) => setFilter('category', value)}
                options={projectCategories.map((c) => ({ value: c, label: c }))}
              />
              <FacetSelect
                label={t('projects.filterStatus')}
                anyLabel={t('projects.anyStatus')}
                value={filters.status}
                onChange={(value) => setFilter('status', value)}
                options={projectStatuses.map((s) => ({
                  value: s,
                  label: t(`projects.status.${statusKey(s)}`),
                }))}
              />
              <FacetSelect
                label={t('projects.filterRegion')}
                anyLabel={t('projects.anyRegion')}
                value={filters.region}
                onChange={(value) => setFilter('region', value)}
                options={regions.map((r) => ({ value: r, label: r }))}
              />
              <FacetSelect
                label={t('projects.filterYear')}
                anyLabel={t('projects.anyYear')}
                value={filters.year}
                onChange={(value) => setFilter('year', value)}
                options={years.map((y) => ({ value: y, label: y }))}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured banner */}
      {showFeatured && featuredBanner && (
        <Section as="section" padding="none" className="bg-background">
          <FeaturedBanner slug={featuredBanner.slug} />
        </Section>
      )}

      {/* Asymmetric gallery (featured set) */}
      {activeCount === 0 && projects.length > 0 && (
      <Section as="section" padding="lg" className="bg-background">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
                <span className="inline-block h-px w-8 bg-current" />
                {t('projects.selectedWork')}
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
                {t('projects.selectedTitle')}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid grid-flow-dense grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {projects[0] && (
            <div className="lg:col-span-5">
              <ProjectCard project={projects[0]} aspect="aspect-[3/4] lg:aspect-[4/5]" />
            </div>
            )}
            {projects[1] && (
            <div className="lg:col-span-7">
              <ProjectCard project={projects[1]} aspect="aspect-[4/3] lg:aspect-[16/10]" />
            </div>
            )}
            {projects[2] && (
            <div className="lg:col-span-4">
              <ProjectCard project={projects[2]} aspect="aspect-[4/3]" />
            </div>
            )}
            {projects[3] && (
            <div className="lg:col-span-8">
              <ProjectCard project={projects[3]} aspect="aspect-[16/9] lg:aspect-[21/9]" />
            </div>
            )}
          </div>
        </Container>
      </Section>
      )}

      {/* Results grid */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-surface">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
              {activeCount > 0 ? t('projects.searchResults') : t('projects.allProjects')}
            </h2>
            <AnimatePresence mode="wait">
              <motion.span
                key={Object.values(filters).join('|')}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-concrete"
              >
                {projects.length === 1
                  ? t('projects.showingCount', { count: projects.length })
                  : t('projects.showingCountPlural', { count: projects.length })}
              </motion.span>
            </AnimatePresence>
          </div>

          {projects.length === 0 ? (
            <div className="mt-12 border border-dashed border-primary-200 px-6 py-16 text-center">
              <p className="font-display text-xl text-primary-950">{t('projects.noResults')}</p>
              <p className="mt-2 text-sm text-concrete">{t('projects.noResultsHint')}</p>
              <Button type="button" variant="link" className="mt-6" onClick={reset}>
                {t('projects.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <ProjectGrid
                projects={projects}
                animated
                aspect="aspect-[4/3]"
              />
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Button as="link" to="/contact" variant="primary" size="lg">
              {t('projects.startProject')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

interface FacetOption {
  value: string
  label: string
}

function FacetSelect({
  label,
  anyLabel,
  value,
  options,
  onChange,
}: {
  label: string
  anyLabel: string
  value: string
  options: FacetOption[]
  onChange: (value: string) => void
}) {
  const id = `facet-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-concrete">
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-primary-200 bg-transparent px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-primary-950 focus:border-primary-900 focus:outline-none"
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/** Turn a status value into a translation key fragment: "Under Maintenance" -> "maintenance". */
function statusKey(status: string): string {
  return projectStatusKey(status as ProjectStatus)
}
