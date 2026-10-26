import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Award, Users2 } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { Photo } from '../ui/Photo'
import { aboutImages } from '../../data/images'
import { useTranslation } from '../../i18n'

/* ============================================================================
   About — editorial introduction to OBM.

   Color rules on bg-background (warm off-white):
     eyebrow   text-accent-500   font-bold uppercase tracking-[0.32em] text-[11px]
     h2        text-primary-950  font-bold uppercase leading-[0.95]
     body      text-concrete-dark  (not primary-900 — that's near-black, too heavy)
     bullets   text-primary-800  font-semibold (one step lighter than h2)
     badge     bg-primary-950 / text-accent-400  (dark pill badge)
   ========================================================================== */

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const highlights = [
  { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: Award,        color: 'text-accent-500',  bg: 'bg-accent-500/10'  },
  { icon: Users2,       color: 'text-blue-600',    bg: 'bg-blue-500/10'    },
]

export default function AboutPreview() {
  const { t } = useTranslation()
  const bulletTexts = [
    t('about.highlight1') || 'Certified Engineering & Structural Rigor',
    t('about.highlight2') || 'Uncompromising Health, Safety & Environmental (HSE) Protocols',
    t('about.highlight3') || 'Full Turnkey Delivery from Foundation to Interior Finishes',
  ]

  return (
    <Section as="section" padding="xl" className="bg-background">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: image ─────────────────────────────────────────── */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            {/* Gold accent rule */}
            <span
              className="absolute -left-3 top-10 hidden h-28 w-1.5 rounded-full bg-gradient-to-b from-accent-400 to-accent-600/20 md:block"
              aria-hidden="true"
            />

            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-2xl shadow-primary-950/10">
              <Photo
                src={aboutImages.build}
                alt="Modern architecture reflecting engineering precision"
                className="aspect-[4/5] w-full sm:aspect-square lg:aspect-[4/5]"
                position="50% 30%"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -right-2 rounded-2xl border border-primary-100 bg-white p-5 shadow-2xl sm:right-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-950 shadow-md">
                  <span className="font-display text-xl font-black text-accent-400">20+</span>
                </div>
                <div>
                  <p className="font-display text-sm font-bold leading-snug text-primary-950">Years of</p>
                  <p className="font-display text-sm font-bold leading-snug text-primary-950">Excellence</p>
                  <p className="mt-1 font-display text-[10px] font-semibold uppercase tracking-wider text-accent-500">General Contractor</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: copy ─────────────────────────────────────────── */}
          <div className="lg:pl-4">

            {/* Eyebrow — unified style */}
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.32em] text-accent-500"
            >
              <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
              {t('about.heroEyebrow')}
            </motion.p>

            {/* Heading */}
            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.06 }}
              className="mt-5 font-display text-3xl font-bold uppercase leading-[0.98] tracking-tight text-primary-950 sm:text-4xl lg:text-5xl"
            >
              {t('about.heroTitle')}
            </motion.h2>

            {/* Body */}
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-base leading-[1.75] text-concrete-dark sm:text-[17px]"
            >
              {t('about.heroDescription')}
            </motion.p>

            {/* Bullet highlights */}
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.18 }}
              className="mt-8 space-y-3.5 border-t border-primary-200/60 pt-7"
            >
              {bulletTexts.map((text, i) => {
                const { icon: Icon, color, bg } = highlights[i] ?? highlights[0]
                return (
                  <div key={text} className="flex items-center gap-3.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <p className="font-display text-[15px] font-semibold text-primary-800">
                      {text}
                    </p>
                  </div>
                )
              })}
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.24 }}
              className="mt-10"
            >
              <Button
                as="link"
                to="/about"
                variant="primary"
                size="lg"
                className="group rounded-full px-8 py-3.5 font-display font-semibold uppercase tracking-wide"
              >
                Learn More About OBM
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
