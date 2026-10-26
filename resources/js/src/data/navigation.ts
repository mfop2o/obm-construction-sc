import { useTranslation } from '../i18n'

/* ============================================================================
   Central navigation config — single source of truth for Navbar & Footer.
   Uses translation keys so labels are locale-aware.
   ========================================================================== */

export interface NavItem {
  labelKey: string
  to: string
}

export const navItems: NavItem[] = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.about', to: '/about' },
  { labelKey: 'nav.services', to: '/services' },
  { labelKey: 'nav.projects', to: '/projects' },
  { labelKey: 'nav.careers', to: '/careers' },
  { labelKey: 'nav.contact', to: '/contact' },
]

export const brand = {
  name: 'OBM',
  fullName: 'OBM Construction S.C.',
  taglineKey: 'brand.tagline',
}

// Hook to get translated nav items
export function useTranslatedNavItems() {
  const { t } = useTranslation()
  return navItems.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }))
}
