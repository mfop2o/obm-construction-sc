import { motion } from 'framer-motion'
import { Container, Section } from '../ui/Container'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { useHomeStats } from '../../lib/contentStore'

/* ============================================================================
   Stats — company statistics band with count-up animation.
   Data is loaded from the database via the Laravel API (admin: Home Stats).
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Stats() {
  const companyStats = useHomeStats()
  return (
    <Section as="section" padding="none">
      <Container className="border-y border-primary-200">
        <div className="grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4 md:px-6 md:py-14">
          {companyStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1 text-center md:items-start md:text-left"
            >
              <span className="font-display text-4xl font-bold tracking-tight text-primary-950 md:text-5xl">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </span>
              <span className="mt-1 text-sm font-medium uppercase tracking-wider text-concrete">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
