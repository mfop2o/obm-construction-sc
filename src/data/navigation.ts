/* ============================================================================
   Central navigation config — single source of truth for Navbar & Footer.
   Update here to reflect the real site map as pages are built.
   ========================================================================== */

export interface NavItem {
  label: string
  to: string
  // Optional sub-items for future dropdowns
  items?: { label: string; to: string }[]
}

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

export const brand = {
  name: 'OBM',
  fullName: 'OBM Construction S.C.',
  tagline: 'Engineering excellence',
}
