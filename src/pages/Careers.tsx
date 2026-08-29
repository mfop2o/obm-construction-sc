import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Briefcase, Clock } from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { ProjectVisual } from '../components/projects/ProjectVisual'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import {
  openings,
  careersValues,
  careersBenefits,
} from '../data/careers'

/* ============================================================================
   /careers — join the OBM Construction S.C. team.
   Editorial hero → intro/values → open roles → benefits → CTA.
   All copy is clearly-marked placeholder from src/data/careers.ts.
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
  useDocumentMeta({
    title: 'Careers | OBM Construction S.C.',
    description:
      'Explore open roles and a career at OBM Construction S.C. — an Ethiopian construction company built on safety, quality and integrity.',
  })

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career in construction."
        description="Join a team that shapes Ethiopia&rsquo;s built environment with safety, quality and integrity."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
      />

      {/* ---- Intro / values ---- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
              <SectionHeading
                eyebrow="Why OBM"
                title="Work that shows up in the skyline."
                description="We&rsquo;re growing our team of engineers, project leaders and site professionals who are proud of what they build."
              />
              <div className="mt-8 space-y-5">
                {careersValues.map((value, i) => (
                  <motion.div
                    key={value.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08 }}
                    className="border-l-2 border-accent-400 pl-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-primary-950">
                      {value.title}
                    </h3>
                    <p className="mt-1 max-w-md text-concrete-dark">
                      {value.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="relative overflow-hidden border border-primary-200 bg-white"
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
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-white">
        <Container>
          <SectionHeading
            eyebrow="Open Positions"
            title="Current opportunities."
            description="We&rsquo;re looking for people who take pride in doing the job properly."
          />
          <div className="mt-12 grid gap-px overflow-hidden border border-primary-200 bg-primary-200 lg:grid-cols-2">
            {openings.map((role, i) => (
              <motion.article
                key={role.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="group flex flex-col justify-between bg-background p-8 transition-colors duration-300 hover:bg-primary-50"
              >
                <div>
                  <p className="font-display text-sm font-bold tracking-[0.2em] text-accent-500">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-primary-950">
                    {role.title}
                  </h3>
                  <p className="mt-2 max-w-md text-concrete-dark">{role.blurb}</p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-concrete-dark">
                  <span className="inline-flex items-center gap-2">
                    <Briefcase size={15} className="text-accent-500" />
                    {role.department}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-accent-500" />
                    {role.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={15} className="text-accent-500" />
                    {role.type}
                  </span>
                </div>

                <div className="mt-8">
                  <Button
                    as="link"
                    to="/contact"
                    variant="link"
                    className="font-display group-hover:text-accent-500"
                  >
                    Apply for this role
                    <ArrowRight size={18} />
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
              eyebrow="What We Offer"
              title="Rewarded for doing it right."
              description="We invest in the people who build for us."
            />
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {careersBenefits.map((benefit) => (
                <motion.p
                  key={benefit}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex items-start gap-3 border-b border-primary-200 pb-4 font-display text-base font-medium text-primary-950"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 bg-accent-400" />
                  {benefit}
                </motion.p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- CTA ---- */}
      <Section as="section" padding="xl" className="bg-primary-900 text-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
                <span className="inline-block h-px w-8 bg-accent-400" />
                Don&rsquo;t see your role?
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                We&rsquo;re always looking for great people.
              </h2>
              <p className="mt-4 text-primary-300">
                Send us your CV and tell us how you&rsquo;d contribute to the
                build.
              </p>
            </div>
            <Button as="link" to="/contact" variant="accent" size="lg">
              Get in Touch
              <ArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
