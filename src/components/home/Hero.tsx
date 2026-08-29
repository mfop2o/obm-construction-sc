import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { Container } from '../ui/Container'
import { heroImages } from '../../data/images'

/* ============================================================================
   Hero — cinematic full-screen opener.
   Large architectural photography with scrollue reveal, dark overlay for
   legibility, editorial word-by-word headline and a scroll indicator.
   ========================================================================== */

const lineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

const word = {
  hidden: { opacity: 0, y: '0.7em' },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function Line({ words }: { words: string[] }) {
  return (
    <span className="block overflow-hidden">
      <motion.span className="block" variants={word}>
        {words.map((w, i) => (
          <span key={i} className="inline-block">
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-primary-950 text-white">
      {/* Photography with slow scale-in reveal */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img
          src={heroImages.construction}
          alt="Construction site with tower cranes across an Ethiopian skyline"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      </motion.div>

      {/* overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/55 to-primary-950/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-950/35 to-transparent" />

      {/* content */}
      <Container className="relative pb-20 pt-32 md:pb-28">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-accent-400"
        >
          <span className="inline-block h-px w-10 bg-accent-400" />
          Construction &bull; Engineering &bull; Infrastructure
        </motion.p>

        <motion.h1
          variants={lineContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl font-display text-[12.5vw] font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.75rem]"
        >
          <Line words={['We', 'Build']} />
          <Line words={['What', 'Matters.']} />
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-xl text-lg leading-relaxed text-primary-100"
        >
          Engineering excellence for Ethiopia&rsquo;s built environment.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Button as="link" to="/projects" size="lg" variant="accent">
            Explore Projects
            <ArrowRight size={18} />
          </Button>
          <Button
            as="link"
            to="/contact"
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-primary-950"
          >
            Start a Project
          </Button>
        </motion.div>
      </Container>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-primary-100 lg:flex"
        aria-hidden="true"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.div>
    </section>
  )
}
