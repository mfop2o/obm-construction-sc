import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import { Container } from '../components/ui/Container'
import Button from '../components/ui/Button'
import { Framework } from '../components/visuals/ArchVisuals'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

/* ============================================================================
   /404 — dedicated Not Found experience.
   ========================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function NotFound() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('notFound.title'),
    description: t('notFound.description'),
  })

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-primary-950 text-white">
      {/* architectural accent */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Framework className="h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-950/80 to-primary-900/40" />

      <Container className="relative py-24">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <p className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400">
            <span className="inline-block h-px w-10 bg-accent-400" />
            {t('notFound.errorLabel')}
          </p>

          <h1 className="mt-6 max-w-3xl font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl md:text-8xl">
            {t('notFound.heading')}
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-primary-200">
            {t('notFound.descriptionText')}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button as="link" to="/" size="lg" variant="accent">
              <Home size={18} />
              {t('notFound.backHome')}
            </Button>
            <Button
              as="link"
              to="/projects"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-surface hover:text-primary-950"
            >
              <ArrowLeft size={18} />
              {t('notFound.viewWork')}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
