import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/* ============================================================================
   Responsive Container system
   - Container: centered, fluid-width wrapper with horizontal gutters.
   - Breakpoints follow Tailwind default (sm/md/lg/xl/2xl ~ 640/768/1024/1280/1536).
   - Section: Container + vertical rhythm (padding scale).
   ========================================================================== */

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-screen-md', // 768px
  md: 'max-w-screen-lg', // 1024px
  lg: 'max-w-screen-xl', // 1280px
  xl: 'max-w-screen-2xl', // 1536px
  full: 'max-w-none',
}

interface ContainerProps {
  as?: ElementType
  size?: ContainerSize
  className?: string
  children?: ReactNode
}

export function Container({
  as: Component = 'div',
  size = 'xl',
  className,
  children,
  ...rest
}: ContainerProps & Record<string, unknown>) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-5 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}

/* ---- Section ------------------------------------------------------------ */

type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl'

const paddingClasses: Record<SectionPadding, string> = {
  none: 'py-0',
  sm: 'py-10 md:py-14',
  md: 'py-14 md:py-20',
  lg: 'py-16 md:py-24 lg:py-28',
  xl: 'py-20 md:py-28 lg:py-32',
}

interface SectionProps
  extends Omit<ContainerProps, 'size' | 'padding'> {
  containerSize?: ContainerSize
  padding?: SectionPadding
}

export function Section({
  as = 'section',
  containerSize = 'xl',
  padding = 'md',
  className,
  children,
  ...rest
}: SectionProps & Record<string, unknown>) {
  return (
    <Container
      as={as}
      className={cn(paddingClasses[padding], className)}
      size={containerSize}
      {...rest}
    >
      {children}
    </Container>
  )
}

export default Container
