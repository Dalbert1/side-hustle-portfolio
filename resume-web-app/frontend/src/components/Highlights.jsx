import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import HighlightCard from './HighlightCard'
import highlights from '../data/highlights.json'

export default function Highlights() {
  const { ref, inView } = useInView()

  return (
    <section id="highlights" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-2">Impact</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-2">Project Highlights</h2>
          <p className="text-slate-500 dark:text-text-secondary mb-12">Key initiatives and measurable outcomes.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {highlights.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <HighlightCard highlight={h} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
