import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
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
} from '../lib/projectsStore'
import { cn } from '../lib/cn'
import type { ProjectCategory } from '../data/projects'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

/* ============================================================================
   /projects — the OBM projects portfolio.
   ========================================================================== */

type Filter = 'All' | ProjectCategory

const FILTERS: (Filter | 'All')[] = ['All', ...projectCategories]

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
  const featuredSet = projects.slice(0, 4)
  const featuredBanner = projects.find((p) => p.featured) ?? projects[0]

  const [filter, setFilter] = useState<Filter>('All')

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      <PageHero
        eyebrow={t('projects.heroEyebrow')}
        title={t('projects.heroTitle')}
        description={t('projects.heroDescription')}
        breadcrumb={[{ label: t('projects.breadcrumbHome'), to: '/' }, { label: t('projects.breadcrumbProjects') }]}
      />

      {/* Filters */}
      <Section as="section" padding="none" className="bg-background">
        <Container className="py-8 md:py-10">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'px-5 py-2.5 font-display text-sm font-medium transition-all duration-300',
                  filter === f
                    ? 'bg-primary-900 text-white'
                    : 'border border-primary-200 bg-transparent text-concrete-dark hover:border-primary-900 hover:text-primary-950',
                )}
              >
                {f === 'All' ? t('projects.allProjects') : f}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured banner */}
      {filter === 'All' && featuredBanner && (
        <Section as="section" padding="none" className="bg-background">
          <FeaturedBanner slug={featuredBanner.slug} />
        </Section>
      )}

      {/* Asymmetric gallery (featured set) */}
      {featuredSet.length > 0 && (
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
            {featuredSet[0] && (
            <div className="lg:col-span-5">
              <ProjectCard project={featuredSet[0]} aspect="aspect-[3/4] lg:aspect-[4/5]" />
            </div>
            )}
            {featuredSet[1] && (
            <div className="lg:col-span-7">
              <ProjectCard project={featuredSet[1]} aspect="aspect-[4/3] lg:aspect-[16/10]" />
            </div>
            )}
            {featuredSet[2] && (
            <div className="lg:col-span-4">
              <ProjectCard project={featuredSet[2]} aspect="aspect-[4/3]" />
            </div>
            )}
            {featuredSet[3] && (
            <div className="lg:col-span-8">
              <ProjectCard project={featuredSet[3]} aspect="aspect-[16/9] lg:aspect-[21/9]" />
            </div>
            )}
          </div>
        </Container>
      </Section>
      )}

      {/* Filtered all-projects grid */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-surface">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
              {filter === 'All' ? t('projects.allProjects') : `${filter} ${t('projects.allProjects')}`}
            </h2>
            <AnimatePresence mode="wait">
              <motion.span
                key={filter}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-concrete"
              >
                {filtered.length === 1
                  ? t('projects.showingCount', { count: filtered.length })
                  : t('projects.showingCountPlural', { count: filtered.length })}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-8">
            <ProjectGrid
              projects={filtered}
              animated
              aspect="aspect-[4/3]"
            />
          </div>

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
