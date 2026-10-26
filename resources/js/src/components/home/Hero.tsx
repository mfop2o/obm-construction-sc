import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Button from '../ui/Button'
import { Container } from '../ui/Container'
import { heroImages } from '../../data/images'
import { useTranslation } from '../../i18n'
import { cn } from '../../lib/cn'

/* ============================================================================
   Hero — cinematic, architectural opener for OBM Construction S.C.

   Exact headline requirement:
     Line 1: OBM – We Build Strong,
     Line 2: Finish with Quality,
     Line 3: and Deliver Lasting Results
   ========================================================================== */

/* ─── animation variants ─────────────────────────────────────────────────── */
const containerVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const lineVariant = {
  hidden: { opacity: 0, y: '0.65em' },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ─── sub-components ─────────────────────────────────────────────────────── */
function StyledHeadlineLine({ line, index }: { line: string; index: number }) {
  // Line 0: OBM brand prefix highlight
  if (index === 0) {
    const obmMatch = line.match(/^(OBM)(\s*[–\-—]\s*)(.*)$/i)
    if (obmMatch) {
      const [, brand, , rest] = obmMatch
      return (
        <span className="block overflow-hidden py-0.5">
          <motion.span className="block" variants={lineVariant}>
            <span className="inline-block font-black text-accent-400 drop-shadow-[0_2px_14px_rgba(217,154,43,0.45)]">
              {brand}
            </span>
            <span className="mx-2 inline-block font-light text-white/40 sm:mx-3" aria-hidden="true">
              —
            </span>
            <span className="inline-block text-white">
              {rest}
            </span>
          </motion.span>
        </span>
      )
    }
  }

  // Line 1: Quality / Qulqullina / ጥራት shimmer highlight
  if (index === 1) {
    const words = line.split(' ')
    return (
      <span className="block overflow-hidden py-0.5">
        <motion.span className="block" variants={lineVariant}>
          {words.map((w, i) => {
            const isQuality = /quality|ጥራት|qulqullina/i.test(w)
            return (
              <span key={i} className="inline-block">
                {isQuality ? (
                  <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-amber-300 bg-clip-text font-black text-transparent drop-shadow-[0_2px_10px_rgba(217,154,43,0.35)]">
                    {w}
                  </span>
                ) : (
                  <span className="text-white">{w}</span>
                )}
                {i < words.length - 1 ? '\u00A0' : ''}
              </span>
            )
          })}
        </motion.span>
      </span>
    )
  }

  // Line 2: Lasting Results / ዘላቂ / yeroo dheeraa
  const words = line.split(' ')
  return (
    <span className="block overflow-hidden py-0.5">
      <motion.span className="block" variants={lineVariant}>
        {words.map((w, i) => (
          <span key={i} className="inline-block text-white">
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/* ─── component ─────────────────────────────────────────────────────────── */
export default function Hero() {
  const { t } = useTranslation()

  const mottoLines = [
    t('home.heroTitleLine1'),
    t('home.heroTitleLine2'),
    t('home.heroTitleLine3'),
  ].filter((line) => line && !line.startsWith('home.'))

  return (
    <section
      /* Pull behind sticky navbar so the photo bleeds to the very top */
      className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-primary-950 text-white lg:-mt-[72px]"
    >
      {/* ── Background photo (brightened for high clarity) ─────────────── */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImages.construction}
          alt="OBM Construction skyline across an Ethiopian city"
          className="h-full w-full object-cover object-center brightness-[1.14] contrast-[1.04]"
          fetchPriority="high"
        />
      </motion.div>

      {/* ── Architectural Blueprint Grid Overlay ──────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #d99a2b 1.2px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />

      {/* ── Light Atmospheric Overlays ────────────────────────────────── */}
      {/* Ambient warm sunlight glow */}
      <div
        className="pointer-events-none absolute -top-28 right-1/4 h-[550px] w-[550px] rounded-full bg-accent-400/[0.12] blur-[150px]"
        aria-hidden="true"
      />
      {/* Very soft overall scrim — preserves bright daylight while retaining contrast */}
      <div className="pointer-events-none absolute inset-0 bg-primary-950/15" />
      {/* Light bottom fade to transition to the next section */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
      {/* Gentle left vignette directly behind text */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-2xl bg-gradient-to-r from-primary-950/65 via-primary-950/20 to-transparent" />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        {/* Spacer */}
        <div className="flex-1" style={{ minHeight: '8vh' }} />

        <Container className="relative w-full pb-14 pt-20 lg:pb-16 lg:pt-[96px]">

          {/* Eyebrow badge with glowing live status */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent-400/35 bg-primary-950/60 px-4 py-1.5 backdrop-blur-md shadow-[0_2px_12px_rgba(217,154,43,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-accent-300 sm:text-[11px]">
              {t('home.heroEyebrow')}
            </span>
          </motion.div>

          {/* Main headline:
              Fluid size: 38px (mobile) → 72px (xl desktop).
              Rendered with dedicated styling per line. */}
          <motion.h1
            variants={containerVariant}
            initial="hidden"
            animate="show"
            className="max-w-4xl font-display font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            style={{
              fontSize: 'clamp(2.35rem, 5.2vw + 0.5rem, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            {mottoLines.map((line, i) => (
              <StyledHeadlineLine key={i} line={line} index={i} />
            ))}
          </motion.h1>

          {/* Gold accent bar with subtle glow */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center gap-2.5 sm:mt-7"
            aria-hidden="true"
          >
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-accent-400 via-accent-300 to-amber-500 shadow-[0_0_16px_rgba(217,154,43,0.6)] sm:w-24" />
            <div className="h-1 w-2.5 rounded-full bg-accent-400/40" />
          </motion.div>

          {/* Tagline / sub-copy */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.58 }}
            className="mt-5 max-w-xl text-[15px] leading-[1.7] text-primary-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:mt-6 sm:text-[17px] md:text-lg"
          >
            Engineering excellence, uncompromising structural safety, and disciplined project delivery — shaping Ethiopia&rsquo;s skyline with landmark commercial towers, infrastructure, and enduring residential communities.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.68 }}
            className="mt-8 flex flex-wrap items-center gap-3.5 sm:mt-10"
          >
            <Button
              as="link"
              to="/projects"
              size="lg"
              variant="accent"
              className="group rounded-full bg-accent-400 px-8 py-3.5 font-display text-sm font-bold tracking-wide text-primary-950 shadow-[0_4px_24px_rgba(217,154,43,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 hover:shadow-[0_8px_32px_rgba(217,154,43,0.55)]"
            >
              {t('nav.viewWork')}
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              as="link"
              to="/request-quote"
              size="lg"
              variant="outline"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 font-display text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/20"
            >
              {t('nav.startProject')}
            </Button>

            <Button
              as="link"
              to="/about"
              size="lg"
              className="hidden items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-display text-sm font-semibold text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent-400/40 hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-400 text-primary-950 shadow-[0_0_12px_rgba(217,154,43,0.5)]">
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              Company Story
            </Button>
          </motion.div>
        </Container>

        <div style={{ flex: '0 0 4vh' }} />
      </div>

      {/* ── Scroll indicator (desktop only) ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 right-8 hidden flex-col items-center gap-2 lg:flex"
        aria-hidden="true"
      >
        <span
          className="font-display text-[9px] font-bold uppercase tracking-[0.35em] text-white/35"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="flex h-8 w-[18px] items-start justify-center rounded-full border border-white/20 pt-1.5"
        >
          <div className="h-1.5 w-0.5 rounded-full bg-accent-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
