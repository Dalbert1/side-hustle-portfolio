import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, CheckCircle, AlertCircle, PartyPopper, Star, Users, TrendingUp } from 'lucide-react'
import { submitVendorListing } from '../lib/api'

const CATEGORY_OPTIONS = [
  { value: 'bounce-houses', label: 'Bounce Houses & Inflatables' },
  { value: 'djs', label: 'DJs & Music' },
  { value: 'face-painting', label: 'Face Painting' },
  { value: 'balloon-artists', label: 'Balloon Artists' },
  { value: 'photo-booths', label: 'Photo Booths' },
  { value: 'tent-rentals', label: 'Tent & Table Rentals' },
  { value: 'catering', label: 'Catering & Food' },
  { value: 'party-characters', label: 'Party Characters' },
  { value: 'other', label: 'Other' },
]

const PRICE_OPTIONS = [
  { value: '$', label: '$ - Budget Friendly' },
  { value: '$$', label: '$$ - Mid Range' },
  { value: '$$$', label: '$$$ - Premium' },
]

const PERKS = [
  { icon: Users, title: 'Reach Local Families', desc: 'Get in front of Tulsa area families actively planning events.' },
  { icon: Star, title: 'Build Your Reputation', desc: 'Collect reviews and ratings that help you stand out.' },
  { icon: TrendingUp, title: 'Grow Your Business', desc: 'Receive booking requests directly through the platform.' },
]

export default function GetListed() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: '',
    priceRange: '',
    location: '',
    description: '',
    services: '',
    areasServed: '',
    website: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await submitVendorListing(form)
    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h1>
        <p className="text-gray-600 mb-2">
          Thanks for submitting your listing. We'll review your information and get your
          business live on 918 Party Co. within 1-2 business days.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          We'll send a confirmation to <strong>{form.email}</strong> once your listing is active.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl no-underline hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-amber-900 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <PartyPopper className="w-10 h-10 text-accent mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">List Your Business on<br />918 Party Co.</h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Join Tulsa's party and event marketplace. Get found by local families
            and start receiving booking requests - your first 90 days are free.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-10 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex flex-col items-center gap-2">
                <perk.icon className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-gray-900">{perk.title}</h3>
                <p className="text-sm text-gray-600">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tell Us About Your Business</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Tulsa Bounce Co."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700"
                  >
                    <option value="">Select a category...</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range *</label>
                  <select
                    name="priceRange"
                    required
                    value={form.priceRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700"
                  >
                    <option value="">Select range...</option>
                    {PRICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Tulsa, OK"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Areas Served *</label>
                <input
                  type="text"
                  name="areasServed"
                  required
                  value={form.areasServed}
                  onChange={handleChange}
                  placeholder="e.g. Tulsa, Broken Arrow, Bixby, Jenks - up to 30 miles from Tulsa"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">List the cities/areas you serve and how far outside of Tulsa you're willing to travel (e.g. "50 miles from Tulsa")</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell potential customers what you offer and what makes your business special..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services Offered *</label>
                <input
                  type="text"
                  name="services"
                  required
                  value={form.services}
                  onChange={handleChange}
                  placeholder="e.g. Bounce Houses, Water Slides, Obstacle Courses"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Separate each service with a comma</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="yourbusiness.com"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@yourbusiness.com"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(918) 555-0000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold text-base hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Your Listing'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Your first 90 days are free. No credit card required.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
