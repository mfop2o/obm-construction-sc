import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Container } from './Container'
import { cn } from '../../lib/cn'

/* ============================================================================
   PageHero — light editorial page hero for interior pages.
   Supports an optional breadcrumb trail.
   ========================================================================== */

interface Crumb {
  label: string
  to?: string
}

interface PageHeroProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  breadcrumb?: Crumb[]
  align?: 'left' | 'center'
  className?: string
  /** Dark variant for deep sections. */
  dark?: boolean
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  align = 'left',
  className,
  dark = false,
}: PageHeroProps) {
  const centered = align === 'center'

  return (
    <section
      className={cn(
        'border-b border-primary-200',
        dark ? 'bg-primary-950 text-white' : 'bg-background',
        className,
      )}
    >
      <Container
        className={cn(
          'pt-14 pb-12 md:pt-20 md:pb-16',
          centered && 'text-center',
        )}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            variants={fade}
            initial="hidden"
            animate="show"
            className={cn(
              'mb-6 flex flex-wrap items-center gap-1.5 text-sm text-concrete',
              centered && 'justify-center',
            )}
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((crumb, i) => {
              const isLast = i === breadcrumb.length - 1
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="transition-colors hover:text-primary-950"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && (dark ? 'text-white' : 'text-primary-900'))}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight size={14} className="text-primary-300" />}
                </span>
              )
            })}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            className={cn(
              'mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em]',
              dark ? 'text-accent-400' : 'text-accent-500',
            )}
          >
            <span className="inline-block h-px w-8 bg-current" />
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          variants={fade}
          initial="hidden"
          animate="show"
          className={cn(
            'max-w-4xl font-display text-4xl font-bold tracking-tight md:text-6xl',
            dark ? 'text-white' : 'text-primary-950',
            centered && 'mx-auto',
          )}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            className={cn(
              'mt-6 max-w-2xl text-lg leading-relaxed',
              dark ? 'text-primary-300' : 'text-concrete-dark',
              centered && 'mx-auto',
            )}
          >
            {description}
          </motion.p>
        )}
      </Container>
    </section>
  )
}

export default PageHero
