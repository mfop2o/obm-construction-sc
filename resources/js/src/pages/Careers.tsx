import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Briefcase, Clock, Check } from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { ProjectVisual } from '../components/projects/ProjectVisual'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCareersData } from '../lib/contentStore'
import { useTranslation } from '../i18n'

/* ============================================================================
   /careers — join the OBM Construction S.C. team.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Careers() {
  const careers = useCareersData()
  const { openings, values: careersValues, benefits: careersBenefits } = careers
  const { t } = useTranslation()

  useDocumentMeta({
    title: t('careers.title'),
    description: t('careers.description'),
  })

  return (
    <>
      <PageHero
        eyebrow={t('careers.heroEyebrow')}
        title={t('careers.heroTitle')}
        description={t('careers.heroDescription')}
        breadcrumb={[{ label: t('careers.breadcrumbHome'), to: '/' }, { label: t('careers.breadcrumbCareers') }]}
      />

      {/* ---- Intro / values ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
              <SectionHeading
                eyebrow={t('careers.whyObmEyebrow')}
                title={t('careers.whyObmTitle')}
                description={t('careers.whyObmDescription')}
              />
              <div className="mt-8 space-y-4">
                {careersValues.map((value, i) => (
                  <motion.div
                    key={value.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08 }}
                    className="group flex gap-4 border border-primary-200 bg-surface p-5 shadow-sm transition-all duration-300 hover:border-accent-400 hover:shadow-md"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary-900 font-display text-sm font-bold text-accent-400 transition-colors duration-300 group-hover:bg-accent-400 group-hover:text-primary-950">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-primary-900">
                        {value.title}
                      </h3>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-concrete-dark">
                        {value.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="relative overflow-hidden border border-primary-200 bg-surface"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <ProjectVisual
                  visual="crane"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="border-t border-primary-200 px-5 py-3 text-xs uppercase tracking-[0.2em] text-concrete">
                Photography placeholder — our teams on site
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ---- Open roles ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-surface">
        <Container>
          <SectionHeading
            eyebrow={t('careers.openPositionsEyebrow')}
            title={t('careers.openPositionsTitle')}
            description={t('careers.openPositionsDescription')}
            align="center"
          />
          <div className="mx-auto mt-10 grid w-full max-w-4xl gap-5 sm:grid-cols-2">
            {openings.map((role, i) => (
              <motion.article
                key={role.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="group flex flex-col border border-primary-200 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xs font-bold tracking-[0.2em] text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-400">
                    <Clock size={12} />
                    {role.type}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-primary-950">
                  {role.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-concrete-dark">
                  {role.blurb}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-concrete-dark">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={13} className="text-accent-500" />
                    {role.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-accent-500" />
                    {role.location}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-primary-200 pt-4">
                  <span className="text-xs font-medium text-concrete">
                    {t('careers.fullDetails')}
                  </span>
                  <Button
                    as="link"
                    to="/contact"
                    variant="link"
                    size="sm"
                    className="font-display group-hover:text-accent-500"
                  >
                    {t('careers.apply')}
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- Benefits ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow={t('careers.benefitsEyebrow')}
              title={t('careers.benefitsTitle')}
              description={t('careers.benefitsDescription')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {careersBenefits.map((benefit) => (
                <motion.div
                  key={benefit.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex items-start gap-4 rounded-sm border border-primary-200 bg-surface p-5 shadow-sm transition-all duration-300 hover:border-accent-400 hover:shadow-md"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-accent-400/15 text-accent-600">
                    <Check size={18} strokeWidth={2.25} />
                  </span>
                  <p className="font-display text-base font-medium leading-snug text-primary-950">
                    {benefit.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

    </>
  )
}
