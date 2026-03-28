import { useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'

export default function ReviewForm({ vendorId, onReviewSubmitted }) {
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [form, setForm] = useState({
    author: '',
    rating: 0,
    text: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.rating === 0) return
    // In production, this would insert into Supabase reviews table
    console.log('Review:', { vendorId, ...form })
    if (onReviewSubmitted) {
      onReviewSubmitted({ ...form, date: new Date().toISOString().split('T')[0] })
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Thanks for your review!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-semibold text-gray-900">Leave a Review</h4>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
        <input
          type="text"
          required
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0 bg-transparent border-none cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoveredStar || form.rating)
                    ? 'text-accent fill-accent'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Your Review</label>
        <textarea
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          rows={2}
          placeholder="Share your experience..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={form.rating === 0}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Submit Review
      </button>
    </form>
  )
}
