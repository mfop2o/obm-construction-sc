import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Paperclip,
  Send,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Clock,
  FileCheck2,
  AlertCircle,
} from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import { FormField } from '../components/ui/FormField'
import Button from '../components/ui/Button'
import { useTranslation } from '../i18n'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useContactData } from '../lib/contentStore'
import { submitInquiry, type InquiryInput } from '../lib/inquiriesStore'

/* ============================================================================
   RequestQuote — public "Request a Quote" form.
   Collects project intent + optional file; posted to /api/inquiries.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const projectTypes = [
  'Commercial',
  'Residential',
  'Industrial',
  'Infrastructure / Roads',
  'Renovation & Fit-out',
  'Other',
]

const budgetRanges = [
  'Under $250k',
  '$250k–$1M',
  '$1M–$5M',
  '$5M–$10M',
  '$10M+',
  "Don't know yet",
]

const startTimelines = [
  'ASAP',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  'Longer / flexible',
]

type Values = {
  name: string
  company: string
  email: string
  phone: string
  projectType: string
  projectLocation: string
  budgetRange: string
  startTimeline: string
  message: string
  preferredContact: 'email' | 'phone'
  consent: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const EMPTY: Values = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  projectLocation: '',
  budgetRange: '',
  startTimeline: '',
  message: '',
  preferredContact: 'email',
  consent: false,
}

export default function RequestQuote() {
  const { t } = useTranslation()
  const contactInfo = useContactData()

  useDocumentMeta({
    title: t('requestQuote.title'),
    description: t('requestQuote.description'),
  })

  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [resultRef, setResultRef] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentError, setAttachmentError] = useState('')

  const validateField = (field: keyof Values, val: string | boolean): string | undefined => {
    if (field === 'name' && !String(val).trim()) {
      return t('requestQuote.validation.nameRequired') || t('requestQuote.validation.fieldRequired')
    }
    if (field === 'email') {
      const emailStr = String(val).trim()
      if (!emailStr) return t('requestQuote.validation.emailRequired') || t('requestQuote.validation.fieldRequired')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
        return t('requestQuote.validation.emailInvalid') || 'Please enter a valid email address.'
      }
    }
    if (field === 'message' && !String(val).trim()) {
      return t('requestQuote.validation.messageRequired') || t('requestQuote.validation.fieldRequired')
    }
    if (field === 'consent' && !val) {
      return t('requestQuote.validation.consentRequired') || t('requestQuote.validation.fieldRequired')
    }
    return undefined
  }

  const getFieldError = (field: keyof Values): string | undefined => {
    if (!touched[field]) return undefined
    return validateField(field, values[field])
  }

  const handleChange = (field: keyof Values, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: keyof Values) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError('')
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setAttachment(null)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError(t('requestQuote.attachmentSizeError') || 'Attachment must be 10 MB or smaller.')
      setAttachment(null)
      return
    }
    setAttachment(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')

    const allTouched: Partial<Record<keyof Values, boolean>> = {
      name: true,
      email: true,
      message: true,
      consent: true,
    }
    setTouched((prev) => ({ ...prev, ...allTouched }))

    const nameErr = validateField('name', values.name)
    const emailErr = validateField('email', values.email)
    const msgErr = validateField('message', values.message)
    const consentErr = validateField('consent', values.consent)

    if (nameErr || emailErr || msgErr || consentErr) {
      return
    }

    setStatus('submitting')
    try {
      const input: InquiryInput = {
        name: values.name.trim(),
        company: values.company.trim() || undefined,
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        project_type: values.projectType || undefined,
        project_location: values.projectLocation.trim() || undefined,
        budget_range: values.budgetRange || undefined,
        start_timeline: values.startTimeline || undefined,
        message: values.message.trim(),
        preferred_contact: values.preferredContact,
        consent: true,
        attachment: attachment ?? undefined,
      }
      const created = await submitInquiry(input)
      setResultRef(`#${created.id}`)
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : (t('requestQuote.errorMessage') || 'There was a problem submitting your inquiry. Please try again.')
      )
    }
  }

  useEffect(() => {
    if (status === 'success') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [status])

  return (
    <>
      <PageHero
        eyebrow={t('requestQuote.heroEyebrow')}
        title={t('requestQuote.heroTitle')}
        description={t('requestQuote.heroDescription')}
        breadcrumb={[
          { label: t('requestQuote.breadcrumbHome'), to: '/' },
          { label: t('requestQuote.breadcrumbRequestQuote') },
        ]}
      />

      <Section as="section" padding="lg" className="border-t border-primary-200/80 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            {/* Left Column: Benefits, Trust, and Direct Contact */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col"
            >
              <SectionHeading
                eyebrow={t('requestQuote.sectionEyebrow')}
                title={t('requestQuote.sectionTitle')}
                description={t('requestQuote.sectionDescription')}
              />

              {/* Benefit highlights */}
              <ul className="mt-10 space-y-5">
                <li className="flex items-start gap-4 rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-600">
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <p className="font-display font-bold text-primary-950">
                      {t('requestQuote.benefitTransparent')}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-concrete-dark">
                      {t('requestQuote.benefitTransparentDesc')}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Clock size={22} />
                  </span>
                  <div>
                    <p className="font-display font-bold text-primary-950">
                      {t('requestQuote.benefitFreeEstimate')}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-concrete-dark">
                      {t('requestQuote.benefitFreeEstimateDesc')}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Building size={22} />
                  </span>
                  <div>
                    <p className="font-display font-bold text-primary-950">
                      {t('requestQuote.benefitExpertTeam')}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-concrete-dark">
                      {t('requestQuote.benefitExpertTeamDesc')}
                    </p>
                  </div>
                </li>
              </ul>

              {/* Direct Support Card */}
              <div className="mt-8 rounded-2xl border border-primary-200/80 bg-primary-950 p-6 text-white shadow-lg">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-accent-400">
                  {t('contact.getInTouch') || 'Direct Commercial Desk'}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-white">
                  Need an urgent engineering consultation?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-primary-300">
                  {t('requestQuote.responseNote')}
                </p>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm sm:flex-row sm:items-center sm:gap-6">
                  {contactInfo.phone && (
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="inline-flex items-center gap-2 font-semibold text-accent-300 transition-colors hover:text-white"
                    >
                      <Phone size={15} />
                      <span>{contactInfo.phone}</span>
                    </a>
                  )}
                  {contactInfo.email && (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="inline-flex items-center gap-2 font-semibold text-accent-300 transition-colors hover:text-white"
                    >
                      <Mail size={15} />
                      <span>{contactInfo.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="rounded-2xl border border-primary-200/90 bg-surface p-5 shadow-xl shadow-primary-950/5 sm:p-7">
                <div className="flex items-center justify-between gap-3 border-b border-primary-100 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary-950">
                      {status === 'success'
                        ? t('requestQuote.successTitle')
                        : t('requestQuote.formHeading')}
                    </h2>
                    <p className="mt-1 text-xs text-concrete">
                      {status === 'success'
                        ? 'Keep your reference code for status updates.'
                        : 'Fill out the specifications below to receive an engineering proposal.'}
                    </p>
                  </div>
                  {status === 'success' && (
                    <span className="rounded-full bg-accent-400/20 px-3.5 py-1.5 font-mono text-xs font-bold text-accent-700">
                      {resultRef}
                    </span>
                  )}
                </div>

                {status === 'success' ? (
                  <div className="py-10 text-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-400 text-primary-950">
                      <Check size={28} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-primary-950">
                      {t('requestQuote.successTitle')}
                    </h3>
                    <p className="mt-3 max-w-md text-sm text-concrete-dark">
                      {t('requestQuote.successDescription')}
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold text-accent-700">
                      {resultRef}
                    </p>
                    <p className="mt-4 text-sm text-concrete-dark">
                      {t('requestQuote.successReference', { reference: resultRef })}
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      className="mt-8"
                      onClick={() => {
                        setValues(EMPTY)
                        setAttachment(null)
                        setTouched({})
                        setStatus('idle')
                      }}
                    >
                      {t('requestQuote.sendAnother')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="name"
                        label={t('requestQuote.name')}
                        required
                        value={values.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={getFieldError('name')}
                        placeholder={t('requestQuote.namePlaceholder')}
                      />
                      <FormField
                        id="company"
                        label={t('requestQuote.company')}
                        value={values.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        onBlur={() => handleBlur('company')}
                        placeholder={t('requestQuote.companyPlaceholder')}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="email"
                        label={t('requestQuote.email')}
                        type="email"
                        required
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        error={getFieldError('email')}
                        placeholder={t('requestQuote.emailPlaceholder')}
                      />
                      <FormField
                        id="phone"
                        label={t('requestQuote.phone')}
                        type="tel"
                        autoComplete="tel"
                        value={values.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        error={getFieldError('phone')}
                        placeholder={t('requestQuote.phonePlaceholder')}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="projectType"
                        label={t('requestQuote.projectType')}
                        select
                        selectOptions={projectTypes}
                        value={values.projectType}
                        onChange={(e) => handleChange('projectType', e.target.value)}
                        onBlur={() => handleBlur('projectType')}
                        error={getFieldError('projectType')}
                      />
                      <FormField
                        id="projectLocation"
                        label={t('requestQuote.projectLocation')}
                        value={values.projectLocation}
                        onChange={(e) => handleChange('projectLocation', e.target.value)}
                        onBlur={() => handleBlur('projectLocation')}
                        error={getFieldError('projectLocation')}
                        placeholder={t('requestQuote.projectLocationPlaceholder')}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        id="budgetRange"
                        label={t('requestQuote.budgetRange')}
                        select
                        selectOptions={budgetRanges}
                        value={values.budgetRange}
                        onChange={(e) => handleChange('budgetRange', e.target.value)}
                        onBlur={() => handleBlur('budgetRange')}
                      />
                      <FormField
                        id="startTimeline"
                        label={t('requestQuote.startTimeline')}
                        select
                        selectOptions={startTimelines}
                        value={values.startTimeline}
                        onChange={(e) => handleChange('startTimeline', e.target.value)}
                        onBlur={() => handleBlur('startTimeline')}
                      />
                    </div>

                    <FormField
                      id="message"
                      label={t('requestQuote.message')}
                      as="textarea"
                      required
                      rows={5}
                      value={values.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      error={getFieldError('message')}
                      placeholder={t('requestQuote.messagePlaceholder')}
                    />

                    {/* Preferred Contact Mode as Modern Toggle Pills */}
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-semibold text-primary-950">
                        {t('requestQuote.preferredContact')}
                      </legend>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        {(['email', 'phone'] as const).map((mode) => {
                          const active = values.preferredContact === mode
                          return (
                            <label
                              key={mode}
                              className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border p-3.5 text-sm font-semibold transition-all duration-200 ${
                                active
                                  ? 'border-accent-400 bg-accent-50/50 text-accent-700 shadow-sm'
                                  : 'border-primary-200 bg-white text-concrete-dark hover:border-primary-300 hover:text-primary-950'
                              }`}
                            >
                              <input
                                type="radio"
                                name="preferredContact"
                                value={mode}
                                checked={active}
                                onChange={() => handleChange('preferredContact', mode)}
                                className="sr-only"
                              />
                              {mode === 'email' ? <Mail size={16} /> : <Phone size={16} />}
                              <span>{t(`requestQuote.contactMode${mode === 'email' ? 'Email' : 'Phone'}`)}</span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>

                    {/* Architectural File Attachment Drop Area */}
                    <div>
                      <span className="text-sm font-semibold text-primary-950">
                        {t('requestQuote.attachment')}
                      </span>
                      {!attachment ? (
                        <label className="group mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-200/90 bg-primary-50/50 px-6 py-7 text-center transition-all duration-200 hover:border-accent-400 hover:bg-accent-50/20">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent-600 shadow-sm transition-transform duration-200 group-hover:scale-105">
                            <Paperclip size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-primary-950 group-hover:text-accent-600">
                              {t('requestQuote.chooseAttachment')}
                            </span>
                            <p className="mt-1 text-xs text-concrete">
                              {t('requestQuote.attachmentHint')}
                            </p>
                          </div>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={onPickFile}
                          />
                        </label>
                      ) : (
                        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-primary-200 bg-primary-50/80 p-3.5 shadow-sm">
                          <span className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-primary-950">
                            <FileCheck2 size={18} className="shrink-0 text-emerald-600" />
                            <span className="truncate">{attachment.name}</span>
                            <span className="shrink-0 text-xs font-normal text-concrete">
                              ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setAttachment(null)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-concrete transition-colors hover:bg-white hover:text-red-600"
                            aria-label={t('requestQuote.removeAttachment')}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {attachmentError && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                          <AlertCircle size={13} />
                          {attachmentError}
                        </p>
                      )}
                    </div>

                    {/* Consent Checkbox */}
                    <div className="rounded-xl border border-primary-100 bg-primary-50/40 p-4">
                      <label className="flex cursor-pointer items-start gap-3 text-sm text-concrete-dark">
                        <input
                          type="checkbox"
                          checked={values.consent}
                          onChange={(e) => handleChange('consent', e.target.checked)}
                          onBlur={() => handleBlur('consent')}
                          className="mt-1 h-4 w-4 rounded border-primary-300 accent-accent-500"
                        />
                        <span className="leading-snug">
                          {t('requestQuote.consent')}{' '}
                          <span className="text-red-600">*</span>
                        </span>
                      </label>
                      {getFieldError('consent') && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600">
                          <AlertCircle size={13} />
                          {getFieldError('consent')}
                        </p>
                      )}
                    </div>

                    {status === 'error' && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm"
                      >
                        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                        <div>
                          <p className="font-semibold">Submission failed</p>
                          <p className="mt-0.5 text-xs text-red-600">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full rounded-full font-display font-bold shadow-md transition-all duration-300 sm:w-auto"
                        disabled={status === 'submitting'}
                      >
                        {status === 'submitting' ? (
                          <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {t('requestQuote.submitting')}
                          </>
                        ) : (
                          <>
                            {t('requestQuote.submit')}
                            <Send size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}
