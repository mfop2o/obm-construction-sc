import { useState, useRef, useEffect } from 'react'
import { useTranslation, availableLocales, localeLabelsMap, type Locale } from '../../i18n'
import { cn } from '../../lib/cn'

/* ============================================================================
   LanguageSwitcher — dropdown to switch between en / am / om.
   Compact trigger showing current locale label; opens a small dropdown.
   ========================================================================== */

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md border border-primary-200 bg-surface px-3 py-1.5 text-xs font-medium text-primary-900 transition-colors hover:bg-primary-50"
        aria-label="Change language"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {localeLabelsMap[locale]}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-md border border-primary-100 bg-surface shadow-lg">
          {availableLocales.map((l: Locale) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center px-3 py-2 text-left text-sm transition-colors',
                l === locale
                  ? 'bg-accent-400/10 font-medium text-primary-950'
                  : 'text-concrete-dark hover:bg-primary-50',
              )}
            >
              {localeLabelsMap[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
