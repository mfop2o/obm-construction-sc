import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { useTranslatedNavItems, brand } from '../../data/navigation'
import Container from '../ui/Container'
import { Logo } from '../ui/Logo'
import { useTranslation } from '../../i18n'

/* ============================================================================
   Footer — rich footer with brand, nav columns, and contact placeholders.
   Contact details are placeholders — replace with real data when available.
   ========================================================================== */

const placeholders = {
  address: 'Addis Ababa, Ethiopia',
  phone: '+251 11 000 0000',
  email: 'info@obmconstruction.com',
}

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { t } = useTranslation()
  const translatedNavItems = useTranslatedNavItems()
  const companyLinks = translatedNavItems.filter((item) => item.to !== '/contact')

  const serviceLinks = [
    { label: t('footer.buildingConstruction'), to: '/services' },
    { label: t('footer.civilWorks'), to: '/services' },
    { label: t('footer.roadsInfrastructure'), to: '/services' },
    { label: t('footer.renovation'), to: '/services' },
  ]

  return (
    <footer className="bg-primary-950 text-primary-200">
      <Container as="div" className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo to="/" heightClass="h-12" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-300">
              {t('footer.description', { name: brand.fullName })}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {t('footer.company')}
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
              {t('footer.services')}
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
              {t('footer.contact')}
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-primary-300">{t('footer.addisAbaba')}</span>
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
            {t('footer.copyright', { year: currentYear, name: brand.fullName })}
          </p>
          <p>{t('footer.registration')}</p>
        </Container>
      </div>
    </footer>
  )
}
