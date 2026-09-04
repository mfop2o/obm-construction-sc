import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import logo from '../../assets/logo.png'
import { brand } from '../../data/navigation'

/* ============================================================================
   Logo — the OBM brand mark. The source logo.png has a white background, so
   it is always shown on a white tile (with a set height) so it reads
   correctly on any surrounding background (dark hero, dark footer, light
   navbar, login screen). Height is controlled via the `height` prop/class;
   white space around the mark is preserved by the baked-in padding.
   ========================================================================== */

interface LogoProps {
  to?: string
  heightClass?: string
  className?: string
  showWordmark?: boolean
  light?: boolean
  circle?: boolean
}

export function Logo({
  to,
  heightClass = 'h-11',
  className,
  showWordmark = false,
  light = false,
  circle = false,
}: LogoProps) {
  const tile = (
    <span
      className={cn(
        'inline-flex items-center justify-center border bg-surface shadow-sm',
        circle
          ? 'rounded-full border-2 border-accent-400 p-1.5'
          : 'rounded-sm border-primary-100 p-1.5',
        heightClass,
        circle && 'aspect-square w-auto',
      )}
    >
      <img
        src={logo}
        alt={`${brand.fullName} logo`}
        className={cn('object-contain', circle ? 'h-full w-full' : 'h-full w-auto')}
      />
    </span>
  )

  const inner = (
    <>
      {tile}
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              'font-display text-sm font-bold uppercase tracking-wide',
              light ? 'text-white' : 'text-primary-950',
            )}
          >
            OBM Construction
          </span>
          <span
            className={cn(
              'text-xs',
              light ? 'text-primary-300' : 'text-concrete',
            )}
          >
            {brand.tagline}
          </span>
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cn('inline-flex items-center gap-2.5', className)}>
        {inner}
      </Link>
    )
  }

  return <span className={cn('inline-flex items-center gap-2.5', className)}>{inner}</span>
}

export default Logo
