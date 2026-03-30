import { TrendingUp, Layers, ClipboardList, Globe } from 'lucide-react'

const iconMap = {
  TrendingUp,
  Layers,
  ClipboardCheck: ClipboardList,
  Globe,
}

export default function HighlightCard({ highlight }) {
  const Icon = iconMap[highlight.icon] || TrendingUp

  return (
    <div className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-xl p-6 flex flex-col gap-4 hover:border-accent-indigo/40 dark:hover:border-accent-indigo/40 hover:shadow-lg dark:hover:shadow-none transition-all group">
      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={18} className="text-accent-indigo" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-text-primary leading-tight">{highlight.title}</h3>
      </div>

      {/* Metric */}
      <div className="flex flex-col gap-0.5">
        <span className="text-3xl font-bold text-accent-warm font-mono leading-none">{highlight.metric}</span>
        <span className="text-xs text-slate-400 dark:text-text-secondary font-mono uppercase tracking-widest">{highlight.metricLabel}</span>
      </div>

      <div className="border-t border-slate-200 dark:border-border" />

      {/* Sections */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-mono text-accent-warm uppercase tracking-widest mb-1">Challenge</p>
          <p className="text-slate-500 dark:text-text-secondary text-sm leading-relaxed">{highlight.problem}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-accent-indigo uppercase tracking-widest mb-1">Approach</p>
          <p className="text-slate-500 dark:text-text-secondary text-sm leading-relaxed">{highlight.approach}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-accent-warm uppercase tracking-widest mb-1">Outcome</p>
          <p className="text-slate-500 dark:text-text-secondary text-sm leading-relaxed">{highlight.result}</p>
        </div>
      </div>
    </div>
  )
}
