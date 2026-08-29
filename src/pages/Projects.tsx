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
import { projectImages } from '../data/images'
import {
  projects,
  projectCategories,
  getProjectBySlug,
  type ProjectCategory,
} from '../data/projects'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

/* ============================================================================
   /projects — the OBM projects portfolio.
   Hero → filters → featured banner → asymmetric gallery → filtered grid.
   ========================================================================== */

const featuredSet = projects.slice(0, 4)
const featuredBanner = projects.find((p) => p.featured) ?? projects[0]

type Filter = 'All' | ProjectCategory

const FILTERS: (Filter | 'All')[] = ['All', ...projectCategories]

function FeaturedBanner({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug)!
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative block overflow-hidden bg-primary-900"
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        <img
          src={projectImages[project.slug]}
          alt={`${project.title} — ${project.category} project`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/35 to-primary-950/20" />

      <Container className="relative flex min-h-[480px] flex-col justify-end py-12 md:min-h-[560px] md:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
          Featured Project
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
          <span className="flex h-14 w-14 items-center justify-center border border-white/25 bg-white/10 text-white backdrop-blur transition-colors duration-300 group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-primary-950">
            <ArrowUpRight size={24} strokeWidth={1.5} />
          </span>
        </div>
      </Container>
    </Link>
  )
}

export default function Projects() {
  useDocumentMeta({
    title: 'Projects | OBM Construction S.C.',
    description:
      'Explore commercial, residential, mixed-use and infrastructure projects delivered by OBM Construction across Ethiopia.',
  })

  const [filter, setFilter] = useState<Filter>('All')

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="A portfolio built on quality."
        description="Explore commercial, residential and infrastructure projects delivered by the OBM team with engineering excellence and integrity."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Projects' }]}
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
                {f}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured banner */}
      {filter === 'All' && (
        <Section as="section" padding="none" className="bg-background">
          <FeaturedBanner slug={featuredBanner.slug} />
        </Section>
      )}

      {/* Asymmetric gallery (featured set) */}
      <Section as="section" padding="lg" className="bg-background">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
                <span className="inline-block h-px w-8 bg-current" />
                Selected Work
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
                Recent projects
              </h2>
            </div>
          </div>

          <div className="mt-12 grid grid-flow-dense grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ProjectCard project={featuredSet[0]} aspect="aspect-[3/4] lg:aspect-[4/5]" />
            </div>
            <div className="lg:col-span-7">
              <ProjectCard project={featuredSet[1]} aspect="aspect-[4/3] lg:aspect-[16/10]" />
            </div>
            <div className="lg:col-span-4">
              <ProjectCard project={featuredSet[2]} aspect="aspect-[4/3]" />
            </div>
            <div className="lg:col-span-8">
              <ProjectCard project={featuredSet[3]} aspect="aspect-[16/9] lg:aspect-[21/9]" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Filtered all-projects grid */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-white">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
              {filter === 'All' ? 'All projects' : `${filter} projects`}
            </h2>
            <AnimatePresence mode="wait">
              <motion.span
                key={filter}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-concrete"
              >
                Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-10">
            <ProjectGrid
              projects={filtered}
              animated
              aspect="aspect-[4/3]"
            />
          </div>

          <div className="mt-16 flex justify-center">
            <Button as="link" to="/contact" variant="primary" size="lg">
              Start Your Project
              <ArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
