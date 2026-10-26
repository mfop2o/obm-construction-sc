import { motion } from 'framer-motion'
import { ShieldCheck, Zap, HeartHandshake, Leaf } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import { useTranslation } from '../../i18n'

/* ============================================================================
   WhyOBM — dark value-proposition band.

   Color rules on bg-primary-950:
     eyebrow      text-accent-400   font-bold uppercase tracking-[0.32em]
     h2           text-white        font-bold uppercase leading-[0.95]
     body         text-primary-300  (#a3b0ba — readable, warm-neutral)
     metric value text-white        font-black
     metric label text-primary-400  (one step darker than body — subdued)
     row # label  text-accent-400/50 (decorative index — muted)
     row title    text-white → text-accent-300 on hover
     row body     text-primary-300   (same as global dark-bg body)
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Engineering Integrity & ISO-Grade Standards',
    desc: 'Every foundation, structural frame, and concrete pour adheres strictly to international and Ethiopian building codes with certified QA/QC inspection.',
    tag: 'QA/QC Certified',
  },
  {
    icon: Zap,
    title: 'Predictable Timelines & Critical Path Delivery',
    desc: 'Advanced CPM scheduling, modern heavy machinery, and disciplined site management eliminate downtime and prevent costly project delays.',
    tag: 'CPM Scheduling',
  },
  {
    icon: HeartHandshake,
    title: 'Comprehensive Design-Build Capabilities',
    desc: 'Seamless single-source execution connecting geotechnical surveys and architectural design with structural engineering and turnkey MEP finishing.',
    tag: 'Turnkey Delivery',
  },
  {
    icon: Leaf,
    title: 'Sustainable Construction & Generational Durability',
    desc: 'Environmentally responsible methodologies, ethical local material sourcing, and structures engineered to perform for decades.',
    tag: 'Built to Last',
  },
]

export default function WhyOBM() {
  const { t } = useTranslation()

  return (
    <Section as="section" padding="xl" className="relative overflow-hidden bg-primary-950 text-white">
      {/* Ambient background light */}
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-accent-400/[0.04] blur-[140px]" aria-hidden="true" />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* ── Left: sticky heading ──────────────────────────────────── */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em] text-accent-400"
            >
              <span className="inline-block h-px w-8 bg-accent-400" aria-hidden="true" />
              {t('careers.whyObmEyebrow') || 'Why OBM'}
            </motion.p>

            <motion.h2
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.06 }}
              className="mt-5 font-display text-3xl font-bold uppercase leading-[0.98] tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Built on discipline, delivered with integrity.
            </motion.h2>

            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-base leading-[1.75] text-primary-300 sm:text-[17px]"
            >
              For over two decades, OBM Construction S.C. has delivered landmark commercial towers, civil infrastructure, and residential communities with engineering rigor, safety, and unwavering accountability.
            </motion.p>

            {/* Metric badges */}
            <motion.div
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.18 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <div className="flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm sm:px-6">
                <span className="font-display text-3xl font-black leading-none text-white sm:text-4xl">98%</span>
                <span className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-400">
                  Client Retention Rate
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm sm:px-6">
                <span className="font-display text-3xl font-black leading-none text-white sm:text-4xl">Certified</span>
                <span className="mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-400">
                  General Contractor
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Right: values list ────────────────────────────────────── */}
          <div className="border-t border-white/[0.08]">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={i}
                  variants={item}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex items-start gap-6 border-b border-white/[0.08] py-8 transition-colors duration-200 hover:bg-white/[0.02] md:gap-8 md:px-4"
                >
                  {/* Icon container */}
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-inner transition-all duration-300 group-hover:border-accent-400/40 group-hover:bg-accent-400/10">
                    <Icon className="h-5 w-5 text-accent-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-[11px] font-bold tracking-[0.25em] text-accent-400/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="rounded-full border border-accent-400/25 bg-accent-400/10 px-2.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-accent-300">
                        {value.tag}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-bold uppercase tracking-tight text-white transition-colors duration-200 group-hover:text-accent-300 md:text-2xl">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-[14px] leading-relaxed text-primary-300">
                      {value.desc}
                    </p>
                  </div>

                  <span className="hidden h-px w-10 self-center bg-white/10 transition-all duration-500 group-hover:w-16 group-hover:bg-accent-400/50 md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
