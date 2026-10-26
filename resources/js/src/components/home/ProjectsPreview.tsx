import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { ProjectCard } from '../projects/ProjectCard'
import { useProjects } from '../../lib/projectsStore'
import { useTranslation } from '../../i18n'

/* ============================================================================
   ProjectsPreview — asymmetric photo mosaic on white bg.

   Color rules on bg-surface (white):
     eyebrow  text-accent-500   (slightly deeper gold — reads better on white)
     h2       text-primary-950  (near-black — maximum weight on white)
     caption  text-concrete     (neutral gray — decorative, not content)
   ========================================================================== */

export default function ProjectsPreview() {
  const projects = useProjects()
  const p = projects.slice(0, 5)
  const { t } = useTranslation()

  if (p.length === 0) return null

  return (
    <Section as="section" padding="xl" className="bg-surface">
      <Container>

        {/* Header */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
              {t('projects.selectedWork')}
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-[0.98] tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {t('projects.selectedTitle')}
            </h2>
          </div>
          <div className="shrink-0">
            <Button
              as="link"
              to="/projects"
              variant="outline"
              className="group rounded-full border-primary-300 px-8 py-3 text-primary-950 transition-all duration-300 hover:border-primary-950 hover:bg-primary-950 hover:text-white"
            >
              {t('projects.allProjects')}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Asymmetric mosaic */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {p[0] && (
            <div className="sm:col-span-2 lg:col-span-7">
              <ProjectCard project={p[0]} aspect="aspect-[4/3] lg:aspect-[16/11]" />
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

        {/* Motto caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-12 flex items-center justify-center gap-5"
        >
          <span className="h-px w-14 bg-primary-200" aria-hidden="true" />
          {/* text-concrete: neutral, non-intrusive — it's decorative brand copy */}
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-concrete">
            {t('brand.motto')}
          </p>
          <span className="h-px w-14 bg-primary-200" aria-hidden="true" />
        </motion.div>
      </Container>
    </Section>
  )
}
