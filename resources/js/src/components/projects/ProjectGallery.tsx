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
  // Uploaded photography leads; the illustration registry is the fallback.
  const uploaded = project.photos.filter((photo) => photo.url)

  if (uploaded.length === 0) {
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

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {uploaded.map((photo, index) => (
        <motion.figure
          key={photo.id}
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className={
            index === 0 && uploaded.length > 1
              ? 'sm:col-span-2'
              : undefined
          }
        >
          <div
            className={
              index === 0 && uploaded.length > 1
                ? 'relative aspect-[16/9] overflow-hidden'
                : 'relative aspect-[4/3] overflow-hidden'
            }
          >
            <img
              src={photo.url as string}
              alt={photo.caption ?? `${project.title} — ${project.category} project`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
          </div>
          {photo.caption && (
            <figcaption className="mt-2 text-sm text-concrete">
              {photo.caption}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  )
}

export default ProjectGallery
