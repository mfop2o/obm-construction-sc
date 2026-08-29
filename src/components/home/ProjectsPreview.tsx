import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { ProjectCard } from '../projects/ProjectCard'
import { projects } from '../../data/projects'

/* ============================================================================
   ProjectsPreview — strong asymmetric photo gallery on the homepage.
   One large featured project plus smaller supporting projects in varied
   aspect ratios. Photography-led, minimal text.
   ========================================================================== */

const p = projects

export default function ProjectsPreview() {
  return (
    <Section as="section" padding="xl" className="bg-white">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              Selected Work
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-950 sm:text-5xl">
              Projects that
              <br />
              define the standard.
            </h2>
          </div>
          <div className="shrink-0">
            <Button as="link" to="/projects" variant="outline">
              View All Projects
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* asymmetric editorial mosaic */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* large featured */}
          <div className="sm:col-span-2 lg:col-span-7">
            <ProjectCard
              project={p[0]}
              aspect="aspect-[4/3] lg:aspect-[16/11]"
            />
          </div>
          {/* supporting wide */}
          <div className="lg:col-span-5">
            <ProjectCard project={p[1]} aspect="aspect-[16/11]" />
          </div>
          {/* trio of standard */}
          <div className="lg:col-span-4">
            <ProjectCard project={p[2]} aspect="aspect-[4/3]" />
          </div>
          <div className="lg:col-span-4">
            <ProjectCard project={p[3]} aspect="aspect-[4/3]" />
          </div>
          <div className="lg:col-span-4">
            <ProjectCard project={p[4]} aspect="aspect-[4/3]" />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-14 block text-center font-display text-xs uppercase tracking-[0.35em] text-concrete"
        >
          OBM Construction — Building what matters
        </motion.p>
      </Container>
    </Section>
  )
}
