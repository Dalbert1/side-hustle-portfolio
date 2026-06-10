import { Star } from 'lucide-react'

export default function RatingStars({ value, onChange, size = 20 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          className="p-0.5 hover:scale-110 transition-transform"
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={n <= (value || 0) ? 'text-terra fill-terra' : 'text-warm-gray-light hover:text-terra/50'}
          />
        </button>
      ))}
      {value && (
        <span className="text-xs text-warm-gray ml-1">{value}/5</span>
      )}
    </div>
  )
}
