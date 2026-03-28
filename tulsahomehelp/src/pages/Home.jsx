import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home as HomeIcon, Search, Star, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import CategoryCard from '../components/CategoryCard'
import ProviderCard from '../components/ProviderCard'
import { fetchCategories, fetchFeaturedProviders } from '../lib/api'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featuredProviders, setFeaturedProviders] = useState([])

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchFeaturedProviders().then(setFeaturedProviders)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HomeIcon className="w-8 h-8 text-accent" />
              <span className="text-accent font-bold text-sm tracking-wider uppercase">TulsaHomeHelp</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Tulsa's Trusted Home
              <br />
              <span className="text-accent-light">Service Professionals</span>
            </h1>
            <p className="text-lg text-emerald-200 mb-8 leading-relaxed">
              Find pressure washers, lawn pros, tree experts, junk haulers, and more.
              Get free quotes from Tulsa's best home service providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/providers"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-gray-900 font-bold px-6 py-3 rounded-xl text-base no-underline transition-colors"
              >
                <Search className="w-5 h-5" />
                Find a Pro
              </Link>
              <Link
                to="/providers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl text-base no-underline transition-colors backdrop-blur"
              >
                List Your Service
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
              <h3 className="font-semibold text-gray-900">Find Local Pros</h3>
              <p className="text-sm text-gray-600">Browse verified Tulsa service providers by trade, price, and rating.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Star className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-gray-900">Real Reviews</h3>
              <p className="text-sm text-gray-600">Read honest reviews from real Tulsa homeowners and property managers.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-gray-900">Free Quotes</h3>
              <p className="text-sm text-gray-600">Request quotes directly from pros. No middleman, no hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What Do You Need Done?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Top-Rated Pros</h2>
            <Link
              to="/providers"
              className="text-primary font-medium text-sm no-underline hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Tell Us What You Need', desc: 'Browse categories or search for a specific service. Filter by rating and location.' },
              { step: '2', title: 'Get Free Quotes', desc: 'Send a quote request to one or more pros. They respond within 24 hours.' },
              { step: '3', title: 'Hire with Confidence', desc: 'Compare quotes, read reviews, and book the pro that fits your budget.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Are You a Tulsa Home Service Pro?
          </h2>
          <p className="text-emerald-200 mb-6 max-w-lg mx-auto">
            Get found by 180,000+ Tulsa metro households looking for reliable service providers.
            Your first 90 days are completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {['No signup fees', 'Free for 90 days', '10-12% after that'].map((perk) => (
              <span key={perk} className="flex items-center gap-1 text-white text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                {perk}
              </span>
            ))}
          </div>
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-xl text-base no-underline hover:bg-gray-100 transition-colors"
          >
            Get Listed Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
