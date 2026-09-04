import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ============================================================================
   PageTransition — wraps routed pages with a subtle fade/rise entrance.
   Used inside Layout so each route change triggers the animation.
   ========================================================================== */

const variants = {
  hidden: { opacity: 0, y: 16 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
