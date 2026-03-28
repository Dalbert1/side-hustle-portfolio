import { Link } from 'react-router-dom'
import { Zap, Search, Star, Shield, ArrowRight } from 'lucide-react'
import CategoryCard from '../components/CategoryCard'
import VendorCard from '../components/VendorCard'
import { categories, vendors } from '../data/mockVendors'

export default function Home() {
  const featuredVendors = vendors.filter((v) => v.featured).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-accent" fill="currentColor" />
              <span className="text-accent font-bold text-sm tracking-wider uppercase">PartyPlug</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Tulsa's Party & Event
              <br />
              <span className="text-accent-light">Services Marketplace</span>
            </h1>
            <p className="text-lg text-purple-200 mb-8 leading-relaxed">
              Find and book bounce houses, DJs, caterers, photo booths, and more
              for your next event. All the best Tulsa vendors in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/vendors"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-gray-900 font-bold px-6 py-3 rounded-xl text-base no-underline transition-colors"
              >
                <Search className="w-5 h-5" />
                Find Vendors
              </Link>
              <Link
                to="/vendors"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl text-base no-underline transition-colors backdrop-blur"
              >
                List Your Business
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
            to="/vendors"
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
