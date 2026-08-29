import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

interface ImageRevealProps {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
  objectPosition?: string
  eager?: boolean
}

/* ============================================================================
   ImageReveal — image with a premium masked reveal on scroll into view.
   Falls back to a brand-toned placeholder if the src fails to load.
   ========================================================================== */

export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  objectPosition = 'center',
  eager = false,
}: ImageRevealProps) {
  const [error, setError] = useState(false)
  const showPlaceholder = !src || error

  return (
    <div className={cn('relative overflow-hidden bg-primary-200', className)}>
      {showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-900">
          <span className="font-display text-2xl font-bold tracking-tight text-accent-400/80">
            OBM
          </span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setError(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
          style={{ objectPosition }}
          initial={{ scale: 1.15, opacity: 0.6 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  )
}

export default ImageReveal
