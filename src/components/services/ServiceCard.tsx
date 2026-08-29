import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Service } from '../../data/services'
import { cn } from '../../lib/cn'
import { ProjectVisual } from '../projects/ProjectVisual'
import { Link } from 'react-router-dom'

/* ============================================================================
   ServiceCard — compact service card for grids and the homepage preview.
   Number, title, image, short description and a hover interaction.
   ========================================================================== */

interface ServiceCardProps {
  service: Service
  index: number
  aspect?: string
  className?: string
}

export function ServiceCard({
  service,
  index,
  aspect = 'aspect-[4/3]',
  className,
}: ServiceCardProps) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group flex flex-col', className)}
    >
      {/* Image */}
      <Link
        to="/contact"
        className={cn('relative block overflow-hidden bg-primary-100', aspect)}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          <ProjectVisual
            visual={service.image}
            variant={index}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 to-transparent transition-opacity duration-500" />
        <span className="absolute left-4 top-4 font-display text-sm font-bold tracking-[0.2em] text-accent-400">
          {number}
        </span>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white/10 text-white backdrop-blur transition-colors duration-300 group-hover:bg-accent-400 group-hover:text-primary-950">
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col pt-6">
        <h3 className="font-display text-xl font-bold text-primary-950 md:text-2xl">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-concrete-dark">
          {service.description}
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-medium text-primary-900 transition-colors group-hover:text-accent-500"
        >
          Enquire
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  )
}

export default ServiceCard
