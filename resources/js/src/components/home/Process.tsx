import { motion } from 'framer-motion'
import { Container, Section } from '../ui/Container'
import { useTranslation } from '../../i18n'

/* ============================================================================
   Process — the construction journey as a numbered timeline.
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Process() {
  const { t } = useTranslation()
  const stages = [
    { label: t('services.approach1'), text: t('services.heroDescription') },
    { label: t('services.approach2'), text: t('services.approach3') },
    { label: t('services.approach3'), text: t('services.approach4') },
    { label: t('services.approach4'), text: t('careers.heroDescription') },
  ]

  return (
    <Section as="section" padding="xl" className="bg-surface">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
              <span className="inline-block h-px w-8 bg-current" />
              {t('services.approachLabel')}
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-950 sm:text-5xl">
              {t('services.approachTitle')}
            </h2>
          </div>
          <p className="max-w-sm text-concrete-dark md:text-right">
            {t('services.heroDescription')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-12">
          {/* horizontal connector (desktop) */}
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-primary-200 lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* node */}
                <div className="relative z-10 flex h-11 w-11 items-center justify-center border border-primary-200 bg-surface font-display text-sm font-bold text-accent-500">
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
