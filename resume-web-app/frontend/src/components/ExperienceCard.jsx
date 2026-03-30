import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react'

export default function ExperienceCard({ exp }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-xl p-6 hover:border-accent-indigo/40 dark:hover:border-accent-indigo/40 hover:shadow-md dark:hover:shadow-none transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-accent-indigo text-sm font-semibold">{exp.company}</span>
            {exp.team && (
              <span className="text-slate-400 dark:text-text-secondary text-xs">- {exp.team}</span>
            )}
            {exp.current && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-current/10 text-accent-current text-[10px] font-mono font-semibold uppercase tracking-wider border border-accent-current/20">
                Current
              </span>
            )}
          </div>
          <h3 className="text-slate-900 dark:text-text-primary font-bold text-lg">{exp.title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400 dark:text-text-secondary text-xs mb-3 font-mono">
        <span>{exp.period}</span>
        <span className="flex items-center gap-1"><MapPin size={11} />{exp.location}</span>
      </div>

      <p className="text-slate-500 dark:text-text-secondary text-sm leading-relaxed mb-4">{exp.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {exp.tags.map(tag => (
          <span key={tag} className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-bg-card border border-slate-200 dark:border-border text-slate-500 dark:text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      {/* Toggle button */}
      {exp.bullets.length > 0 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-text-secondary hover:text-accent-indigo transition-colors font-medium"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      )}

      {/* Expandable bullets */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="mt-4 flex flex-col gap-2.5">
              {exp.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-500 dark:text-text-secondary leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-indigo flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
