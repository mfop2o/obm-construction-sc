import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Service } from '../../data/services'
import { serviceImages } from '../../data/images'
import { cn } from '../../lib/cn'

/* ============================================================================
   ServiceList — interactive editorial list of services.
   Each numbered row reveals its related photography on hover (desktop) and
   animates an arrow + subtle text shift. Gold is the interaction accent.
   ========================================================================== */

const rowReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface ServiceListProps {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* Rows */}
      <div className="border-t border-primary-800">
        {services.map((service, i) => {
          const isActive = active === i
          return (
            <motion.div
              key={service.id}
              variants={rowReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <Link
                to="/services"
                className={cn(
                  'group flex items-center gap-6 border-b border-primary-800 py-6 transition-colors duration-300 md:py-7',
                  isActive ? 'bg-primary-900' : 'hover:bg-primary-900/50',
                )}
              >
                <span
                  className={cn(
                    'font-display text-sm font-semibold tracking-[0.2em] transition-colors duration-300',
                    isActive ? 'text-accent-400' : 'text-primary-400',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1">
                  <h3
                    className={cn(
                      'font-display text-2xl font-semibold uppercase tracking-tight transition-all duration-300 md:text-3xl',
                      isActive
                        ? 'translate-x-2 text-white'
                        : 'text-white group-hover:text-white',
                    )}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-primary-300">
                    {service.description}
                  </p>
                </div>

                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-12 md:w-12',
                    isActive
                      ? 'border-accent-400 bg-accent-400 text-primary-950'
                      : 'border-primary-700 text-primary-300 group-hover:border-accent-400 group-hover:text-accent-400',
                  )}
                >
                  <ArrowRight
                    size={18}
                    className={cn(
                      'transition-transform duration-300',
                      isActive && 'translate-x-0.5',
                    )}
                  />
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Hover preview image (desktop only) */}
      <div className="relative hidden lg:block">
        <div className="sticky top-32">
          <div className="relative aspect-[4/5] overflow-hidden">
            {services.map((service, i) => (
              <motion.img
                key={service.id}
                src={serviceImages[service.imageKey]}
                alt={service.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1.02 : 1.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent" />
          </div>
          <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-primary-400">
            {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServiceList
