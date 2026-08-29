import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/* ============================================================================
   SectionHeading — editorial section intro
   Composed of an eyebrow label, a large display heading, an optional
   description, and an optional right-side action slot.
   ========================================================================== */

type HeadingAlign = 'left' | 'center'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: HeadingAlign
  action?: ReactNode
  className?: string
  light?: boolean
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
  light = false,
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'flex flex-col gap-5',
        centered && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <motion.span
          variants={itemVariants}
          className={cn(
            'inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em]',
            light ? 'text-accent-400' : 'text-accent-500',
          )}
        >
          <span className="inline-block h-px w-8 bg-current" />
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={itemVariants}
        className={cn(
          'max-w-3xl text-4xl font-semibold md:text-5xl lg:text-6xl',
          light ? 'text-white' : 'text-primary-900',
          centered && 'mx-auto',
        )}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={itemVariants}
          className={cn(
            'max-w-xl text-base leading-relaxed md:text-lg',
            light ? 'text-concrete-light' : 'text-concrete-dark',
            centered && 'mx-auto',
          )}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div variants={itemVariants} className="mt-2">
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export default SectionHeading
