import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { ServiceList } from '../services/ServiceList'
import { services } from '../../data/services'

/* ============================================================================
   ServicesPreview — dark editorial services overview on the homepage,
   driven by the interactive ServiceList (hover image reveal).
   ========================================================================== */

export default function ServicesPreview() {
  return (
    <Section as="section" padding="xl" className="bg-primary-950 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
              <span className="inline-block h-px w-8 bg-accent-400" />
              What We Do
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              A full spectrum
              <br />
              of construction.
            </h2>
          </div>
          <div className="shrink-0">
            <Button
              as="link"
              to="/services"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-primary-950"
            >
              All Services
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <ServiceList services={services} />
        </div>
      </Container>
    </Section>
  )
}
