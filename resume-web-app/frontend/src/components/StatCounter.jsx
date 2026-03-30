import { useCountUp } from '../hooks/useCountUp'

export default function StatCounter({ value, label, subtext }) {
  const { count, suffix, ref } = useCountUp(value)

  return (
    <div ref={ref} className="flex flex-col items-center sm:items-center gap-1">
      <span className="text-3xl font-bold text-accent-warm font-mono">
        {count}{suffix}
      </span>
      <span className="text-xs text-slate-400 dark:text-text-secondary text-center leading-tight">{label}</span>
      {subtext && (
        <span className="text-[10px] text-slate-400 dark:text-text-secondary text-center leading-tight italic opacity-70">{subtext}</span>
      )}
    </div>
  )
}
