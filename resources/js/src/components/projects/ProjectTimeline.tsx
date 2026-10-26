import { motion } from 'framer-motion'
import { useTranslation } from '../../i18n'
import type { Locale } from '../../i18n'
import type { Project } from '../../data/projects'

/* ============================================================================
   ProjectTimeline — the dated project history recorded by the administrator.
   Each entry is a milestone: contract award, topping out, handover, acceptance.
   ========================================================================== */

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/** BCP-47 tags for the three site locales, used to format milestone dates. */
const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  am: 'am-ET',
  om: 'om-ET',
}

/** Format an ISO date for display, falling back to the raw value. */
function formatDate(value: string, locale: Locale): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}

export function ProjectTimeline({ project }: { project: Project }) {
  const { locale } = useTranslation()

  if (project.history.length === 0) return null

  return (
    <motion.ol
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="relative space-y-8 border-l border-primary-200 pl-8"
    >
      {project.history.map((entry) => (
        <motion.li key={entry.id} variants={reveal} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent-500"
          />
          <time
            dateTime={entry.occurred_on}
            className="block text-xs font-medium uppercase tracking-[0.2em] text-accent-500"
          >
            {formatDate(entry.occurred_on, locale)}
          </time>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-primary-950">
            {entry.title}
          </h3>
          {entry.description && (
            <p className="mt-2 max-w-2xl text-concrete-dark">{entry.description}</p>
          )}
        </motion.li>
      ))}
    </motion.ol>
  )
}

export default ProjectTimeline