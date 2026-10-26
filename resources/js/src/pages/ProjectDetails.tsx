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
import { ProjectTimeline } from '../components/projects/ProjectTimeline'
import { ProjectDocuments } from '../components/projects/ProjectDocuments'
import {
  getProjectBySlug,
  getRelatedProjects,
  getProjectImage,
  projectStatusKey,
  useProjects,
} from '../lib/projectsStore'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'
import type { Project, ProjectStatus } from '../data/projects'

/* ============================================================================
   /projects/:slug — project detail page.
   Elects the project by slug and renders the contract facts, photography,
   history timeline and documents alongside the editorial narrative.
   ========================================================================== */

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const statusStyles: Record<ProjectStatus, string> = {
  Completed: 'bg-primary-500/15 text-primary-500',
  Ongoing: 'bg-accent-400/15 text-accent-300',
  Accepted: 'bg-emerald-500/15 text-emerald-300',
  Upcoming: 'bg-primary-500/15 text-primary-300',
  'Under Maintenance': 'bg-amber-500/15 text-amber-200',
  Suspended: 'bg-red-500/15 text-red-200',
}

export default function ProjectDetails() {
  const { t } = useTranslation()
  useProjects()
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
    { label: t('projectDetail.challenge'), body: project.challenge },
    { label: t('projectDetail.approach'), body: project.approach },
    { label: t('projectDetail.result'), body: project.result },
  ]
  const facts = contractFacts(project, t)

  return (
    <>
      {/* ---- Project hero ---- */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <motion.img
          src={getProjectImage(project)}
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
            aria-label={t('projectDetail.breadcrumbLabel')}
          >
            <Link to="/" className="transition-colors hover:text-white">
              {t('projectDetail.breadcrumbHome')}
            </Link>
            <span className="text-primary-500">/</span>
            <Link to="/projects" className="transition-colors hover:text-white">
              {t('projectDetail.breadcrumbProjects')}
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
            {project.region && <span>{project.region}</span>}
            <span>{project.year}</span>
            <span className={cnStatus(project.status)}>
              {t(`projects.status.${statusKey(project.status)}`)}
            </span>
            {project.client && (
              <span className="text-primary-300">
                {t('projectDetail.clientLabel')}: {project.client}
              </span>
            )}
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10"
          >
            <Button as="link" to="/contact" variant="accent">
              {t('projectDetail.startSimilar')}
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

      {/* ---- Progress, for projects that are still being reported on ---- */}
      {(project.status === 'Ongoing' || project.status === 'Upcoming') &&
        ((project.physical_progress ?? 0) > 0 || (project.financial_progress ?? 0) > 0) && (
          <Section as="section" padding="md" className="bg-background">
            <Container>
              <div className="grid gap-8 md:grid-cols-2">
                <ProgressBar
                  label={t('projectDetail.physicalProgress')}
                  value={project.physical_progress ?? 0}
                />
                <ProgressBar
                  label={t('projectDetail.financialProgress')}
                  value={project.financial_progress ?? 0}
                />
              </div>
            </Container>
          </Section>
        )}

      {/* ---- Contract facts ---- */}
      {facts.length > 0 && (
        <Section as="section" padding="md" className="border-y border-primary-200 bg-surface">
          <Container>
            <p className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              {t('projectDetail.contractFacts')}
            </p>
            <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {facts.map((fact) => (
                <motion.div
                  key={fact.label}
                  variants={fade}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex flex-col gap-1"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.2em] text-concrete">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-lg font-semibold text-primary-950">
                    {fact.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </Container>
        </Section>
      )}

      {/* ---- Key facts & scope ---- */}
      <Section as="section" padding="md" className={facts.length > 0 ? 'bg-background' : 'border-y border-primary-200 bg-surface'}>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
            <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:gap-6">
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
      <Section as="section" padding="lg" className="bg-surface">
        <Container>
          <div className="space-y-12 md:space-y-14">
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
            {t('projectDetail.gallery')}
          </p>
          <ProjectGallery project={project} />
        </Container>
      </Section>

      {/* ---- Project history timeline ---- */}
      {project.history.length > 0 && (
        <Section as="section" padding="lg" className="border-t border-primary-200 bg-surface">
          <Container>
            <p className="mb-10 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              {t('projectDetail.history')}
            </p>
            <ProjectTimeline project={project} />
          </Container>
        </Section>
      )}

      {/* ---- Documents ---- */}
      {project.documents.length > 0 && (
        <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
          <Container>
            <p className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              {t('projectDetail.documents')}
            </p>
            <ProjectDocuments project={project} />
          </Container>
        </Section>
      )}

      {/* ---- Related projects ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
              {t('projectDetail.relatedProjects')}
            </h2>
            <Button as="link" to="/projects" variant="link">
              {t('projectDetail.viewAllProjects')}
              <ArrowRight size={18} />
            </Button>
          </div>
          <div className="mt-8">
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
                {t('projectDetail.nextStep')}
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t('projectDetail.ctaTitle')}
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button as="link" to="/contact" variant="accent" size="lg">
                {t('projectDetail.getQuote')}
                <ArrowRight size={18} />
              </Button>
              <Button
                as="link"
                to="/services"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-surface hover:text-primary-950"
              >
                {t('projectDetail.ourServices')}
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
            {t('projectDetail.backToProjects')}
          </Link>
        </Container>
      </Section>
    </>
  )
}

function cnStatus(status: ProjectStatus): string {
  const base =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium'
  return `${base} ${statusStyles[status]}`
}

/** Turn a status value into a translation key fragment: "Under Maintenance" -> "maintenance". */
function statusKey(status: ProjectStatus): string {
  return projectStatusKey(status)
}

/** Group thousands so contract values read as written amounts. */
function formatAmount(value: number, currency?: string): string {
  const amount = new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 0,
  }).format(value)
  return currency ? `${currency} ${amount}` : amount
}

/**
 * The contractual and programme facts an administrator maintains, skipping any
 * that have not been recorded so the section never renders empty placeholders.
 */
function contractFacts(
  project: Project,
  t: (key: string) => string,
): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = []

  if (project.contract_amount) {
    facts.push({
      label: t('projectDetail.contractAmount'),
      value: formatAmount(project.contract_amount, project.currency),
    })
  }
  if (project.consultant) {
    facts.push({ label: t('projectDetail.consultant'), value: project.consultant })
  }
  if (project.contractor) {
    facts.push({ label: t('projectDetail.contractor'), value: project.contractor })
  }
  if (project.contract_date) {
    facts.push({ label: t('projectDetail.contractDate'), value: project.contract_date })
  }
  if (project.start_date) {
    facts.push({ label: t('projectDetail.startDate'), value: project.start_date })
  }
  if (project.completion_date) {
    facts.push({ label: t('projectDetail.completionDate'), value: project.completion_date })
  }
  if (project.acceptance_date) {
    facts.push({ label: t('projectDetail.acceptanceDate'), value: project.acceptance_date })
  }

  return facts
}

/** A labelled progress bar, clamped to 0-100 so bad data cannot overflow the track. */
function ProgressBar({ label, value }: { label: string; value: number }) {
  const percent = Math.min(100, Math.max(0, value))

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-concrete">
          {label}
        </span>
        <span className="font-display text-lg font-semibold text-primary-950">
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-2 w-full bg-primary-200"
      >
        <div className="h-full bg-accent-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
