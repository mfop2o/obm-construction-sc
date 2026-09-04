import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { useTestimonials } from '../../lib/contentStore'

/* ============================================================================
   Testimonials — client feedback loaded from the database via the API.
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Testimonials() {
  const testimonials = useTestimonials()
  return (
    <Section as="section" padding="xl">
      <Container>
        <SectionHeading
          eyebrow="Client Words"
          title="Trusted by those who build with us."
          align="center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col justify-between bg-surface p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div>
                <Quote size={28} className="text-accent-400" />
                <blockquote className="mt-5 text-lg leading-relaxed text-primary-900">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-6 border-t border-primary-100 pt-4">
                <p className="font-display font-semibold text-primary-950">
                  {t.name}
                </p>
                <p className="mt-0.5 text-sm text-concrete">
                  {[t.role, t.company].filter(Boolean).join(', ')}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
