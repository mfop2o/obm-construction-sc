import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import type { Service } from '../../data/services'
import { cn } from '../../lib/cn'
import { ProjectVisual } from '../projects/ProjectVisual'
import Button from '../ui/Button'

/* ============================================================================
   ServiceRow — large editorial service block with an alternating layout.
   Composes: number, title, overview, image, capabilities and a CTA. The
   image and text swap sides every row to avoid a uniform grid of cards.
   ========================================================================== */

const fade = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface ServiceRowProps {
  service: Service
  index: number
}

export function ServiceRow({ service, index }: ServiceRowProps) {
  const flip = index % 2 === 1
  const number = String(index + 1).padStart(2, '0')

  return (
    <div className="border-b border-primary-200 last:border-b-0">
      <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className={cn('group relative', 'order-1', flip ? 'lg:order-2' : '')}
        >
          <div className="relative overflow-hidden bg-primary-100">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
              <ProjectVisual
                visual={service.image}
                variant={index}
                className="h-[420px] w-full object-cover md:h-[480px]"
              />
            </div>
          </div>
          {/* number watermark */}
          <span className="pointer-events-none absolute -bottom-6 left-6 font-display text-7xl font-bold leading-none text-primary-900/10 md:text-8xl">
            {number}
          </span>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1 }}
          className={cn('order-2', flip ? 'lg:order-1' : '')}
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-accent-500">
              {number}
            </span>
            <span className="h-px w-12 bg-accent-400" />
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary-950 md:text-4xl">
            {service.title}
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-concrete-dark">
            {service.overview}
          </p>

          {/* Capabilities */}
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {service.capabilities.map((cap) => (
              <li key={cap} className="flex items-start gap-3 text-sm text-primary-900">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-accent-400/15 text-accent-600">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                {cap}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button as="link" to="/contact" variant="link" className="font-display">
              Discuss this service
              <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ServiceRow
