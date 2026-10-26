import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import logoMark from '../../assets/logo-mark.png'
import logoMarkLight from '../../assets/logo-mark-light.png'
import logoLockup from '../../assets/logo-lockup.png'
import logoLockupLight from '../../assets/logo-lockup-light.png'
import { brand } from '../../data/navigation'
import { useTranslation } from '../../i18n'

/* ============================================================================
   Logo — the OBM brand mark.

   The master artwork is a 2000x2000 canvas that is roughly two thirds empty
   padding, so the runtime assets are pre-cropped (logo-mark / logo-lockup)
   and the mark is free to fill its box instead of floating in dead space.

   Two colourways ship:
     - default  gold + near-black, for light surfaces
     - light    gold + white, for dark surfaces (footer, hero overlays)

   Height is driven by `heightClass`; width always follows the artwork's own
   aspect ratio, so the mark is never letterboxed or squashed.
   ========================================================================== */

interface LogoProps {
  to?: string
  heightClass?: string
  className?: string
  showWordmark?: boolean
  light?: boolean
  circle?: boolean
  variant?: 'mark' | 'lockup'
}

export function Logo({
  to,
  heightClass = 'h-11',
  className,
  showWordmark = false,
  light = false,
  circle = false,
  variant = 'mark',
}: LogoProps) {
  const { t } = useTranslation()

  const artwork =
    variant === 'lockup'
      ? light
        ? logoLockupLight
        : logoLockup
      : light
        ? logoMarkLight
        : logoMark

  const art = (
    <img
      src={artwork}
      alt={`${brand.fullName} logo`}
      width={variant === 'lockup' ? 308 : 320}
      height={variant === 'lockup' ? 480 : 320}
      className={cn('h-auto w-auto object-contain', heightClass)}
    />
  )

  const mark = circle ? (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-primary-100',
        heightClass,
        'aspect-square w-auto',
      )}
    >
      <img
        src={logoMark}
        alt={`${brand.fullName} logo`}
        width={320}
        height={320}
        className="h-full w-full object-contain"
      />
    </span>
  ) : (
    art
  )

  const inner = (
    <>
      {mark}
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
            {t(brand.taglineKey)}
          </span>
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cn('inline-flex items-center gap-3', className)}>
        {inner}
      </Link>
    )
  }

  return <span className={cn('inline-flex items-center gap-3', className)}>{inner}</span>
}

export default Logo
