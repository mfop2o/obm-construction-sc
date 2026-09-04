import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { getProjectImage } from '../../lib/projectsStore'
import { Photo } from '../ui/Photo'

/* ============================================================================
   ProjectGallery — photography-led gallery for the project detail page.
   Renders the project's principal photography at a large, cinematic scale.
   Add additional gallery image keys to src/data/images.ts to extend.
   ========================================================================== */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface ProjectGalleryProps {
  project: Project
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="relative aspect-[16/10] overflow-hidden md:aspect-[16/7]"
    >
      <Photo
        src={getProjectImage(project)}
        alt={`${project.title} — ${project.category} project in ${project.location}`}
        className="h-full w-full"
        position="50% 45%"
        noReveal
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 flex flex-wrap items-center gap-x-8 gap-y-2 p-6 text-sm text-primary-100 md:p-10">
        <span>{project.location}</span>
        <span>{project.year}</span>
        <span className="text-accent-300">{project.category}</span>
      </div>
    </motion.div>
  )
}

export default ProjectGallery
