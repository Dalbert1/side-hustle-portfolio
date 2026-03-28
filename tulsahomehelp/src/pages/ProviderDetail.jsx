import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Star, Tag, Loader2 } from 'lucide-react'
import StarRating from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import QuoteForm from '../components/QuoteForm'
import { fetchProvider, fetchReviews, fetchCategories } from '../lib/api'

export default function ProviderDetail() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchProvider(id),
      fetchReviews(id),
      fetchCategories(),
    ]).then(([p, r, c]) => {
      setProvider(p)
      setReviews(r)
      setCategories(c)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
        <Link to="/providers" className="text-primary font-medium no-underline">
          Back to providers
        </Link>
      </div>
    )
  }

  const category = provider.categoryData || categories.find((c) => c.id === provider.category)

  const handleReviewSubmitted = (newReview) => {
    setReviews([{ ...newReview, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...reviews])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        to="/providers"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary no-underline mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to providers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden h-64 md:h-80">
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-full object-cover"
            />
            {provider.featured && (
              <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                Top Pro
              </span>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{provider.name}</h1>
                {category && (
                  <Link
                    to={`/providers?category=${category.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary no-underline mt-1"
                  >
                    <span>{category.icon}</span> {category.name}
                  </Link>
                )}
              </div>
              <span className="bg-surface-dark text-primary font-bold text-lg px-3 py-1 rounded-lg">
                {provider.priceRange}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <StarRating rating={provider.rating} size={18} />
                <span className="text-sm font-medium text-gray-700">{provider.rating}</span>
                <span className="text-sm text-gray-400">({provider.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                {provider.location}
              </div>
              {provider.phone && (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Phone className="w-4 h-4" />
                  {provider.phone}
                </div>
              )}
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{provider.description}</p>
          </div>

          {provider.services?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {provider.services.map((service) => (
                  <span
                    key={service}
                    className="bg-surface text-primary-dark text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            )}
            <ReviewForm providerId={provider.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <QuoteForm providerName={provider.name} providerId={provider.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
