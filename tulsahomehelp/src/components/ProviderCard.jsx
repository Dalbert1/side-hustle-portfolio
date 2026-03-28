import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import StarRating from './StarRating'

export default function ProviderCard({ provider }) {
  return (
    <Link
      to={`/providers/${provider.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow no-underline"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {provider.featured && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Top Pro
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {provider.priceRange}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 font-semibold text-base mb-1 group-hover:text-primary transition-colors">
          {provider.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={provider.rating} />
          <span className="text-sm text-gray-500">
            {provider.rating} ({provider.reviewCount})
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          {provider.location}
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {provider.description}
        </p>
      </div>
    </Link>
  )
}
