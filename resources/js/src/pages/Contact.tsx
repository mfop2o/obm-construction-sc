import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
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
import { useContactData } from '../lib/contentStore'
import { headOffice, projectTypes } from '../data/contact'
import { OfficeLocationSection } from '../components/contact/OfficeLocationSection'
import { cn } from '../lib/cn'
import { useTranslation } from '../i18n'

/* ============================================================================
   /contact — premium corporate contact experience for OBM Construction S.C.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
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
  const { settings: contactInfo, offices } = useContactData()
  const { t } = useTranslation()

  useDocumentMeta({
    title: t('contact.title'),
    description: t('contact.description'),
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
        eyebrow={t('contact.heroEyebrow')}
        title={t('contact.heroTitle')}
        description={t('contact.heroDescription')}
        breadcrumb={[{ label: t('contact.breadcrumbHome'), to: '/' }, { label: t('contact.breadcrumbContact') }]}
      />

      {/* ---------- Contact block + form ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            {/* Left — company contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col"
            >
              <SectionHeading
                eyebrow={t('contact.getInTouch')}
                title={t('contact.speakWithTeam')}
                description={t('contact.responseTime')}
              />

              <div className="mt-10 space-y-6">
                <DetailRow icon={<Phone size={18} />} label={t('contact.phone')}>
                  <a
                    href="tel:+251110000000"
                    className="transition-colors hover:text-accent-500"
                  >
                    {contactInfo.phone}
                  </a>
                </DetailRow>
                <DetailRow icon={<Mail size={18} />} label={t('contact.email')}>
                  <a
                    href="mailto:info@obmconstruction.com"
                    className="transition-colors hover:text-accent-500"
                  >
                    {contactInfo.email}
                  </a>
                </DetailRow>
                <DetailRow icon={<MapPin size={18} />} label={t('contact.headOffice')}>
                  <address className="font-display not-italic">
                    {contactInfo.address_line_1}
                    {contactInfo.address_line_2
                      ? `, ${contactInfo.address_line_2}`
                      : ''}
                  </address>
                </DetailRow>
              </div>

              <div className="mt-10 border-t border-primary-200 pt-6">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 text-accent-500" />
                  <p className="text-sm leading-relaxed text-concrete-dark">
                    <span className="font-medium text-primary-900">
                      {t('contact.officeHours')}
                    </span>
                    <br />
                    {t('contact.officeHoursText')}
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
              <div className="border border-primary-200 bg-surface p-6 sm:p-10">
                {isSuccess ? (
                  <div
                    role="status"
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-400 text-primary-950">
                      <Check size={28} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-primary-950">
                      {t('contact.successHeading')}
                    </h3>
                    <p className="mt-3 max-w-md text-concrete-dark">
                      {t('contact.successMessage', { name: values.name || 'friend' })}
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      className="mt-8"
                      onClick={reset}
                    >
                      {t('contact.sendAnother')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <h2 className="font-display text-xl font-semibold text-primary-950">
                      {t('contact.formHeading')}
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="name"
                        label={t('contact.fullName')}
                        type="text"
                        autoComplete="name"
                        required
                        value={values.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={showError('name')}
                        placeholder={t('contact.namePlaceholder')}
                      />
                      <FormField
                        id="email"
                        label={t('contact.emailAddress')}
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        error={showError('email')}
                        placeholder={t('contact.emailPlaceholder')}
                      />
                    </div>

                    <FormField
                      id="phone"
                      label={t('contact.phoneField')}
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      error={showError('phone')}
                      hint={t('contact.phoneHint')}
                      placeholder={t('contact.phonePlaceholder')}
                    />

                    <FormField
                      id="projectType"
                      label={t('contact.projectType')}
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
                      label={t('contact.messageField')}
                      as="textarea"
                      required
                      rows={6}
                      value={values.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      error={showError('message')}
                      placeholder={t('contact.messagePlaceholder')}
                    />

                    {isError && (
                      <div
                        role="alert"
                        className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {t('contact.errorMessage')}
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
                          {t('contact.sending')}
                        </>
                      ) : (
                        <>
                          {t('contact.sendButton')}
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
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow={t('contact.locationsEyebrow')}
              title={t('contact.locationsTitle')}
              description={t('contact.locationsDescription')}
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
                    'flex flex-col border border-primary-200 bg-background p-6',
                    i === 0 && 'sm:col-span-2 lg:col-span-1',
                  )}
                >
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-primary-950">
                    <MapPin size={18} className="text-accent-500" />
                    {office.name}
                  </h3>
                  <address className="mt-4 space-y-1 not-italic text-concrete-dark">
                    {office.address && <p>{office.address}</p>}
                    {office.city && <p>{office.city}</p>}
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

      {/* ---------- Interactive office map + Get Directions ---------- */}
      <OfficeLocationSection
        location={headOffice}
        phone={contactInfo.phone}
        email={contactInfo.email}
      />

    </>
  )
}
