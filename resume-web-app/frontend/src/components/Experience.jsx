import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import ExperienceCard from './ExperienceCard'
import experience from '../data/experience.json'

const priorRoles = [
  {
    title: 'Safety Manager',
    company: 'Oklahoma State University Medical Center',
    period: 'Apr 2018 - Aug 2020',
  },
  {
    title: 'EHS Consultant',
    company: 'Liberty Occupational Health Management',
    period: 'May 2015 - Apr 2018',
  },
]

export default function Experience() {
  const { ref, inView } = useInView()
  const [priorOpen, setPriorOpen] = useState(false)

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-2">Career</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-12">Experience</h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200 dark:bg-border" />

          <div className="flex flex-col gap-8 pl-6">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[29px] top-6 w-3 h-3 rounded-full border-2 ${exp.current ? 'bg-accent-current border-accent-current' : 'bg-white dark:bg-bg border-accent-indigo'}`} />
                <ExperienceCard exp={exp} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prior Career collapsible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 pl-6"
        >
          <button
            onClick={() => setPriorOpen(o => !o)}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-text-secondary hover:text-slate-900 dark:hover:text-text-primary transition-colors font-medium"
            aria-expanded={priorOpen}
          >
            {priorOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Prior Career (Pre-Tech)
          </button>

          {priorOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 flex flex-col gap-3"
            >
              {priorRoles.map(r => (
                <div key={r.title} className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-lg px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-slate-900 dark:text-text-primary text-sm font-semibold">{r.title}</span>
                    <span className="text-slate-500 dark:text-text-secondary text-sm"> - {r.company}</span>
                  </div>
                  <span className="text-slate-400 dark:text-text-secondary text-xs font-mono">{r.period}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
