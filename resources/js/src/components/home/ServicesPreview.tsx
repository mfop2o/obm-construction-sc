import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { useServices } from '../../lib/contentStore'
import { useTranslation } from '../../i18n'

/* ============================================================================
   ServicesPreview — dark editorial services section.

   Color rules on bg-primary-950:
     eyebrow    text-accent-400    (gold — consistent with all dark sections)
     h2         text-white         (full brightness — maximum contrast on dark)
     card #     text-accent-400/50 (muted gold — decorative, not primary info)
     card title text-white         → text-accent-300 on hover (warm, not harsh)
     card body  text-primary-300   (readable at ~70% brightness — not /50 white)
   ========================================================================== */

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const defaultServices = [
  {
    id: 1,
    title: 'Building Construction',
    description: 'Commercial towers, corporate headquarters, and residential complexes delivered with structural precision and fine finishing.',
  },
  {
    id: 2,
    title: 'Civil & Infrastructure',
    description: 'Bridges, heavy concrete structures, site development, and public infrastructure engineered to endure.',
  },
  {
    id: 3,
    title: 'Roads & Highways',
    description: 'Urban arterials, regional highways, earthworks, asphalt paving, and drainage systems with modern heavy plant machinery.',
  },
  {
    id: 4,
    title: 'Engineering & Project Management',
    description: 'Integrated design coordination, CPM scheduling, value engineering, and disciplined QA/QC site supervision.',
  },
  {
    id: 5,
    title: 'Renovation & Modernization',
    description: 'Structural strengthening, facade restoration, and complete MEP upgrades for existing commercial buildings.',
  },
  {
    id: 6,
    title: 'Turnkey Design-Build Solutions',
    description: 'Single-source accountability aligning architectural planning, engineering, and construction for faster, higher-value delivery.',
  },
]

export default function ServicesPreview() {
  const storeServices = useServices()
  const services = storeServices.length > 0 ? storeServices : defaultServices
  const { t } = useTranslation()

  return (
    <Section as="section" padding="xl" className="relative overflow-hidden bg-primary-950 text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-accent-400/[0.04] blur-[160px]" aria-hidden="true" />

      <Container className="relative">

        {/* Header */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em] text-accent-400">
              <span className="inline-block h-px w-8 bg-accent-400" aria-hidden="true" />
              {t('services.heroEyebrow')}
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-[0.98] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('services.heroTitle')}
            </h2>
          </div>
          <div className="shrink-0">
            <Button
              as="link"
              to="/services"
              variant="outline"
              className="group rounded-full border-white/20 px-8 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:border-accent-400/50 hover:bg-white/8 hover:text-accent-300"
            >
              {t('services.servicesList')}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to="/services"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/35 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
              >
                {/* Accent top gradient on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-400 via-amber-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Step number */}
                <div className="flex items-center justify-between">
                  <span className="font-display text-[10px] font-bold tracking-[0.22em] text-accent-400/70 transition-colors duration-300 group-hover:text-accent-400">
                    SERVICE // {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-primary-400 transition-all duration-300 group-hover:border-accent-400/40 group-hover:bg-accent-400/10 group-hover:text-accent-400">
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-white transition-colors duration-200 group-hover:text-accent-300">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-primary-300">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <span className="h-0.5 w-6 rounded-full bg-white/10 transition-all duration-300 group-hover:w-12 group-hover:bg-accent-400" />
                  <span className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-accent-400/0 transition-all duration-300 group-hover:text-accent-400">
                    Explore
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
