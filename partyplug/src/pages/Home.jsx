import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Shield, ArrowRight } from 'lucide-react'
import CategoryCard from '../components/CategoryCard'
import VendorCard from '../components/VendorCard'
import { fetchCategories, fetchFeaturedVendors } from '../lib/api'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredVendors, setFeaturedVendors] = useState([])

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchFeaturedVendors().then(setFeaturedVendors)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}918-party.webp`}
          alt="918 Party Co. - Tulsa Area's Party & Event Marketplace"
          className="w-full h-auto"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-6 pt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/vendors"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-gray-900 font-bold px-6 py-3 rounded-xl text-base no-underline transition-colors"
            >
              <Search className="w-5 h-5" />
              Find Vendors
            </Link>
            <Link
              to="/get-listed"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-base no-underline transition-colors"
            >
              List Your Business
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-surface py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-gray-900">Search & Compare</h3>
              <p className="text-sm text-gray-600">Browse verified Tulsa vendors by category, price, and rating.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-gray-900">Real Reviews</h3>
              <p className="text-sm text-gray-600">Read honest reviews from real Tulsa families and event planners.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-gray-900">Book with Confidence</h3>
              <p className="text-sm text-gray-600">Send booking requests directly. No hidden fees, no runarounds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Vendors</h2>
            <Link
              to="/vendors"
              className="text-primary font-medium text-sm no-underline hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Are You a Tulsa Party Vendor?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Get found by thousands of Tulsa families planning their next event.
            Your first 90 days are completely free.
          </p>
          <Link
            to="/get-listed"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl text-base no-underline hover:bg-primary-dark transition-colors"
          >
            Get Listed Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
