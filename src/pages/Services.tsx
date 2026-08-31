import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import { ServiceList } from '../components/services/ServiceList'
import { services } from '../data/services'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

/* ============================================================================
   /services — OBM construction services.
   Dark editorial page with the interactive hover-image service list.
   ========================================================================== */

const approach = [
  'Fixed line of accountability',
  'Integrated design & engineering',
  'Strict safety & quality control',
  'Transparent reporting',
]

export default function Services() {
  useDocumentMeta({
    title: 'Services | OBM Construction S.C.',
    description:
      'Building construction, civil & infrastructure, roads, engineering & project management, renovation and design-build services from OBM.',
  })

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Capabilities built on engineering discipline."
        description="From a single commercial build to road infrastructure and full turnkey delivery, OBM provides end-to-end construction services with integrity at every stage."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      {/* Editorial interactive service list (dark) */}
      <Section as="section" padding="none" className="bg-primary-950 py-12 text-white md:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
              Our Services
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
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500">
                <span className="inline-block h-px w-8 bg-current" />
                How We Work
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-primary-950 md:text-3xl">
                A disciplined approach to every engagement.
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
                  className="group bg-white p-5 transition-colors duration-300 hover:bg-primary-50"
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
