import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/* ============================================================================
   SectionHeading — unified section intro component.

   Typography contract (must match all inline section headers):
     eyebrow  10–11px  font-bold  uppercase  tracking-[0.32em]
              accent-500 on light bg · accent-400 on dark bg
     h2       3xl–5xl  font-bold  uppercase  leading-[0.95]  tracking-tight
              primary-950 on light bg · white on dark bg
     desc     base–lg  leading-relaxed
              concrete-dark on light bg · primary-300 on dark bg
   ========================================================================== */

type HeadingAlign = 'left' | 'center'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: HeadingAlign
  action?: ReactNode
  className?: string
  /** Set true when placed on a dark (primary-950) background */
  light?: boolean
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
        'flex flex-col',
        centered && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <motion.p
          variants={itemVariants}
          className={cn(
            'inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em]',
            light ? 'text-accent-400' : 'text-accent-500',
          )}
        >
          <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        variants={itemVariants}
        className={cn(
          'mt-5 font-display font-bold uppercase leading-[0.95] tracking-tight',
          'text-3xl sm:text-4xl lg:text-5xl',
          light ? 'text-white' : 'text-primary-950',
          centered && 'mx-auto max-w-3xl',
        )}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={itemVariants}
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            light ? 'text-primary-300' : 'text-concrete-dark',
            centered && 'mx-auto max-w-xl',
          )}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div variants={itemVariants} className="mt-6">
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}

export default SectionHeading
