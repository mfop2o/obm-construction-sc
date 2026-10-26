import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { useTestimonials } from '../../lib/contentStore'

/* ============================================================================
   Testimonials — client feedback cards on warm off-white background.

   Color rules on bg-background (#f5f4f0) and card bg-white:
     SectionHeading  uses the shared component — already unified
     quote text  text-primary-800   (dark enough to read comfortably, not full-black)
     author name text-primary-950   (heaviest — it's the key identifier)
     author role text-concrete      (#73777b — visually subordinate)
     stars       fill-accent-400 text-accent-400
     Quote icon  text-primary-100 → text-accent-100 on hover (purely decorative)
     avatar bg   bg-primary-950 / text-accent-400 (consistent with other dark badges)
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-accent-400 text-accent-400" />
      ))}
    </div>
  )
}

const defaultTestimonials = [
  {
    id: 1,
    quote:
      'OBM delivered our commercial headquarters on schedule and with unmatched structural precision. Their resident engineering team operated with extreme discipline at every milestone.',
    name: 'Alemayehu Tadesse',
    role: 'Project Director',
    company: 'East Africa Real Estate Group',
  },
  {
    id: 2,
    quote:
      'From geotechnical groundwork through the final interior handover, OBM demonstrated true professionalism, transparency, and top-tier craftsmanship across our complex build.',
    name: 'Dr. Bethlehem Haile',
    role: 'Managing Director',
    company: 'Capital Horizon Developments',
  },
  {
    id: 3,
    quote:
      'Safety, structural integrity, and rigorous quality control — OBM brings genuine certified engineering capability to the Ethiopian built environment.',
    name: 'Yonas Kebede',
    role: 'Chief Infrastructure Officer',
    company: 'Regional Transport Authority',
  },
]

export default function Testimonials() {
  const storeTestimonials = useTestimonials()
  const testimonials = storeTestimonials.length > 0 ? storeTestimonials : defaultTestimonials

  return (
    <Section as="section" padding="xl" className="bg-background">
      <Container>
        <SectionHeading
          eyebrow="Client Endorsements"
          title="Trusted by those who build with us."
          description="Proven reliability, safety standards, and engineering excellence across our commercial and institutional partnerships."
          align="center"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(0,0,0,0.07)]"
            >
              {/* Top: stars + decorative quote icon */}
              <div>
                <div className="flex items-start justify-between">
                  <StarRating />
                  {/* Quote icon — very light, purely decorative */}
                  <Quote
                    size={28}
                    className="text-primary-100 transition-colors duration-200 group-hover:text-accent-100"
                    aria-hidden="true"
                  />
                </div>

                {/* Quote text — primary-800: clearly readable, not oppressively dark */}
                <blockquote className="mt-5 text-[15px] leading-[1.75] text-primary-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author */}
              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-primary-100 pt-5">
                {/* Avatar — primary-950 bg / accent-400 text: consistent with all dark badges */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-950 font-display text-sm font-black text-accent-400"
                  aria-hidden="true"
                >
                  {t.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  {/* Name — primary-950: heaviest weight, it's the key label */}
                  <p className="font-display text-[14px] font-semibold text-primary-950">
                    {t.name}
                  </p>
                  {/* Role/company — concrete: neutral, visually subordinate */}
                  <p className="mt-0.5 text-[12px] text-concrete">
                    {[t.role, t.company].filter(Boolean).join(', ')}
                  </p>
                </div>
              </figcaption>

              {/* Left-edge accent reveal on hover */}
              <span
                className="absolute inset-y-0 left-0 w-0.5 rounded-l-2xl bg-gradient-to-b from-accent-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
            </motion.figure>
          ))}
        </div>
      </Container>
    </Section>
  )
}
