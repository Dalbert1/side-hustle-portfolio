import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${
            star <= Math.round(rating)
              ? 'text-accent fill-accent'
              : 'text-gray-300'
          }`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}
