import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { cn } from '../../lib/cn'
import { ProjectCard } from './ProjectCard'

/* ============================================================================
   ProjectGrid — responsive grid of project cards.
   Supports smooth filtering via AnimatePresence popLayout when the project
   list changes (e.g. category filtering).
   ========================================================================== */

const gridItem = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface ProjectGridProps {
  projects: Project[]
  aspect?: string
  /** Column layout. */
  columns?: 1 | 2 | 3
  /** Enable smooth filter transitions (must keep stable keys). */
  animated?: boolean
  className?: string
  emptyMessage?: string
}

export function ProjectGrid({
  projects,
  aspect = 'aspect-[4/5]',
  columns = 3,
  animated = false,
  className,
  emptyMessage = 'No projects match this filter.',
}: ProjectGridProps) {
  const ref = useRef<HTMLDivElement>(null)

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-primary-200 bg-background py-24 text-center">
        <p className="font-display text-lg font-medium text-primary-900">
          {emptyMessage}
        </p>
        <p className="mt-2 max-w-sm text-sm text-concrete-dark">
          Try selecting a different category to explore more of our work.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'grid gap-6',
        {
          1: 'grid-cols-1',
          2: 'grid-cols-1 sm:grid-cols-2',
          3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        }[columns],
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            key={project.slug}
            layout={animated}
            variants={animated ? gridItem : undefined}
            initial={animated ? 'hidden' : false}
            animate={animated ? 'show' : undefined}
            exit={animated ? { opacity: 0, scale: 0.96, transition: { duration: 0.25 } } : undefined}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <ProjectCard project={project} aspect={aspect} reveal={false} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ProjectGrid
