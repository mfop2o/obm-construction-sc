import { motion } from 'framer-motion'
import { Container, Section } from '../ui/Container'

/* ============================================================================
   WhyOBM — dark premium editorial band.
   "BUILT ON WHAT MATTERS." with VALUES presented as a strong typographic
   list, not generic cards.
   ========================================================================== */

const values = [
  {
    title: 'Quality',
    text: 'From materials to finishes, every detail is held to the highest construction standard.',
  },
  {
    title: 'Safety',
    text: 'Every site operates under strict protocols to protect our people and the community.',
  },
  {
    title: 'Integrity',
    text: 'Transparent communication and honest engineering build lasting client relationships.',
  },
  {
    title: 'Innovation',
    text: 'Modern methods and rigorous engineering keep our delivery efficient and dependable.',
  },
]

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function WhyOBM() {
  return (
    <Section as="section" padding="xl" className="bg-primary-950 text-white">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-accent-400"
            >
              <span className="inline-block h-px w-8 bg-accent-400" />
              Why OBM
            </motion.p>
            <motion.h2
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.05 }}
              className="mt-6 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Built on
              <br />
              what matters.
            </motion.h2>
            <motion.p
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 }}
              className="mt-7 max-w-md text-lg leading-relaxed text-primary-300"
            >
              Our reputation is earned on every site. These principles guide
              how we plan, build and stand behind our work.
            </motion.p>
          </div>

          {/* Editorial values list */}
          <div className="border-t border-primary-800">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-8 border-b border-primary-800 py-9 md:gap-12"
              >
                <span className="pt-1 font-display text-sm font-semibold tracking-[0.2em] text-accent-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-primary-300">{value.text}</p>
                </div>
                <span className="mt-2 hidden h-px w-16 bg-primary-700 transition-all duration-500 group-hover:w-24 group-hover:bg-accent-400 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
