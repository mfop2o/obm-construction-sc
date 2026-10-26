import { motion } from 'framer-motion'
import { ClipboardList, PenTool, HardHat, BadgeCheck } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import { useTranslation } from '../../i18n'

/* ============================================================================
   Process — numbered timeline on white background.

   Color rules on bg-surface (white):
     eyebrow   text-accent-500   font-bold uppercase tracking-[0.32em]
     h2        text-primary-950  font-bold uppercase leading-[0.95]
     sub-copy  text-concrete-dark  (right-aligned descriptor)
     step #    text-primary-950  (small badge on accent-400 bg — dark on gold)
     step title text-primary-950 → text-accent-600 on hover (deep gold, not too bright)
     step body  text-concrete-dark  (same as all light-bg body copy)
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stageIcons = [ClipboardList, PenTool, HardHat, BadgeCheck]

export default function Process() {
  const { t } = useTranslation()
  const stages = [
    {
      label: 'Consultation & Feasibility',
      text: 'Comprehensive site assessment, geotechnical surveys, and value-engineering feasibility studies to establish firm project scope.',
    },
    {
      label: 'Pre-Construction & Design',
      text: 'Rigorous architectural coordination, 3D structural engineering, CPM scheduling, and regulatory permit clearances.',
    },
    {
      label: 'Precision Execution & QA/QC',
      text: 'Disciplined on-site construction managed by certified resident engineers with daily inspection logs and strict safety protocols.',
    },
    {
      label: 'Commissioning & Handover',
      text: 'Full MEP systems testing, comprehensive punch-list certification, client handover, and long-term warranty support.',
    },
  ]

  return (
    <Section as="section" padding="xl" className="bg-surface">
      <Container>

        {/* Section header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
              {t('services.approachLabel')}
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-[0.98] tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {t('services.approachTitle')}
            </h2>
          </div>
          {/* Right descriptor */}
          <p className="max-w-md text-[15px] leading-relaxed text-concrete-dark md:text-right">
            From concept feasibility to key handover, our ISO-grade construction methodology ensures predictable schedules, cost control, and enduring structural quality.
          </p>
        </div>

        {/* Timeline grid */}
        <div className="relative mt-14">
          {/* Horizontal connector — primary-200 fades in/out at edges */}
          <div
            className="absolute left-0 right-0 top-6 hidden h-px lg:block"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-primary-200) 10%, var(--color-primary-200) 90%, transparent)',
            }}
            aria-hidden="true"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {stages.map((stage, i) => {
              const Icon = stageIcons[i]
              return (
                <motion.div
                  key={i}
                  variants={item}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.09 }}
                  className="group relative"
                >
                  {/* Icon node */}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary-200 bg-white shadow-sm transition-all duration-250 group-hover:border-accent-400 group-hover:shadow-[0_0_0_4px_rgba(217,154,43,0.1)]">
                    <Icon className="h-5 w-5 text-accent-500 transition-colors duration-200 group-hover:text-accent-400" />
                  </div>

                  {/* Step badge — primary-950 on accent-400: dark text on gold bg */}
                  <div className="absolute -top-1.5 left-8 flex h-5 w-5 items-center justify-center rounded-full bg-accent-400" aria-hidden="true">
                    <span className="font-display text-[9px] font-black text-primary-950">{i + 1}</span>
                  </div>

                  {/* Mobile vertical connector */}
                  {i < stages.length - 1 && (
                    <div className="ml-6 mt-3 h-8 w-px bg-primary-200 lg:hidden" aria-hidden="true" />
                  )}

                  {/* Step title — accent-600 on hover: deep gold, doesn't look broken */}
                  <h3 className="mt-7 font-display text-xl font-bold uppercase tracking-tight text-primary-950 transition-colors duration-200 group-hover:text-accent-600">
                    {stage.label}
                  </h3>
                  {/* Step body — concrete-dark: universal light-bg body rule */}
                  <p className="mt-3 text-[14px] leading-relaxed text-concrete-dark">
                    {stage.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
