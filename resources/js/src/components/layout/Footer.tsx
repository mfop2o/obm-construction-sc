import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import { useTranslatedNavItems, brand } from '../../data/navigation'
import Container from '../ui/Container'
import { Logo } from '../ui/Logo'
import { useTranslation } from '../../i18n'

/* ============================================================================
   Footer — rich footer with brand, nav columns, and contact details.
   ========================================================================== */

const placeholders = {
  address: 'Addis Ababa, Ethiopia',
  phone: '+251 11 000 0000',
  email: 'info@obmconstruction.com',
}

const currentYear = new Date().getFullYear()

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Facebook', href: '#' },
]

export default function Footer() {
  const { t } = useTranslation()
  const translatedNavItems = useTranslatedNavItems()
  const companyLinks = translatedNavItems.filter((item) => item.to !== '/contact')

  const serviceLinks = [
    { label: t('footer.buildingConstruction'), to: '/services' },
    { label: t('footer.civilWorks'),           to: '/services' },
    { label: t('footer.roadsInfrastructure'),  to: '/services' },
    { label: t('footer.renovation'),            to: '/services' },
  ]

  return (
    <footer>
      {/* CTA Strip */}
      <div className="relative overflow-hidden border-t border-primary-200/60 bg-gradient-to-r from-primary-100 via-[#e2e7eb] to-primary-100 py-8 md:py-10">
        {/* Decorative large word */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-10 select-none font-display text-[10rem] font-black uppercase leading-none tracking-tight text-primary-950/[0.04] lg:text-[14rem]"
        >
          BUILD
        </span>
        <Container as="div" className="relative">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-accent-600">
                Ready to build?
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-primary-950 sm:text-3xl lg:text-4xl">
                Let's start your project.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 rounded-full bg-primary-950 px-7 py-3.5 font-display text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-800 hover:shadow-lg"
              >
                Get a Quote
                <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary-950/30 bg-white/40 px-7 py-3.5 font-display text-sm font-semibold text-primary-950 transition-all hover:border-primary-950 hover:bg-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main footer body */}
      <div className="bg-primary-950 text-primary-200">
        <Container as="div" className="py-10 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
            {/* Brand */}
            <div>
              <Logo to="/" variant="lockup" heightClass="h-12 lg:h-13" light />
              <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-accent-400">
                {t('brand.motto')}
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-primary-400">
                {t('footer.description', { name: brand.fullName })}
              </p>

              {/* Social links */}
              <div className="mt-5 flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-primary-400 transition-all hover:border-accent-400/30 hover:bg-accent-400/10 hover:text-accent-400"
                  >
                    <span className="font-display text-[10px] font-bold">{s.label.slice(0, 2)}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                {t('footer.company')}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1.5 text-sm text-primary-400 transition-colors hover:text-accent-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                {t('footer.services')}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {serviceLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="inline-flex items-center gap-1.5 text-sm text-primary-400 transition-colors hover:text-accent-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                {t('footer.contact')}
              </h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <MapPin size={14} className="text-accent-400" />
                  </div>
                  <span className="text-sm leading-relaxed text-primary-400">{t('footer.addisAbaba')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Phone size={14} className="text-accent-400" />
                  </div>
                  <a
                    href={`tel:${placeholders.phone}`}
                    className="text-sm text-primary-400 transition-colors hover:text-accent-300"
                  >
                    {placeholders.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Mail size={14} className="text-accent-400" />
                  </div>
                  <a
                    href={`mailto:${placeholders.email}`}
                    className="text-sm text-primary-400 transition-colors hover:text-accent-300"
                  >
                    {placeholders.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>

        {/* Bottom bar */}
        <div className="border-t border-white/6">
          <Container
            as="div"
            className="flex flex-col items-center justify-between gap-2 py-4 text-xs text-primary-500 sm:flex-row"
          >
            <p>
              {t('footer.copyright', { year: currentYear, name: brand.fullName })}
            </p>
            <p>{t('footer.registration')}</p>
          </Container>
        </div>
      </div>
    </footer>
  )
}
