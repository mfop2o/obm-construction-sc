import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import Button from '../ui/Button'
import { backgroundImages } from '../../data/images'

/* ============================================================================
   HomeCTA — powerful full-width closing CTA over architectural photography.
   ========================================================================== */

export default function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-primary-950 text-white">
      {/* photography */}
      <motion.img
        src={backgroundImages.cta}
        alt="Construction work continuing into the evening across an Ethiopian city"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0.4, scale: 1.05 }}
        whileInView={{ opacity: 0.55, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* overlay for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-950/60" />

      <Container className="relative py-28 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
            <span className="inline-block h-px w-10 bg-accent-400" />
            Start Your Project
          </p>
          <h2 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Let&rsquo;s build
            <br />
            something
            <br />
            that lasts.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-primary-200">
            Engineering excellence, quality and integrity — tell us about your
            vision and we&rsquo;ll take it from there.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button as="link" to="/contact" size="lg" variant="accent">
              Start a Project
              <ArrowRight size={18} />
            </Button>
            <Button
              as="link"
              to="/contact"
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-primary-950"
            >
              Contact OBM
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
