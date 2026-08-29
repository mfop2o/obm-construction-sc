import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from '../ui/Container'
import Button from '../ui/Button'
import { Photo } from '../ui/Photo'
import { aboutImages } from '../../data/images'

/* ============================================================================
   About — editorial introduction to OBM.
   Large photography beside a large "BUILDING WITH PURPOSE." headline.
   ========================================================================== */

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function AboutPreview() {
  return (
    <Section as="section" padding="xl" className="bg-background">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          {/* Large image */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative"
          >
            <div className="relative">
              <Photo
                src={aboutImages.build}
                alt="Modern architecture reflecting engineering precision"
                className="aspect-[4/5] w-full sm:aspect-[5/5] lg:aspect-[4/5]"
                position="50% 30%"
              />
              {/* gold rule accent */}
              <span className="absolute -left-4 top-8 hidden h-24 w-1 bg-accent-400 md:block" />
            </div>
          </motion.div>

          {/* Editorial copy */}
          <div>
            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-500"
            >
              <span className="inline-block h-px w-8 bg-current" />
              Who We Are
            </motion.p>

            <motion.h2
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-primary-950 sm:text-5xl lg:text-6xl"
            >
              Building
              <br />
              with purpose.
            </motion.h2>

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-concrete-dark"
            >
              OBM Construction S.C. is an Ethiopian construction company built
              on a simple principle — to deliver quality projects with safety,
              integrity and precision. We combine international engineering
              standards with deep local knowledge to shape the built
              environment of Ethiopia.
            </motion.p>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.15 }}
              className="mt-8 max-w-xl border-t border-primary-200 pt-8"
            >
              <div className="space-y-4">
                {[
                  'Commercial, residential and infrastructure projects',
                  'Committed to safety, quality and on-schedule delivery',
                  'An Ethiopian-built team of engineers and professionals',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent-400" />
                    <p className="font-display text-lg font-medium text-primary-900">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <Button
                as="link"
                to="/about"
                variant="primary"
                size="lg"
                className="font-display uppercase tracking-wide"
              >
                Discover OBM
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
