import { supabase } from './supabase'
import { vendors as mockVendors, categories as mockCategories } from '../data/mockVendors'

const isConfigured = import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your-project')

export async function fetchCategories() {
  if (!isConfigured) return mockCategories

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error || !data?.length) return mockCategories
  return data
}

export async function fetchVendors({ category, search, sort = 'rating' } = {}) {
  if (!isConfigured) {
    let result = [...mockVendors]
    if (category) result = result.filter((v) => v.category === category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.services.some((s) => s.toLowerCase().includes(q))
      )
    }
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sort === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }

  let query = supabase
    .from('vendors')
    .select('*')

  if (category) query = query.eq('category_id', category)
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  if (sort === 'rating') query = query.order('rating', { ascending: false })
  else if (sort === 'reviews') query = query.order('review_count', { ascending: false })
  else if (sort === 'name') query = query.order('name')

  const { data, error } = await query

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return (data || []).map(normalizeVendor)
}

export async function fetchFeaturedVendors() {
  if (!isConfigured) return mockVendors.filter((v) => v.featured).slice(0, 4)

  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(4)

  if (error) return []
  return (data || []).map(normalizeVendor)
}

export async function fetchVendor(id) {
  if (!isConfigured) return mockVendors.find((v) => v.id === Number(id)) || null

  const { data, error } = await supabase
    .from('vendors')
    .select('*, categories(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return normalizeVendor(data)
}

export async function fetchReviews(vendorId) {
  if (!isConfigured) {
    const vendor = mockVendors.find((v) => v.id === Number(vendorId))
    return vendor?.reviews || []
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data || []).map((r) => ({
    id: r.id,
    author: r.author_name,
    rating: r.rating,
    text: r.text,
    date: r.created_at?.split('T')[0],
  }))
}

export async function submitBooking(vendorId, form) {
  if (!isConfigured) {
    console.log('Mock booking:', { vendorId, ...form })
    return { success: true }
  }

  const { error } = await supabase.from('booking_requests').insert({
    vendor_id: vendorId,
    customer_name: form.name,
    customer_email: form.email,
    customer_phone: form.phone || null,
    event_date: form.eventDate,
    event_time: form.eventTime || null,
    event_type: form.eventType || null,
    guest_count: form.guestCount ? Number(form.guestCount) : null,
    message: form.message || null,
  })

  if (error) {
    console.error('Booking error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function submitReview(vendorId, form) {
  if (!isConfigured) {
    console.log('Mock review:', { vendorId, ...form })
    return { success: true }
  }

  const { error } = await supabase.from('reviews').insert({
    vendor_id: vendorId,
    author_name: form.author,
    rating: form.rating,
    text: form.text || null,
  })

  if (error) {
    console.error('Review error:', error)
    return { success: false, error: error.message }
  }
  return { success: true }
}

function normalizeVendor(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category_id,
    description: row.description,
    image: row.image_url,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count || 0,
    priceRange: row.price_range || '$$',
    location: row.location,
    phone: row.phone,
    featured: row.featured,
    services: row.services || [],
    categoryData: row.categories || null,
  }
}
