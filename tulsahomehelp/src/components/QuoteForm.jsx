import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { submitQuoteRequest } from '../lib/api'

export default function QuoteForm({ providerName, providerId }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceNeeded: '',
    preferredDate: '',
    address: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await submitQuoteRequest(providerId, form)
    setSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Quote Requested!</h3>
        <p className="text-gray-600 text-sm">
          {providerName} will get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Get a Free Quote</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
          <select
            name="serviceNeeded"
            value={form.serviceNeeded}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Select service...</option>
            <option value="pressure-washing">Pressure Washing</option>
            <option value="lawn-care">Lawn Care</option>
            <option value="junk-hauling">Junk Hauling</option>
            <option value="tree-service">Tree Service</option>
            <option value="fence-deck">Fence & Deck</option>
            <option value="gutter-cleaning">Gutter Cleaning</option>
            <option value="painting">Painting</option>
            <option value="general-labor">General Labor</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input
            type="date"
            name="preferredDate"
            value={form.preferredDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Tulsa, OK"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Job</label>
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell the pro about the work you need done..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
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
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Sending...' : 'Request Free Quote'}
      </button>
    </form>
  )
}
