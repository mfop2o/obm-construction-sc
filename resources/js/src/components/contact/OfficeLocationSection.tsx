import { motion } from 'framer-motion'
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import type { HeadOfficeLocation } from '../../data/contact'

/* ============================================================================
   OfficeLocationSection — modern, responsive office-location section.
   Left: a large interactive Google Maps embed (keyless, marker pinned to the
   verified OBM head office). Right: office details + "Get Directions" which
   opens Google Maps navigation in a new tab.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface OfficeLocationSectionProps {
  location: HeadOfficeLocation
  phone?: string
  email?: string
  hours?: string
}

export function OfficeLocationSection({
  location,
  phone,
  email,
  hours = 'Monday – Friday, 8:30 – 17:30 (EAT)',
}: OfficeLocationSectionProps) {
  return (
    <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
      <Container>
        <SectionHeading
          eyebrow="Visit Our Office"
          title="Find us in Addis Ababa."
          description="Our head office is in Biftu Tower on the Mexico area, directly in front of the Addis Ababa Commerce University (Lideta sub-city). Drop by, call, or get directions to plan your visit."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ---- Interactive map ---- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7"
          >
            <div className="relative h-[340px] w-full overflow-hidden rounded-sm border border-primary-200 bg-background shadow-sm sm:h-[460px] lg:h-full lg:min-h-[520px]">
              <iframe
                src={location.embedUrl}
                title={`Map showing ${location.company}, ${location.building}, ${location.district}, ${location.city}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-primary-950/90 px-3 py-2 text-white">
                <MapPin size={14} className="text-accent-400" />
                <span className="font-display text-xs uppercase tracking-[0.2em]">
                  {location.company}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ---- Office info + directions ---- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-5"
          >
            <div className="flex h-full flex-col border border-primary-200 bg-surface p-6 shadow-sm sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-500">
                Head Office
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-primary-900">
                {location.company}
              </h3>

              <address className="mt-4 space-y-1 not-italic text-concrete-dark">
                <p className="font-display text-lg font-medium text-primary-950">
                  {location.building}, {location.floors}
                </p>
                <p>{location.district}</p>
                <p>{location.city}</p>
              </address>

              {phone || email ? (
                <div className="mt-6 space-y-4 border-t border-primary-200 pt-6">
                  {phone && (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-primary-900 text-accent-400">
                        <Phone size={16} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-concrete">
                          Phone
                        </p>
                        <a
                          href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                          className="mt-0.5 block font-medium text-primary-950 transition-colors hover:text-accent-600"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-primary-900 text-accent-400">
                        <Mail size={16} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-concrete">
                          Email
                        </p>
                        <a
                          href={`mailto:${email}`}
                          className="mt-0.5 block font-medium text-primary-950 transition-colors hover:text-accent-600"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-auto pt-8">
                <div className="flex items-start gap-3 border-t border-primary-200 pt-6">
                  <Clock size={18} className="mt-0.5 shrink-0 text-accent-500" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-concrete">
                      Office hours
                    </p>
                    <p className="mt-1 text-sm text-concrete-dark">{hours}</p>
                  </div>
                </div>

                <Button
                  as="a"
                  href={location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="accent"
                  size="lg"
                  className="mt-6 w-full"
                >
                  Get Directions
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
