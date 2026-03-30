import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { GraduationCap, Award } from 'lucide-react'
import education from '../data/education.json'

const honors = [
  { title: 'Summa Cum Laude', detail: 'Auburn University - B.S. Computer Science, 3.9 GPA' },
  { title: 'ASSE Scholarship Recipient', detail: 'American Society of Safety Engineers - awarded for academic achievement in safety sciences' },
]

export default function Education() {
  const { ref, inView } = useInView()

  return (
    <section id="education" className="py-24 px-6 bg-slate-100/50 dark:bg-bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-2">Academic</p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-12">Education & Honors</h2>
        </motion.div>

        {/* Education cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-accent-indigo" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-text-primary">{edu.school}</h3>
                  <p className="text-slate-500 dark:text-text-secondary text-sm">{edu.degree}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-bg-card border border-slate-200 dark:border-border text-slate-500 dark:text-text-secondary">
                  Class of {edu.year}
                </span>
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-bg-card border border-slate-200 dark:border-border text-slate-500 dark:text-text-secondary">
                  GPA {edu.gpa}
                </span>
                {edu.honors && (
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-accent-warm/10 border border-accent-warm/20 text-accent-warm">
                    {edu.honors}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Honors & Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary mb-5 flex items-center gap-2">
            <Award size={18} className="text-accent-warm" />
            Honors & Awards
          </h3>
          <div className="flex flex-col gap-3">
            {honors.map(h => (
              <div key={h.title} className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-slate-900 dark:text-text-primary font-semibold text-sm">{h.title}</span>
                <span className="text-slate-500 dark:text-text-secondary text-sm">{h.detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
