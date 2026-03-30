import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import SkillCategory from './SkillCategory'
import skills from '../data/skills.json'

export default function Skills() {
  const { ref, inView } = useInView()

  return (
    <section id="skills" className="py-24 px-6 bg-slate-100/50 dark:bg-bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-2">Expertise</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-12">Skills</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {skills.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <SkillCategory category={cat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
