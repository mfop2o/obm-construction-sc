import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { ProjectCard } from '../projects/ProjectCard'
import { useProjects } from '../../lib/projectsStore'
import { useTranslation } from '../../i18n'

/* ============================================================================
   ProjectsPreview — strong asymmetric photo gallery on the homepage.
   ========================================================================== */

export default function ProjectsPreview() {
  const projects = useProjects()
  const p = projects.slice(0, 5)
  const { t } = useTranslation()

  if (p.length === 0) {
    return null
  }

  return (
    <Section as="section" padding="xl" className="bg-surface">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              {t('projects.selectedWork')}
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-950 sm:text-5xl">
              {t('projects.selectedTitle')}
            </h2>
          </div>
          <div className="shrink-0">
            <Button as="link" to="/projects" variant="outline">
              {t('projects.allProjects')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* asymmetric editorial mosaic */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {p[0] && (
            <div className="sm:col-span-2 lg:col-span-7">
              <ProjectCard
                project={p[0]}
                aspect="aspect-[4/3] lg:aspect-[16/11]"
              />
            </div>
          )}
          {p[1] && (
            <div className="lg:col-span-5">
              <ProjectCard project={p[1]} aspect="aspect-[16/11]" />
            </div>
          )}
          {p[2] && (
            <div className="lg:col-span-4">
              <ProjectCard project={p[2]} aspect="aspect-[4/3]" />
            </div>
          )}
          {p[3] && (
            <div className="lg:col-span-4">
              <ProjectCard project={p[3]} aspect="aspect-[4/3]" />
            </div>
          )}
          {p[4] && (
            <div className="lg:col-span-4">
              <ProjectCard project={p[4]} aspect="aspect-[4/3]" />
            </div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 block text-center font-display text-xs uppercase tracking-[0.35em] text-concrete"
        >
          OBM Construction — {t('brand.tagline')}
        </motion.p>
      </Container>
    </Section>
  )
}
