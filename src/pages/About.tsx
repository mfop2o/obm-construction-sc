import { motion } from 'framer-motion'
import { ArrowRight, Compass, Crosshair } from 'lucide-react'
import { Container, Section } from '../components/ui/Container'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { Photo } from '../components/ui/Photo'
import { aboutImages } from '../data/images'
import { cn } from '../lib/cn'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import {
  companyStory,
  mission,
  vision,
  coreValues,
  leadership,
  milestones,
} from '../data/about'

/* ============================================================================
   /about — the OBM Construction S.C. company story.
   Hero · Company story · Mission · Vision · Core values · Leadership/team ·
   Milestones · CTA — composed in a premium editorial rhythm.

   NOTE: All copy is clearly-marked placeholder from src/data/about.ts.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
}

export default function About() {
  useDocumentMeta({
    title: 'About Us | OBM Construction S.C.',
    description:
      'The story, mission, vision, values, leadership and milestones of OBM Construction S.C. — an Ethiopian construction company.',
  })

  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="A partner you can build on."
        description="OBM Construction S.C. — an Ethiopian construction company built on engineering discipline, safety and integrity."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      {/* ---------- Company story ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
              <SectionHeading
                eyebrow="Our Story"
                title="Built on discipline, delivered with integrity."
              />
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-concrete-dark">
                {companyStory.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Photography — OBM worksite */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="relative overflow-hidden border border-primary-200 bg-white"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Photo
                  src={aboutImages.build}
                  alt="OBM Construction worksite in Ethiopia"
                  className="h-full w-full"
                  noReveal
                />
              </div>
              <p className="border-t border-primary-200 px-5 py-3 text-xs uppercase tracking-[0.2em] text-concrete">
                OBM Construction worksite
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ---------- Mission ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div className="flex items-center gap-4 text-primary-900">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center bg-primary-900 text-accent-400">
                <Compass size={24} />
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-500">
                Our Mission
              </p>
            </div>
            <motion.blockquote
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="border-l-2 border-accent-400 pl-8"
            >
              <p className="font-display text-2xl font-semibold leading-snug text-primary-950 md:text-3xl">
                {mission}
              </p>
            </motion.blockquote>
          </div>
        </Container>
      </Section>

      {/* ---------- Vision (dark) ---------- */}
      <Section as="section" padding="lg" className="bg-primary-950 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center bg-accent-400 text-primary-950">
                <Crosshair size={24} />
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-400">
                Our Vision
              </p>
            </div>
            <motion.blockquote
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="border-l-2 border-accent-400 pl-8"
            >
              <p className="font-display text-2xl font-semibold leading-snug text-white md:text-3xl">
                {vision}
              </p>
            </motion.blockquote>
          </div>
        </Container>
      </Section>

      {/* ---------- Core values ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Core Values"
                title="Principles that hold every build together."
                description="Our values shape how we plan, how we build and how we treat every client and colleague."
              />
            </div>
            <div className="grid gap-px overflow-hidden border border-primary-200 bg-primary-200 sm:grid-cols-2">
              {coreValues.map((value, i) => (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="group bg-background p-7 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold tracking-[0.2em] text-accent-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-8 w-8 rounded-full border border-primary-200 transition-colors duration-300 group-hover:border-accent-400 group-hover:bg-accent-400" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-primary-950">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-concrete-dark">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- Leadership / team ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-white">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="The team behind the build."
            description="Led by experienced engineers and construction professionals."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((member, i) => (
              <motion.div
                key={`${member.name}-${i}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="group border border-primary-200 bg-background transition-colors duration-300 hover:border-primary-900"
              >
                {/* Portrait — set `photo` on the member in src/data/about.ts to show a real one */}
                <div
                  className={cn(
                    'relative flex aspect-[4/3] items-center justify-center overflow-hidden',
                    i % 2 === 0 ? 'bg-primary-900' : 'bg-primary-950',
                  )}
                >
                  {member.photo ? (
                    <Photo
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      className="h-full w-full"
                      noReveal
                    />
                  ) : (
                    <>
                      <span className="font-display text-5xl font-bold tracking-tight text-accent-400">
                        {initials(member.name)}
                      </span>
                      <span
                        className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.2em] text-white/40"
                        aria-hidden="true"
                      >
                        Photo placeholder
                      </span>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-primary-950">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.15em] text-concrete">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Milestones ---------- */}
      <Section as="section" padding="lg" className="border-t border-primary-200 bg-background">
        <Container size="md">
          <SectionHeading
            eyebrow="Milestones"
            title="Key moments in our journey."
            align="center"
          />
          <div className="relative mt-16">
            <span className="absolute left-4 top-0 h-full w-px bg-primary-200 md:left-1/2 md:-translate-x-px" />
            <div className="space-y-12">
              {milestones.map((m, i) => {
                const left = i % 2 === 0
                return (
                  <motion.div
                    key={`${m.year}-${i}`}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className={cn(
                      'relative pl-12 md:w-1/2 md:pl-0',
                      left
                        ? 'md:pr-14 md:text-right'
                        : 'md:ml-auto md:pl-14',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-4 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-400 bg-background',
                        'md:left-auto',
                        left
                          ? 'md:right-0 md:translate-x-1/2'
                          : 'md:left-0 md:-translate-x-1/2',
                      )}
                    />
                    <span className="font-display text-sm font-bold tracking-[0.25em] text-accent-500">
                      {m.year}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold text-primary-950">
                      {m.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-concrete-dark">
                      {m.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------- CTA ---------- */}
      <Section as="section" padding="xl" className="bg-primary-900 text-white">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
                <span className="inline-block h-px w-8 bg-accent-400" />
                Work With Us
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Let&rsquo;s build something that matters.
              </h2>
              <p className="mt-4 text-primary-300">
                Tell us about your project and our team will get back to you.
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
