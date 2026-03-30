import { useState } from 'react'
import { Brain, Cloud, Server, GitBranch, BarChart2 } from 'lucide-react'

const iconMap = {
  Brain,
  Cloud,
  Server,
  GitBranch,
  BarChart: BarChart2,
}

export default function SkillCategory({ category }) {
  const Icon = iconMap[category.icon] || Brain
  const [tooltip, setTooltip] = useState(null)

  const handleToggle = (skillName) => {
    setTooltip(prev => prev === skillName ? null : skillName)
  }

  return (
    <div className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-border rounded-xl p-6 hover:border-accent-indigo/30 dark:hover:border-accent-indigo/30 hover:shadow-md dark:hover:shadow-none transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
          <Icon size={16} className="text-accent-indigo" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-text-primary text-sm">{category.category}</h3>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-2">
        {category.skills.map(skill => (
          <div key={skill.name} className="relative">
            <button
              onClick={() => handleToggle(skill.name)}
              onMouseEnter={() => setTooltip(skill.name)}
              onMouseLeave={() => setTooltip(null)}
              className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-bg-card border border-slate-200 dark:border-border text-slate-500 dark:text-text-secondary hover:border-accent-indigo hover:text-accent-indigo transition-all duration-150"
              aria-describedby={tooltip === skill.name ? `tooltip-${skill.name}` : undefined}
            >
              {skill.name}
            </button>
            {tooltip === skill.name && (
              <div
                id={`tooltip-${skill.name}`}
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-max max-w-[220px] px-3 py-2 rounded-lg bg-white dark:bg-bg-card border border-slate-200 dark:border-border shadow-lg dark:shadow-xl text-[11px] text-slate-500 dark:text-text-secondary leading-relaxed text-center pointer-events-none"
              >
                {skill.context}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-200 dark:border-t-border" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
