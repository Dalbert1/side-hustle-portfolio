import StarRating from './StarRating'

export default function ReviewCard({ review }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-gray-900 dark:text-white text-sm">{review.author}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{review.date}</span>
      </div>
      <StarRating rating={review.rating} size={14} />
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{review.text}</p>
    </div>
  )
}
