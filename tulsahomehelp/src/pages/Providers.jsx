import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Loader2 } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ProviderCard from '../components/ProviderCard'
import { fetchCategories, fetchProviders } from '../lib/api'

export default function Providers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  const activeCategory = searchParams.get('category') || ''
  const activeSort = searchParams.get('sort') || 'rating'
  const [showFilters, setShowFilters] = useState(!!activeCategory)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProviders({ category: activeCategory, search, sort: activeSort })
      .then(setProviders)
      .finally(() => setLoading(false))
  }, [activeCategory, search, activeSort])

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat) params.set('category', cat)
    else params.delete('category')
    setSearchParams(params)
  }

  const setSort = (sort) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    setSearchParams(params)
  }

  const activeCatName = categories.find((c) => c.id === activeCategory)?.name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {activeCatName ? activeCatName : 'All Service Pros'}
        </h1>
        <p className="text-gray-500 text-sm">
          {providers.length} pro{providers.length !== 1 ? 's' : ''} in the Tulsa area
        </p>
      </div>

      {/* Active category indicator */}
      {activeCategory && !showFilters && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">Filtered by:</span>
          <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {categories.find((c) => c.id === activeCategory)?.icon} {activeCatName}
            <button
              onClick={() => setCategory('')}
              className="ml-1 hover:text-gray-200 cursor-pointer bg-transparent border-none text-white text-xs"
              aria-label="Clear filter"
            >
              x
            </button>
          </span>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, service, or keyword..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Service Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  !activeCategory
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'rating', label: 'Top Rated' },
                { value: 'reviews', label: 'Most Reviewed' },
                { value: 'name', label: 'Name A-Z' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    activeSort === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">No providers found</p>
          <p className="text-gray-400 text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}
