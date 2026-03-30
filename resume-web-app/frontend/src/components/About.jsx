import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import StatCounter from './StatCounter'

let profileSrc = null
try {
  /* @vite-ignore */
  profileSrc = new URL('../assets/profile.jpg', import.meta.url).href
} catch {
  profileSrc = null
}

const stats = [
  { value: '7+', label: 'Years in Software' },
  { value: '10+', label: 'Industries Served', subtext: 'Construction, Healthcare, Fintech, Safety, Education, Consulting' },
  { value: '10+', label: 'Engineers Mentored' },
]

export default function About() {
  const { ref, inView } = useInView()
  const [imgError, setImgError] = useState(false)

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            {profileSrc && !imgError ? (
              <img
                src={profileSrc}
                alt="Dylan Albert"
                className="w-64 h-64 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-border"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-64 h-64 rounded-xl ring-1 ring-slate-200 dark:ring-border bg-slate-100 dark:bg-bg-card flex items-center justify-center">
                <span className="text-5xl font-bold text-accent-indigo font-mono">DA</span>
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-slate-400 dark:text-text-secondary text-xs font-mono uppercase tracking-widest mb-2">About</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-text-primary mb-4">Dylan Albert</h2>
              <p className="text-slate-500 dark:text-text-secondary leading-relaxed">
                AI Engineer with 7+ years of professional experience spanning full-stack development, cloud infrastructure,
                and applied AI systems. Currently building AI applications at IXOPAY in the fintech space, coming off
                a deep run at Oracle where I led RAG pipeline architecture, LLM evaluation, and internal AI platform deployment.
              </p>
              <p className="text-slate-500 dark:text-text-secondary leading-relaxed mt-3">
                I specialize in the full AI engineering stack - from embedding pipelines and retrieval systems to
                structured output generation, observability, and production deployment on cloud infrastructure.
                I thrive at the intersection of LLM capabilities and real engineering constraints.
              </p>
            </div>

            {/* Career journey callout */}
            <div className="bg-slate-50 dark:bg-bg-surface border-l-2 border-accent-warm rounded-r-lg p-4 border border-slate-200 dark:border-border">
              <p className="text-xs font-mono text-accent-warm uppercase tracking-widest mb-2">Career Journey</p>
              <p className="text-slate-500 dark:text-text-secondary text-sm leading-relaxed">
                Started in occupational health & safety before pivoting hard into software. That cross-disciplinary
                background - systems thinking, risk analysis, process improvement - turned out to be a genuine asset
                in AI engineering, where you're constantly reasoning about failure modes, data quality, and safety.
                Auburn CS degree (3.9 GPA, Summa Cum Laude) formalized the foundation. The rest has been shipping.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-200 dark:border-border pt-12"
        >
          {stats.map(s => (
            <StatCounter key={s.label} value={s.value} label={s.label} subtext={s.subtext} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
