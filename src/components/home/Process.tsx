import { motion } from 'framer-motion'
import { Container, Section } from '../ui/Container'

/* ============================================================================
   Process — the construction journey as a numbered timeline.
   Horizontal on desktop, vertical on mobile. Editorial, not cards.
   ========================================================================== */

const stages = [
  {
    label: 'Discover',
    text: 'We listen, assess feasibility, and define scope, budget and objectives.',
  },
  {
    label: 'Plan',
    text: 'Our engineers translate vision into a rigorous, buildable programme.',
  },
  {
    label: 'Build',
    text: 'On-site execution with strict safety, quality and schedule control.',
  },
  {
    label: 'Deliver',
    text: 'We complete, inspect and hand over a project ready for its purpose.',
  },
]

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Process() {
  return (
    <Section as="section" padding="xl" className="bg-white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              Our Process
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-950 sm:text-5xl">
              From vision
              <br />
              to reality.
            </h2>
          </div>
          <p className="max-w-sm text-concrete-dark md:text-right">
            A clear, controlled process that keeps every project on time, on
            budget and safe.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* horizontal connector (desktop) */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-primary-200 lg:block" />

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* node */}
                <div className="relative z-10 flex h-11 w-11 items-center justify-center border border-primary-200 bg-white font-display text-sm font-bold text-accent-500">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* vertical connector on mobile */}
                {i < stages.length - 1 && (
                  <div className="ml-[22px] mt-2 h-10 w-px bg-primary-200 lg:hidden" />
                )}

                <h3 className="mt-5 font-display text-2xl font-semibold uppercase tracking-tight text-primary-950">
                  {stage.label}
                </h3>
                <p className="mt-3 max-w-xs text-concrete-dark">{stage.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
