import { useMemo, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, BriefcaseBusiness, CalendarClock, Check, MapPin, Paperclip, X } from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'
import { FormField } from '../components/ui/FormField'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'
import {
  getOpeningById,
  submitApplication,
  useOpeningsReady,
  type ApplicationInput,
} from '../lib/recruitmentStore'

/* ============================================================================
   /careers/:id — a single vacancy with its application form.

   A visitor without a vacancy in the URL can still apply: the position title
   is asked for directly, which is how speculative applications arrive.
   ========================================================================== */

/** The shared fade-and-rise reveal used across the page sections. */
const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const MAX_CV_BYTES = 8 * 1024 * 1024
const MAX_CERTIFICATES_BYTES = 10 * 1024 * 1024

const genders = ['Male', 'Female']

/** The validated fields of the application form, plus the derived position. */
type Field = keyof typeof EMPTY_FORM | 'consent' | 'position'
type Errors = Partial<Record<Field, string>>

const EMPTY_FORM = {
  full_name: '',
  gender: '',
  date_of_birth: '',
  phone: '',
  email: '',
  address: '',
  education: '',
  work_experience: '',
  skills: '',
  years_of_experience: '',
  cover_letter: '',
}

export default function OpeningDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const ready = useOpeningsReady()
  const { t } = useTranslation()

  const openingId = id ? Number(id) : undefined
  const opening = openingId && Number.isFinite(openingId) ? getOpeningById(openingId) : undefined

  useDocumentMeta({
    title: opening ? `${opening.title} | OBM Construction S.C.` : t('opening.applyNow'),
    description: opening?.blurb ?? t('opening.description'),
  })

  const [values, setValues] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState<Errors>({})
  const [consent, setConsent] = useState(false)
  const [cv, setCv] = useState<File | null>(null)
  const [certificates, setCertificates] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [receipt, setReceipt] = useState<{ application_number: string; position: string } | null>(null)

  /* The position title follows the vacancy (or ?position= for speculative
     applications) until the visitor edits it themselves. Deriving it during
     render keeps it correct once the vacancy list loads, without an effect. */
  const positionSeed = opening?.title ?? searchParams.get('position') ?? ''
  const [positionDraft, setPositionDraft] = useState('')
  const [positionEdited, setPositionEdited] = useState(false)
  const position = positionEdited ? positionDraft : positionSeed

  const closed = opening ? !opening.is_accepting_applications : false

  const fieldError = (field: Field) => touched[field]

  function set(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    setTouched((e) => ({ ...e, [field]: undefined }))
  }

  function setPosition(value: string) {
    setPositionEdited(true)
    setPositionDraft(value)
    setTouched((e) => ({ ...e, position: undefined }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!values.full_name.trim()) e.full_name = t('opening.validation.nameRequired')
    if (!values.phone.trim()) e.phone = t('opening.validation.phoneRequired')
    if (!values.email.trim()) e.email = t('opening.validation.emailRequired')
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      e.email = t('opening.validation.emailInvalid')
    }
    if (!position.trim()) e.position = t('opening.validation.positionRequired')
    if (!consent) e.consent = t('opening.validation.consentRequired')
    setTouched(e)
    return Object.keys(e).length === 0
  }

  function pickCv(file: File | null) {
    setFileError('')
    if (!file) return setCv(null)
    if (file.size > MAX_CV_BYTES) {
      setFileError(t('opening.validation.cvTooLarge'))
      return setCv(null)
    }
    setCv(file)
  }

  function pickCertificates(file: File | null) {
    setFileError('')
    if (!file) return setCertificates(null)
    if (file.size > MAX_CERTIFICATES_BYTES) {
      setFileError(t('opening.validation.certificatesTooLarge'))
      return setCertificates(null)
    }
    setCertificates(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cv) {
      setFileError(t('opening.validation.cvRequired'))
      return
    }
    if (!validate()) return

    setStatus('submitting')
    setFileError('')
    try {
      const input: ApplicationInput = {
        opening_id: opening?.id,
        position_applied_for: position.trim(),
        full_name: values.full_name.trim(),
        gender: values.gender || undefined,
        date_of_birth: values.date_of_birth || undefined,
        phone: values.phone.trim(),
        email: values.email.trim(),
        address: values.address.trim() || undefined,
        education: values.education.trim() || undefined,
        work_experience: values.work_experience.trim() || undefined,
        skills: values.skills.trim() || undefined,
        years_of_experience: values.years_of_experience
          ? Number(values.years_of_experience)
          : undefined,
        cover_letter: values.cover_letter.trim() || undefined,
        consent: true,
        cv,
        certificates: certificates ?? undefined,
      }
      const created = await submitApplication(input)
      setReceipt({
        application_number: created.application_number,
        position: created.position_applied_for,
      })
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
    }
  }

  const bullets = useMemo(() => splitLines(opening?.qualification ?? ''), [opening?.qualification])
  const duties = useMemo(
    () => splitLines(opening?.responsibilities ?? ''),
    [opening?.responsibilities],
  )

  if (ready && id && !opening) {
    return (
      <Section as="section" padding="lg" className="bg-background">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('opening.notFound')}
          </h1>
          <p className="mt-3 text-concrete-dark">{t('opening.notFoundDesc')}</p>
          <Button as="link" to="/careers" className="mt-8">
            {t('opening.backToCareers')}
          </Button>
        </Container>
      </Section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={t('opening.heroEyebrow')}
        title={opening?.title ?? t('opening.applyNow')}
        description={opening?.blurb ?? t('opening.description')}
        breadcrumb={[
          { label: t('opening.breadcrumbHome'), to: '/' },
          { label: t('opening.breadcrumbCareers'), to: '/careers' },
          ...(opening ? [{ label: opening.title }] : []),
        ]}
      />

      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-concrete-dark hover:text-accent-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('opening.backToCareers')}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_minmax(0,26rem)]">
            {/* ---- Vacancy detail ---- */}
            <div>
              {opening && (
                <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-concrete-dark">
                  {opening.department && (
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('opening.department')}</dt>
                      <dd>{opening.department}</dd>
                    </div>
                  )}
                  {opening.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('opening.location')}</dt>
                      <dd>{opening.location}</dd>
                    </div>
                  )}
                  {opening.type && (
                    <div>
                      <dt className="sr-only">{t('opening.type')}</dt>
                      <dd>{opening.type}</dd>
                    </div>
                  )}
                  {opening.experience_years !== null && (
                    <div>
                      <dt className="sr-only">{t('opening.experience')}</dt>
                      <dd>
                        {t('opening.experienceValue', {
                          years: opening.experience_years,
                        })}
                      </dd>
                    </div>
                  )}
                  {opening.deadline && (
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" aria-hidden="true" />
                      <dt className="sr-only">{t('opening.deadline')}</dt>
                      <dd>{t('opening.deadlineValue', { date: opening.deadline })}</dd>
                    </div>
                  )}
                </dl>
              )}

              {closed && (
                <p className="mt-6 border-l-2 border-accent-500 bg-accent-50 px-4 py-3 text-sm font-medium text-primary-900">
                  {t('opening.closedNotice')}
                </p>
              )}

              {bullets.length > 0 && (
                <DetailSection title={t('opening.qualifications')}>
                  <BulletList items={bullets} />
                </DetailSection>
              )}

              {duties.length > 0 && (
                <DetailSection title={t('opening.responsibilities')}>
                  <BulletList items={duties} />
                </DetailSection>
              )}

              {!opening && (
                <div className="border-l-2 border-accent-400 bg-surface p-5">
                  <h2 className="font-display text-lg font-semibold text-primary-950">
                    {t('opening.speculativeTitle')}
                  </h2>
                  <p className="mt-2 text-sm text-concrete-dark">
                    {t('opening.speculativeDescription')}
                  </p>
                </div>
              )}
            </div>

            {/* ---- Application form ---- */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              {status === 'success' && receipt ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-primary-100 bg-surface p-7"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-400 text-primary-950">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-bold text-primary-950">
                    {t('opening.successTitle')}
                  </h2>
                  <p className="mt-3 text-sm text-concrete-dark">
                    {t('opening.successDescription')}
                  </p>
                  <dl className="mt-5 border-t border-primary-100 pt-5 text-sm">
                    <dt className="text-concrete">{t('opening.successPosition')}</dt>
                    <dd className="mt-1 font-medium text-primary-950">{receipt.position}</dd>
                    <dt className="mt-4 text-concrete">
                      {t('opening.successReference')}
                    </dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-primary-950">
                      {receipt.application_number}
                    </dd>
                  </dl>
                  <Button as="link" to="/careers" variant="outline" className="mt-7">
                    {t('opening.backToCareers')}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  variants={reveal}
                  initial="hidden"
                  animate="show"
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5 border border-primary-100 bg-surface p-7"
                >
                  <h2 className="font-display text-xl font-bold text-primary-950">
                    {t('opening.formTitle')}
                  </h2>

                  {status === 'error' && (
                    <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {t('opening.errorMessage')}
                    </p>
                  )}

                  <FormField
                    id="position"
                    label={t('opening.position')}
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    error={fieldError('position')}
                  />
                  <FormField
                    id="full_name"
                    label={t('opening.fullName')}
                    required
                    autoComplete="name"
                    value={values.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                    error={fieldError('full_name')}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="gender"
                      label={t('opening.gender')}
                      select
                      selectOptions={genders}
                      value={values.gender}
                      onChange={(e) => set('gender', e.target.value)}
                    />
                    <FormField
                      id="date_of_birth"
                      label={t('opening.dateOfBirth')}
                      type="text"
                      value={values.date_of_birth}
                      onChange={(e) => set('date_of_birth', e.target.value)}
                      hint={t('opening.dateOfBirthHint')}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="phone"
                      label={t('opening.phone')}
                      type="tel"
                      required
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      error={fieldError('phone')}
                    />
                    <FormField
                      id="email"
                      label={t('opening.email')}
                      type="email"
                      required
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => set('email', e.target.value)}
                      error={fieldError('email')}
                    />
                  </div>
                  <FormField
                    id="address"
                    label={t('opening.address')}
                    as="textarea"
                    rows={2}
                    value={values.address}
                    onChange={(e) => set('address', e.target.value)}
                  />
                  <FormField
                    id="education"
                    label={t('opening.education')}
                    as="textarea"
                    rows={3}
                    value={values.education}
                    onChange={(e) => set('education', e.target.value)}
                  />
                  <FormField
                    id="work_experience"
                    label={t('opening.workExperience')}
                    as="textarea"
                    rows={3}
                    value={values.work_experience}
                    onChange={(e) => set('work_experience', e.target.value)}
                  />
                  <FormField
                    id="skills"
                    label={t('opening.skills')}
                    as="textarea"
                    rows={2}
                    value={values.skills}
                    onChange={(e) => set('skills', e.target.value)}
                  />
                  <FormField
                    id="years_of_experience"
                    label={t('opening.yearsOfExperience')}
                    type="text"
                    value={values.years_of_experience}
                    onChange={(e) => set('years_of_experience', e.target.value)}
                  />
                  <FormField
                    id="cover_letter"
                    label={t('opening.coverLetter')}
                    as="textarea"
                    rows={4}
                    value={values.cover_letter}
                    onChange={(e) => set('cover_letter', e.target.value)}
                  />

                  <FileInput
                    id="cv"
                    label={t('opening.cv')}
                    required
                    accept=".pdf,.doc,.docx"
                    file={cv}
                    hint={t('opening.cvHint')}
                    removeLabel={t('opening.removeFile')}
                    onPick={pickCv}
                    onClear={() => setCv(null)}
                  />

                  <FileInput
                    id="certificates"
                    label={t('opening.certificates')}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    file={certificates}
                    hint={t('opening.certificatesHint')}
                    removeLabel={t('opening.removeFile')}
                    onPick={pickCertificates}
                    onClear={() => setCertificates(null)}
                  />

                  {fileError && (
                    <p className="text-sm font-medium text-red-600">{fileError}</p>
                  )}

                  <label className="flex items-start gap-3 text-sm text-concrete-dark">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-accent-500"
                    />
                    <span>
                      {t('opening.consent')}{' '}
                      <span className="text-red-600">*</span>
                    </span>
                  </label>
                  {fieldError('consent') && (
                    <p className="text-sm font-medium text-red-600">{fieldError('consent')}</p>
                  )}

                  <Button type="submit" disabled={status === 'submitting' || closed}>
                    {status === 'submitting'
                      ? t('opening.submitting')
                      : closed
                        ? t('opening.closed')
                        : t('opening.submit')}
                  </Button>
                </motion.form>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

/** Split a stored block of text into list items, one per non-empty line. */
function splitLines(value: string): string[] {
  return value
    .split(/\r?\n|;/)
    .map((line) => line.replace(/^[-*\u2022]\s*/, '').trim())
    .filter(Boolean)
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="mt-10"
    >
      <h2 className="font-display text-xl font-bold text-primary-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-primary-800">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function FileInput({
  id,
  label,
  required,
  accept,
  file,
  hint,
  removeLabel,
  onPick,
  onClear,
}: {
  id: string
  label: string
  required?: boolean
  accept: string
  file: File | null
  hint: string
  removeLabel: string
  onPick: (file: File | null) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-primary-900">
        {label}
        {required && (
          <span className="ml-1 text-accent-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {file ? (
        <div className="flex items-center justify-between gap-3 border border-primary-200 bg-primary-50 px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-primary-950">
            <Paperclip size={16} className="shrink-0 text-accent-500" aria-hidden="true" />
            <span className="truncate">{file.name}</span>
          </span>
          <button
            type="button"
            onClick={onClear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-concrete hover:bg-primary-100 hover:text-red-600"
            aria-label={removeLabel}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-primary-900 file:mr-3 file:rounded-sm file:border-0 file:bg-primary-100 file:px-4 file:py-3 file:text-sm file:font-medium file:text-primary-900 hover:file:bg-primary-200"
        />
      )}
      <p className="text-xs text-concrete">{hint}</p>
    </div>
  )
}