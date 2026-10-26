import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import Button from '../ui/Button'
import { backgroundImages } from '../../data/images'
import { useTranslation } from '../../i18n'

/* ============================================================================
   HomeCTA — powerful full-width closing CTA over architectural photography.
   ========================================================================== */

export default function HomeCTA() {
  const { t } = useTranslation()

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
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Let&rsquo;s build
            <br />
            something
            <br />
            that lasts.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-primary-200 sm:text-lg">
            Engineering excellence, quality and integrity — tell us about your
            vision and we&rsquo;ll take it from there.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              as="link"
              to="/request-quote"
              size="lg"
              variant="accent"
              className="rounded-full px-9 py-4 font-display font-bold shadow-[0_4px_24px_rgba(217,154,43,0.4)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(217,154,43,0.55)]"
            >
              {t('nav.startProject')}
              <ArrowRight size={18} />
            </Button>
            <Button
              as="link"
              to="/contact"
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/5 px-9 py-4 font-display text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/15"
            >
              Contact Our Engineers
            </Button>
          </div>

          {/* Trust markers */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8 text-[12px] font-semibold uppercase tracking-wider text-primary-300">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Certified General Contractor
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              ISO-Compliant QA/QC
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Nationwide Delivery
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
