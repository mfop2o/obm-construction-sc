import { Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { projectDocumentUrl } from '../../lib/projectsStore'
import type { Project } from '../../data/projects'

/* ============================================================================
   ProjectDocuments — the downloadable documents attached to a project.
   Contracts, completion certificates and reports are served through the
   authorised download endpoint rather than a guessable static path.
   ========================================================================== */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/** Render a byte count as a short human-readable size. */
function formatSize(bytes: number | null): string | null {
  if (!bytes) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

export function ProjectDocuments({ project }: { project: Project }) {
  if (project.documents.length === 0 || !project.id) return null

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-4 md:grid-cols-2"
    >
      {project.documents.map((document) => (
        <a
          key={document.id}
          href={projectDocumentUrl(project.id as number, document.id)}
          className="group flex items-start gap-4 border border-primary-200 bg-background p-5 transition-colors duration-300 hover:border-primary-900"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary-200 text-primary-900 transition-colors duration-300 group-hover:border-accent-400 group-hover:bg-accent-400">
            <FileText size={18} strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-semibold text-primary-950">
              {document.title || document.original_name}
            </span>
            <span className="mt-1 block text-sm text-concrete">
              {[document.original_name, formatSize(document.file_size)]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </span>
          <Download
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-concrete transition-colors duration-300 group-hover:text-primary-900"
          />
        </a>
      ))}
    </motion.div>
  )
}

export default ProjectDocuments