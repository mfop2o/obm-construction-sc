import { motion } from 'framer-motion'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import { ServiceList } from '../components/services/ServiceList'
import { useServices } from '../lib/contentStore'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

/* ============================================================================
   /services — OBM construction services.
   ========================================================================== */

export default function Services() {
  const services = useServices()
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('services.title'),
    description: t('services.description'),
  })

  const approach = [
    t('services.approach1'),
    t('services.approach2'),
    t('services.approach3'),
    t('services.approach4'),
  ]

  return (
    <>
      <PageHero
        eyebrow={t('services.heroEyebrow')}
        title={t('services.heroTitle')}
        description={t('services.heroDescription')}
        breadcrumb={[{ label: t('services.breadcrumbHome'), to: '/' }, { label: t('services.breadcrumbServices') }]}
      />

      {/* Editorial interactive service list (dark) */}
      <Section as="section" padding="none" className="bg-primary-950 py-12 text-white md:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
              {t('services.servicesList')}
            </p>
          </div>
          <div className="mt-8">
            <ServiceList services={services} />
          </div>
        </Container>
      </Section>

      {/* Approach statement */}
      <Section as="section" padding="none" className="border-t border-primary-200 bg-background py-10 md:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
                <span className="inline-block h-px w-8 bg-current" />
                {t('services.approachLabel')}
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-primary-950 md:text-3xl">
                {t('services.approachTitle')}
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden border border-primary-200 bg-primary-200 sm:grid-cols-2">
              {approach.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="group bg-surface p-5 transition-colors duration-300 hover:bg-primary-50"
                >
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 font-display text-lg font-semibold text-primary-950">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
