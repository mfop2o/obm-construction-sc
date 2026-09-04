import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import PageTransition from './PageTransition'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip-to-content link for keyboard/screen-reader users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent-400 focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-primary-950"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false}>
          <div key={location.pathname}>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
