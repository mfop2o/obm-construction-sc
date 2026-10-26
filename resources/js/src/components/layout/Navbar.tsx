import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ChevronRight, Phone } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useScrolled } from '../../hooks/useScroll'
import Button from '../ui/Button'
import { Logo } from '../ui/Logo'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { useTranslatedNavItems } from '../../data/navigation'
import { useTranslation } from '../../i18n'

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
  const { t } = useTranslation()
  const translatedNavItems = useTranslatedNavItems()

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
        'sticky top-0 z-50 w-full transition-all duration-500',
        dark
          ? 'bg-transparent border-b border-white/8'
          : scrolled
            ? 'border-b border-primary-100 bg-white/95 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl'
            : 'border-b border-primary-100/60 bg-background/85 backdrop-blur-md',
      )}
    >
      {/* top micro-bar on light mode */}
      {!dark && (
        <div className="hidden border-b border-primary-100/60 bg-primary-950 lg:block">
          <div className="mx-auto flex h-8 w-full max-w-screen-2xl items-center justify-between px-8">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-400">
              OBM Construction S.C. — Engineering Excellence
            </p>
            <a
              href="tel:+251110000000"
              className="inline-flex items-center gap-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-400 transition-colors hover:text-accent-300"
            >
              <Phone size={10} />
              +251 11 000 0000
            </a>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-5 sm:px-6 lg:h-[72px] lg:px-8">
        {/* Brand */}
        <Logo
          to="/"
          heightClass="h-10 lg:h-11"
          showWordmark
          light={dark}
          className="transition-opacity"
        />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {translatedNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative rounded-md px-4 py-2 font-display text-sm font-medium transition-all duration-200',
                  isActive
                    ? dark
                      ? 'text-white'
                      : 'text-primary-950'
                    : dark
                      ? 'text-white/70 hover:bg-white/8 hover:text-white'
                      : 'text-concrete-dark hover:bg-primary-50 hover:text-primary-950',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-4 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-accent-400 transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'group-hover:scale-x-75',
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}

          <LanguageSwitcher className="ml-3" />

          <Button
            as="link"
            to="/request-quote"
            size="sm"
            className={cn(
              'ml-4 rounded-full px-6 text-[13px] font-semibold tracking-wide',
              dark
                ? 'bg-accent-400 text-primary-950 hover:bg-accent-300'
                : 'bg-primary-950 text-white hover:bg-primary-800',
            )}
            variant={dark ? 'accent' : 'primary'}
          >
            {t('nav.startProject')}
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden',
            dark
              ? 'text-white hover:bg-white/10'
              : 'text-primary-950 hover:bg-primary-100',
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <X size={22} strokeWidth={1.75} />
          ) : (
            <Menu size={22} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 top-16 z-40 bg-primary-950/50 backdrop-blur-sm lg:hidden"
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
              className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-white px-6 pb-10 pt-4 lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="divide-y divide-primary-100">
                {translatedNavItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.35 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between py-4 font-display text-base font-semibold transition-colors',
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
                            size={16}
                            strokeWidth={2}
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

              <div className="mt-5 flex items-center justify-between border-t border-primary-100 pt-5">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-concrete">
                  Language
                </span>
                <LanguageSwitcher />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button as="link" to="/request-quote" size="md" variant="primary" className="rounded-xl justify-center">
                  {t('nav.startProject')}
                </Button>
                <Button as="link" to="/projects" size="md" variant="outline" className="rounded-xl justify-center">
                  {t('nav.viewWork')}
                </Button>
              </div>

              <a
                href="tel:+251110000000"
                className="mt-6 flex items-center gap-2.5 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3.5 text-sm font-medium text-primary-900"
              >
                <Phone size={16} className="text-accent-500" />
                +251 11 000 0000
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
