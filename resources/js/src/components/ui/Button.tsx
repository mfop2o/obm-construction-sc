import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

/* ============================================================================
   Button — design-system button
   Variants: primary | accent | outline | ghost | link
   Sizes:    sm | md | lg
   Usage: <Button>…</Button>, <Button as="a" href="…">…</Button>,
          <Button as="link" to="/contact">…</Button>
   ========================================================================== */

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-display font-medium ' +
  'whitespace-nowrap transition-all duration-200 ease-out select-none ' +
  'active:scale-[0.98] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
  'disabled:pointer-events-none disabled:opacity-50 cursor-pointer'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-400 text-primary-950 hover:bg-accent-300 active:bg-accent-500 ' +
    'shadow-sm hover:shadow-md',
  accent:
    'bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 ' +
    'shadow-sm hover:shadow-md',
  outline:
    'border border-primary-900 bg-transparent text-primary-900 ' +
    'hover:bg-primary-900 hover:text-white',
  ghost: 'bg-transparent text-primary-900 hover:bg-primary-100',
  link:
    'bg-transparent text-primary-900 underline-offset-4 hover:underline ' +
    'px-0 h-auto',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-sm',
  lg: 'h-14 px-9 text-base',
}

const linkSizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children?: ReactNode
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
>
type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'className' | 'children'
>

export type ButtonProps = ButtonBaseProps & {
  as?: 'button' | 'a' | 'link'
  href?: string
  to?: string
} & NativeButtonProps &
  NativeAnchorProps

function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  to,
  ...rest
}: ButtonProps) {
  const styles = cn(
    baseStyles,
    variant === 'link' ? linkSizeStyles[size] : sizeStyles[size],
    variantStyles[variant],
    className,
  )

  if (as === 'link' && to) {
    return (
      <Link to={to} className={styles} {...(rest as NativeAnchorProps)}>
        {children}
      </Link>
    )
  }

  if (as === 'a' && href) {
    return (
      <a href={href} className={styles} {...(rest as NativeAnchorProps)}>
        {children}
      </a>
    )
  }

  return (
    <button className={styles} {...(rest as NativeButtonProps)}>
      {children}
    </button>
  )
}

export default Button
