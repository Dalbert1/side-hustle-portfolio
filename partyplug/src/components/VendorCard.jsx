import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import StarRating from './StarRating'

export default function VendorCard({ vendor }) {
  return (
    <Link
      to={`/vendors/${vendor.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow no-underline"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {vendor.featured && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {vendor.priceRange}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1 group-hover:text-primary dark:group-hover:text-accent transition-colors">
          {vendor.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={vendor.rating} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {vendor.rating} ({vendor.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          {vendor.location}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
          {vendor.description}
        </p>
      </div>
    </Link>
  )
}
