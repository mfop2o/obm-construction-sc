import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/* ============================================================================
   Photo — premium image renderer.
   - object-cover by default (never stretches).
   - smooth masked reveal on scroll into view.
   - optional lazy loading and object-position control.
   Use this for all photography so imagery stays consistent and easy to swap.
   ========================================================================== */

interface PhotoProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** object-position, e.g. 'center', '50% 30%'. */
  position?: string
  /** Priority-load above the fold (hero). */
  eager?: boolean
  /** Disable the scroll reveal for instantly-visible uses. */
  noReveal?: boolean
}

export function Photo({
  src,
  alt,
  className,
  imgClassName,
  position = 'center',
  eager = false,
  noReveal = false,
}: PhotoProps) {
  return (
    <div className={cn('relative overflow-hidden bg-primary-800', className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('h-full w-full object-cover', imgClassName)}
        style={{ objectPosition: position }}
        initial={noReveal ? false : { scale: 1.08, opacity: 0.6 }}
        animate={noReveal ? { scale: 1, opacity: 1 } : undefined}
        whileInView={noReveal ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

export default Photo
