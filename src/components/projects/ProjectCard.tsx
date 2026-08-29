import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/projects'
import { projectImages } from '../../data/images'
import { cn } from '../../lib/cn'
import { Photo } from '../ui/Photo'

/* ============================================================================
   ProjectCard — reusable project link card with real photography.
   Hover: subtle image scale (1.05), dark overlay lift, arrow slides.
   Used across the homepage preview and the /projects gallery.
   ========================================================================== */

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface ProjectCardProps {
  project: Project
  aspect?: string
  className?: string
  showYear?: boolean
  /** Stagger control when the parent orchestrates reveal. */
  reveal?: boolean
}

export function ProjectCard({
  project,
  aspect = 'aspect-[4/5]',
  className,
  showYear = false,
  reveal = true,
}: ProjectCardProps) {
  const image = projectImages[project.slug]

  const content = (
    <>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
        <Photo
          src={image}
          alt={`${project.title} — ${project.category} project in ${project.location}`}
          className="h-full w-full"
          noReveal
        />
      </div>

      {/* hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/20 to-transparent transition-opacity duration-500" />

      {showYear && (
        <span className="absolute left-4 top-4 bg-primary-950/70 px-3 py-1 font-display text-xs font-medium tracking-wide text-accent-300 backdrop-blur-sm">
          {project.year}
        </span>
      )}

      {/* bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-400">
              {project.category}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-white md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-primary-200">
              {project.location} &bull; {project.year}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-primary-950">
            <ArrowUpRight size={20} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </>
  )

  const baseClasses = cn(
    'group relative block overflow-hidden bg-primary-800',
    aspect,
    className,
  )

  if (reveal) {
    return (
      <motion.div
        variants={cardReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="h-full"
      >
        <Link to={`/projects/${project.slug}`} className={baseClasses}>
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <Link to={`/projects/${project.slug}`} className={baseClasses}>
      {content}
    </Link>
  )
}

export default ProjectCard
