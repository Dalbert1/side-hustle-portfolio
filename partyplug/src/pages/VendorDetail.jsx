import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Star, Tag, Loader2 } from 'lucide-react'
import StarRating from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import BookingForm from '../components/BookingForm'
import { fetchVendor, fetchReviews, fetchCategories } from '../lib/api'

export default function VendorDetail() {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchVendor(id),
      fetchReviews(id),
      fetchCategories(),
    ]).then(([v, r, c]) => {
      setVendor(v)
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

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vendor Not Found</h2>
        <Link to="/vendors" className="text-primary dark:text-accent font-medium no-underline">
          Back to vendors
        </Link>
      </div>
    )
  }

  const category = vendor.categoryData || categories.find((c) => c.id === vendor.category)

  const handleReviewSubmitted = (newReview) => {
    setReviews([{ ...newReview, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...reviews])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back link */}
      <Link
        to="/vendors"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-accent no-underline mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to vendors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <div className="relative rounded-xl overflow-hidden h-64 md:h-80">
            <img
              src={vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
            {vendor.featured && (
              <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{vendor.name}</h1>
                {category && (
                  <Link
                    to={`/vendors?category=${category.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary dark:text-accent no-underline mt-1"
                  >
                    <span>{category.icon}</span> {category.name}
                  </Link>
                )}
              </div>
              <span className="bg-surface-dark dark:bg-gray-700 text-primary dark:text-accent font-bold text-lg px-3 py-1 rounded-lg">
                {vendor.priceRange}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <StarRating rating={vendor.rating} size={18} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{vendor.rating}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">({vendor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                {vendor.location}
              </div>
              {vendor.phone && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Phone className="w-4 h-4" />
                  {vendor.phone}
                </div>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{vendor.description}</p>
          </div>

          {/* Services */}
          {vendor.services?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary dark:text-accent" />
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {vendor.services.map((service) => (
                  <span
                    key={service}
                    className="bg-surface dark:bg-gray-700 text-primary-dark dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary dark:text-accent" />
              Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No reviews yet. Be the first!</p>
            )}
            <ReviewForm vendorId={vendor.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>

        {/* Sidebar: Booking form */}
        <div className="lg:col-span-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5 sticky top-20 overflow-hidden">
            <BookingForm vendorName={vendor.name} vendorId={vendor.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
