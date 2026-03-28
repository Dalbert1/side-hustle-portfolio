import { useState } from 'react'
import { Star, CheckCircle, AlertCircle } from 'lucide-react'
import { submitReview } from '../lib/api'

export default function ReviewForm({ vendorId, onReviewSubmitted }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [form, setForm] = useState({
    author: '',
    rating: 0,
    text: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) return
    setSubmitting(true)
    setError(null)
    const result = await submitReview(vendorId, form)
    setSubmitting(false)
    if (result.success) {
      if (onReviewSubmitted) {
        onReviewSubmitted({ ...form, date: new Date().toISOString().split('T')[0] })
      }
      setSubmitted(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-300">Thanks for your review!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Leave a Review</h4>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Your Name *</label>
          <input
            type="text"
            required
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Rating *</label>
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
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Your Review</label>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={2}
            placeholder="Share your experience..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={form.rating === 0 || submitting}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}
