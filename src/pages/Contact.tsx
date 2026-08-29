import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useContactForm } from '../hooks/useContactForm'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { contactInfo, offices, projectTypes } from '../data/contact'
import { cn } from '../lib/cn'

/* ============================================================================
   /contact — premium corporate contact experience for OBM Construction S.C.
   Editorial heading, company contact block, a validated/accessible form,
   offices and a map placeholder. All contact data is clearly-marked
   placeholder from src/data/contact.ts.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ---- Map placeholder (brand-toned SVG; swap for an embedded map) --------- */
function MapPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Map placeholder showing OBM office location"
      className="relative h-full w-full overflow-hidden border border-primary-200 bg-background"
    >
      <svg
        viewBox="0 0 800 460"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {/* street grid */}
        <g stroke="#101820" strokeOpacity="0.08" strokeWidth="1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2="460" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 90} x2="800" y2={i * 90} />
          ))}
        </g>
        {/* main avenue */}
        <path d="M0 210 C 200 190, 300 230, 800 180" stroke="#D99A2B" strokeOpacity="0.35" strokeWidth="6" />
        <path d="M380 0 C 360 160, 440 300, 400 460" stroke="#D99A2B" strokeOpacity="0.35" strokeWidth="5" />
        {/* lots */}
        <rect x="250" y="90" width="110" height="70" fill="#101820" fillOpacity="0.05" stroke="#101820" strokeOpacity="0.1" />
        <rect x="40" y="250" width="130" height="80" fill="#101820" fillOpacity="0.05" stroke="#101820" strokeOpacity="0.1" />
        <rect x="520" y="120" width="140" height="80" fill="#101820" fillOpacity="0.05" stroke="#101820" strokeOpacity="0.1" />
        {/* marker */}
        <g>
          <path
            d="M400 150 C 400 120 430 120 430 150 C 430 168 415 180 415 180 L 415 196 M415 180 C 415 180 400 168 400 150"
            stroke="#D99A2B"
            strokeWidth="5"
            fill="none"
          />
          <circle cx="415" cy="150" r="12" fill="#101820" stroke="#D99A2B" strokeWidth="4" />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-5">
        <span className="bg-primary-950/85 px-3 py-1.5 font-display text-xs uppercase tracking-[0.2em] text-white">
          Head Office — Addis Ababa
        </span>
        <span className="bg-white/85 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-concrete">
          Map placeholder
        </span>
      </div>
    </div>
  )
}

