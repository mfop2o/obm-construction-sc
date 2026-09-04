import { motion } from 'framer-motion'
import { Container, Section } from '../ui/Container'
import { useTranslation } from '../../i18n'

/* ============================================================================
   WhyOBM — dark premium editorial band.
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function WhyOBM() {
  const { t } = useTranslation()
  return (
    <Section as="section" padding="xl" className="bg-primary-950 text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400"
            >
              <span className="inline-block h-px w-8 bg-accent-400" />
              {t('careers.whyObmEyebrow')}
            </motion.p>
            <motion.h2
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t('careers.whyObmTitle')}
            </motion.h2>
            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 }}
              className="mt-7 max-w-md text-lg leading-relaxed text-primary-300"
            >
              {t('careers.whyObmDescription')}
            </motion.p>
          </div>

          {/* Editorial values list */}
          <div className="border-t border-primary-800">
            {[
              { titleKey: 'careers.whyObmTitle', textKey: 'careers.whyObmDescription' },
            ].map((_value, i) => (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-8 border-b border-primary-800 py-7 md:gap-12"
              >
                <span className="pt-1 font-display text-sm font-semibold tracking-[0.2em] text-accent-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                    {t('about.storyEyebrow')}
                  </h3>
                  <p className="mt-3 max-w-xl text-primary-300">{t('about.valuesDescription')}</p>
                </div>
                <span className="mt-2 hidden h-px w-16 bg-primary-700 transition-all duration-500 group-hover:w-24 group-hover:bg-accent-400 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
