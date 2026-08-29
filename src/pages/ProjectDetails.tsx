import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import {
  Container,
  Section,
} from '../components/ui/Container'
import Button from '../components/ui/Button'
import { ProjectGrid } from '../components/projects/ProjectGrid'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import {
  getProjectBySlug,
  getRelatedProjects,
} from '../data/projects'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { projectImages } from '../data/images'

/* ============================================================================
   /projects/:slug — project detail page.
   Elects the project by slug and renders full editorial detail.
   ========================================================================== */

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const statusStyles: Record<string, string> = {
  Completed: 'bg-emerald-500/10 text-emerald-300',
  'In Progress': 'bg-accent-400/15 text-accent-300',
  Upcoming: 'bg-primary-500/15 text-primary-300',
}

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  useDocumentMeta({
    title: project
      ? `${project.title} | OBM Construction S.C.`
      : 'Project | OBM Construction S.C.',
    description: project?.description,
    ogTitle: project?.title,
  })

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const related = getRelatedProjects(project)
  const narrative = [
    { label: 'The Challenge', body: project.challenge },
    { label: 'Our Approach', body: project.approach },
    { label: 'The Result', body: project.result },
  ]

  return (
    <>
      {/* ---- Project hero ---- */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <motion.img
          src={projectImages[project.slug]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-primary-950/40" />
        <Container className="relative pt-16 pb-16 md:pt-24 md:pb-24">
          <motion.nav
            variants={fade}
            initial="hidden"
            animate="show"
            className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-primary-300"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-primary-500">/</span>
            <Link to="/projects" className="transition-colors hover:text-white">
              Projects
            </Link>
            <span className="text-primary-500">/</span>
            <span className="text-white">{project.title}</span>
          </motion.nav>

          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400"
          >
            <span className="inline-block h-px w-8 bg-accent-400" />
            {project.category}
          </motion.p>

          <motion.h1
            variants={fade}
            initial="hidden"
            animate="show"
            className="max-w-4xl font-display text-4xl font-bold tracking-tight md:text-6xl"
          >
            {project.title}
          </motion.h1>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-primary-300"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-accent-400" />
              {project.location}
            </span>
            <span>{project.year}</span>
            <span
              className={cnStatus(project.status)}
            >
              {project.status}
            </span>
            <span className="text-primary-300">Client: {project.client}</span>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10"
          >
            <Button as="link" to="/contact" variant="accent">
              Start a Similar Project
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* ---- Intro / overview ---- */}
      <Section as="section" padding="lg" className="bg-background">
        <Container>
          <motion.p
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight text-primary-950 md:text-3xl"
          >
            {project.overview}
          </motion.p>
        </Container>
      </Section>

      {/* ---- Facts & scope ---- */}
      <Section as="section" padding="md" className="border-y border-primary-200 bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
            <dl className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 lg:gap-6">
              {project.scope.map((fact) => (
                <motion.div
                  key={fact.key}
                  variants={fade}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex flex-col gap-1"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.2em] text-concrete">
                    {fact.key}
                  </dt>
                  <dd className="font-display text-lg font-semibold text-primary-950">
                    {fact.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* ---- Narrative ---- */}
      <Section as="section" padding="lg" className="bg-white">
        <Container>
          <div className="space-y-16 md:space-y-20">
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <h2 className="font-display text-2xl font-bold tracking-tight text-primary-950">
                {project.description}
              </h2>
            </div>

            {narrative.map((block, i) => (
              <motion.div
                key={block.label}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="grid gap-6 md:grid-cols-[220px_1fr]"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight text-primary-950">
                  <span className="mr-3 text-accent-500">{i + 1}.</span>
                  {block.label}
                </h3>
                <p className="max-w-2xl text-lg leading-relaxed text-concrete-dark">
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- Gallery ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <p className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
            <span className="inline-block h-px w-8 bg-current" />
            Gallery
          </p>
          <ProjectGallery project={project} />
        </Container>
      </Section>

      {/* ---- Related projects ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
              Related projects
            </h2>
            <Button as="link" to="/projects" variant="link">
              View all projects
              <ArrowRight size={18} />
            </Button>
          </div>
          <div className="mt-10">
            <ProjectGrid
              projects={related}
              animated
              columns={3}
              aspect="aspect-[4/3]"
            />
          </div>
        </Container>
      </Section>

      {/* ---- CTA ---- */}
      <Section as="section" padding="lg" className="bg-primary-900 text-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
                <span className="inline-block h-px w-8 bg-accent-400" />
                Next Step
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
                Have a project like this in mind?
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button as="link" to="/contact" variant="accent" size="lg">
                Get a Quote
                <ArrowRight size={18} />
              </Button>
              <Button
                as="link"
                to="/services"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-primary-950"
              >
                Our Services
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Back link */}
      <Section as="section" padding="sm" className="bg-background">
        <Container>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-concrete-dark transition-colors hover:text-primary-950"
          >
            <ArrowLeft size={16} />
            Back to all projects
          </Link>
        </Container>
      </Section>
    </>
  )
}

function cnStatus(status: string): string {
  const base =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium'
  const color = statusStyles[status] ?? statusStyles.Completed
  return `${base} ${color}`
}