/* ---- Contact detail row -------------------------------------------------- */
function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center bg-primary-900 text-accent-400">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-concrete">
          {label}
        </p>
        <div className="mt-1 font-display text-lg font-semibold text-primary-950">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  useDocumentMeta({
    title: 'Contact Us | OBM Construction S.C.',
    description:
      'Get in touch with the OBM Construction team to discuss your next project. Reach us by phone, email or our contact form.',
  })

  const {
    values,
    errors,
    touched,
    status,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useContactForm()

  const showError = (field: keyof typeof errors) =>
    touched[field] ? errors[field] : undefined

  const isSuccess = status === 'success'
  const isError = status === 'error'

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let&rsquo;s talk about your project."
        description="Whether you have a specific build in mind or you&rsquo;re exploring possibilities, our team is ready to listen."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      {/* ---------- Contact block + form ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* Left — company contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col"
            >
              <SectionHeading
                eyebrow="Get in Touch"
                title="Speak with our team."
                description="We respond to every enquiry personally — typically within one business day."
              />

              <div className="mt-12 space-y-8">
                <DetailRow icon={<Phone size={18} />} label="Phone">
                  <a
                    href="tel:+251110000000"
                    className="transition-colors hover:text-accent-500"
                  >
                    {contactInfo.phone}
                  </a>
                </DetailRow>
                <DetailRow icon={<Mail size={18} />} label="Email">
                  <a
                    href="mailto:info@obmconstruction.com"
                    className="transition-colors hover:text-accent-500"
                  >
                    {contactInfo.email}
                  </a>
                </DetailRow>
                <DetailRow icon={<MapPin size={18} />} label="Head Office">
                  <address className="font-display not-italic">
                    {contactInfo.addressLine1},{' '}
                    {contactInfo.addressLine2}
                  </address>
                </DetailRow>
              </div>

              <div className="mt-12 border-t border-primary-200 pt-8">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 text-accent-500" />
                  <p className="text-sm leading-relaxed text-concrete-dark">
                    <span className="font-medium text-primary-900">
                      Office hours
                    </span>
                    <br />
                    Monday – Friday, 8:30 – 17:30 (EAT)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="border border-primary-200 bg-white p-6 sm:p-10">
                {isSuccess ? (
                  <div
                    role="status"
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-400 text-primary-950">
                      <Check size={28} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-primary-950">
                      Message sent
                    </h3>
                    <p className="mt-3 max-w-md text-concrete-dark">
                      Thank you, {values.name || 'friend'}. Our team will be in
                      touch within one business day.
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      className="mt-8"
                      onClick={reset}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <h2 className="font-display text-xl font-semibold text-primary-950">
                      Send a message
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="name"
                        label="Full name"
                        type="text"
                        autoComplete="name"
                        required
                        value={values.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={showError('name')}
                        placeholder="Your name"
                      />
                      <FormField
                        id="email"
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        error={showError('email')}
                        placeholder="you@example.com"
                      />
                    </div>

                    <FormField
                      id="phone"
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      error={showError('phone')}
                      hint="Optional — include country code."
                      placeholder="+251 ..."
                    />

                    <FormField
                      id="projectType"
                      label="Project type"
                      select
                      selectOptions={projectTypes}
                      required
                      value={values.projectType}
                      onChange={(e) =>
                        handleChange('projectType', e.target.value)
                      }
                      onBlur={() => handleBlur('projectType')}
                      error={showError('projectType')}
                    />

                    <FormField
                      id="message"
                      label="Message"
                      as="textarea"
                      required
                      rows={6}
                      value={values.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      error={showError('message')}
                      placeholder="Tell us about your project — scope, location, timeline and any requirements."
                    />

                    {isError && (
                      <div
                        role="alert"
                        className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        There was a problem sending your message. Please try
                        again or contact us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-950 border-t-transparent" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ---------- Offices / location ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="Our Locations"
              title="Where you can reach us."
              description="Our team is based in Addis Ababa and engaged on projects across Ethiopia."
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {offices.map((office, i) => (
                <motion.div
                  key={office.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className={cn(
                    'flex flex-col border border-primary-200 bg-background p-7',
                    i === 0 && 'sm:col-span-2 lg:col-span-1',
                  )}
                >
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-primary-950">
                    <MapPin size={18} className="text-accent-500" />
                    {office.name}
                  </h3>
                  <address className="mt-4 space-y-1 not-italic text-concrete-dark">
                    {office.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                  <div className="mt-4 space-y-1 border-t border-primary-200 pt-4 text-sm">
                    <p className="flex items-center gap-2 text-concrete-dark">
                      <Phone size={14} className="text-accent-500" />
                      {office.phone}
                    </p>
                    <a
                      href={`mailto:${office.email}`}
                      className="flex items-center gap-2 text-concrete-dark transition-colors hover:text-accent-500"
                    >
                      <Mail size={14} className="text-accent-500" />
                      {office.email}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- Map placeholder ---------- */}
      <Section as="section" padding="md" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="h-[380px] sm:h-[440px] lg:h-[480px]">
            <MapPlaceholder />
          </div>
        </Container>
      </Section>

      {/* ---------- CTA ---------- */}
      <Section as="section" padding="xl" className="bg-primary-950 text-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
                <span className="inline-block h-px w-8 bg-accent-400" />
                Start the Conversation
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Ready to build what matters?
              </h2>
              <p className="mt-4 text-primary-300">
                Explore our services or recent work while you wait to hear back.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as="link" to="/services" variant="accent" size="lg">
                Our Services
                <ArrowRight size={18} />
              </Button>
              <Button
                as="link"
                to="/projects"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white hover:text-primary-950"
              >
                View Projects
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
