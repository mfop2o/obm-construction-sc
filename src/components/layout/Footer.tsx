import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { brand, navItems } from '../../data/navigation'
import Container from '../ui/Container'

/* ============================================================================
   Footer — rich footer with brand, nav columns, and contact placeholders.
   Contact details are placeholders — replace with real data when available.
   ========================================================================== */

const serviceLinks = [
  { label: 'Building Construction', to: '/services' },
  { label: 'Civil Works', to: '/services' },
  { label: 'Roads & Infrastructure', to: '/services' },
  { label: 'Renovation', to: '/services' },
]

const companyLinks = navItems.filter((item) => item.to !== '/contact')

const placeholders = {
  address: 'Addis Ababa, Ethiopia',
  phone: '+251 11 000 0000',
  email: 'info@obmconstruction.com',
}

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-200">
      <Container as="div" className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center bg-accent-400 font-display text-sm font-bold text-primary-950">
                OB
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                {brand.name}
                <span className="block text-[0.6rem] font-medium uppercase tracking-[0.2em] text-accent-300">
                  Construction S.C.
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-300">
              {brand.fullName} is an Ethiopian construction company delivering
              safe, quality and on-time projects through engineering excellence
              and integrity.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Company
            </h4>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-primary-300 transition-colors hover:text-accent-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Services
            </h4>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-primary-300 transition-colors hover:text-accent-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Contact
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-primary-300">{placeholders.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-accent-400" />
                <a
                  href={`tel:${placeholders.phone}`}
                  className="text-primary-300 transition-colors hover:text-accent-300"
                >
                  {placeholders.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-accent-400" />
                <a
                  href={`mailto:${placeholders.email}`}
                  className="text-primary-300 transition-colors hover:text-accent-300"
                >
                  {placeholders.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <Container
          as="div"
          className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-400 sm:flex-row"
        >
          <p>
            &copy; {currentYear} {brand.fullName}. All rights reserved.
          </p>
          <p>Registered in the Federal Democratic Republic of Ethiopia</p>
        </Container>
      </div>
    </footer>
  )
}
