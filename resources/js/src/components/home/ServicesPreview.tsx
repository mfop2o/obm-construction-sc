import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { ServiceList } from '../services/ServiceList'
import { useServices } from '../../lib/contentStore'
import { useTranslation } from '../../i18n'

/* ============================================================================
   ServicesPreview — dark editorial services overview on the homepage.
   ========================================================================== */

export default function ServicesPreview() {
  const services = useServices()
  const { t } = useTranslation()
  return (
    <Section as="section" padding="xl" className="bg-primary-950 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
              <span className="inline-block h-px w-8 bg-accent-400" />
              {t('services.heroEyebrow')}
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              {t('services.heroTitle')}
            </h2>
          </div>
          <div className="shrink-0">
            <Button
              as="link"
              to="/services"
              variant="outline"
              className="border-white/30 text-white hover:bg-surface hover:text-primary-950"
            >
              {t('services.servicesList')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <ServiceList services={services} />
        </div>
      </Container>
    </Section>
  )
}
