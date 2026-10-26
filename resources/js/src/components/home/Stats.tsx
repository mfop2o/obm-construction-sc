import { motion } from 'framer-motion'
import { Award, Building2, Ruler, Users2 } from 'lucide-react'
import { Container } from '../ui/Container'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { useHomeStats } from '../../lib/contentStore'

/* ============================================================================
   Stats — dark statistics band between Hero and About.
   ========================================================================== */

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const defaultStats = [
  { id: 1, label: 'Years of Experience', value: 20, suffix: '+', icon: Award },
  { id: 2, label: 'Projects Delivered', value: 150, suffix: '+', icon: Building2 },
  { id: 3, label: 'Square Meters Built', value: 500, suffix: 'K+', icon: Ruler },
  { id: 4, label: 'Engineers & Staff', value: 300, suffix: '+', icon: Users2 },
]

const statIcons = [Award, Building2, Ruler, Users2]

export default function Stats() {
  const companyStats = useHomeStats()
  const displayStats = companyStats.length > 0 ? companyStats : defaultStats

  return (
    <section className="relative overflow-hidden bg-primary-950 py-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent" />

      <Container>
        <div className="grid grid-cols-2 divide-y divide-white/[0.08] md:grid-cols-4 md:divide-x md:divide-y-0">
          {displayStats.map((stat, i) => {
            const Icon = statIcons[i % statIcons.length]
            return (
              <motion.div
                key={stat.id}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="group relative flex flex-col items-center px-6 py-10 text-center transition-colors duration-300 hover:bg-white/[0.02] md:items-start md:text-left"
              >
                {/* Micro icon badge */}
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-400 transition-all duration-300 group-hover:border-accent-400/30 group-hover:bg-accent-400/10">
                  <Icon size={16} />
                </div>

                {/* Number + suffix */}
                <span className="font-display text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                  <AnimatedCounter value={stat.value} />
                  <span className="text-accent-400">{stat.suffix}</span>
                </span>

                {/* Label */}
                <span className="mt-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300">
                  {stat.label}
                </span>

                {/* Animated underline accent */}
                <span className="mt-4 h-0.5 w-8 rounded-full bg-accent-400/40 transition-all duration-500 group-hover:w-16 group-hover:bg-accent-400" />
              </motion.div>
            )
          })}
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  )
}
