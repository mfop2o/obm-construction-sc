import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useScrolled } from '../../hooks/useScroll'
import Button from '../ui/Button'
import { brand, navItems } from '../../data/navigation'

/* ============================================================================
   Navbar — desktop + mobile, sticky with scroll-aware styling.
   Renders as a transparent dark bar over the dark home hero at the top of
   the page, then transitions to a solid frosted light bar once scrolled
   or when navigating away from the homepage.
   ========================================================================== */

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(12)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  /* Close the mobile menu on route change (adjust state during render) */
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setOpen(false)
  }

  /* Prevent body scroll while the mobile menu is open */
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  /* Close on Escape and trap focus inside the mobile menu (a11y) */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !menuRef.current) return

      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const list = Array.from(focusables).filter((el) => el.offsetParent !== null)
      if (list.length === 0) return

      const first = list[0]
      const last = list[list.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const overHero = !scrolled && location.pathname === '/' && !open
  const dark = overHero

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        dark
          ? 'border-b border-white/10 bg-transparent'
          : scrolled
            ? 'border-b border-primary-200/70 bg-background/90 shadow-sm backdrop-blur-xl'
            : 'border-b border-transparent bg-background/70 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-5 sm:px-6 lg:h-20 lg:px-8">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center transition-colors',
              dark
                ? 'bg-accent-400 font-display text-sm font-bold text-primary-950'
                : 'bg-primary-900 font-display text-sm font-bold text-accent-400 group-hover:bg-primary-800',
            )}
          >
            OB
          </span>
          <span className="text-left">
            <span
              className={cn(
                'block font-display text-lg font-bold leading-none tracking-tight transition-colors',
                dark ? 'text-white' : 'text-primary-950',
              )}
            >
              {brand.name}
            </span>
            <span
              className={cn(
                'mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors',
                dark ? 'text-accent-300' : 'text-concrete',
              )}
            >
              Construction S.C.
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative px-4 py-2 font-display text-sm font-medium transition-colors',
                  isActive
                    ? dark
                      ? 'text-white'
                      : 'text-primary-950'
                    : dark
                      ? 'text-primary-200 hover:text-white'
                      : 'text-concrete-dark hover:text-primary-950',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-accent-400 transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'group-hover:scale-x-100',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
          <Button
            as="link"
            to="/contact"
            size="sm"
            className="ml-4"
            variant={dark ? 'accent' : 'primary'}
          >
            Start a Project
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-none transition-colors lg:hidden',
            dark
              ? 'text-white hover:bg-white/10'
              : 'text-primary-950 hover:bg-primary-100',
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 top-16 z-40 bg-primary-950/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="panel"
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-primary-200 bg-background px-6 pb-10 pt-6 lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                    className="border-b border-primary-100"
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between py-4 font-display text-lg font-medium transition-colors',
                          isActive
                            ? 'text-primary-950'
                            : 'text-concrete-dark hover:text-primary-950',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{item.label}</span>
                          <ChevronRight
                            size={18}
                            strokeWidth={1.5}
                            className={cn(
                              'transition-colors',
                              isActive ? 'text-accent-500' : 'text-primary-300',
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button as="link" to="/contact" size="lg" variant="primary">
                  Start a Project
                </Button>
                <Button as="link" to="/projects" size="lg" variant="outline">
                  View Our Work
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
