import { supabase } from './supabase'
import { providers as mockProviders, categories as mockCategories } from '../data/mockProviders'

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

export async function fetchProviders({ category, search, sort = 'rating' } = {}) {
  if (!isConfigured) {
    let result = [...mockProviders]
    if (category) result = result.filter((p) => p.category === category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.services.some((s) => s.toLowerCase().includes(q))
      )
    }
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sort === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }

  let query = supabase.from('providers').select('*')
  if (category) query = query.eq('category_id', category)
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  if (sort === 'rating') query = query.order('rating', { ascending: false })
  else if (sort === 'reviews') query = query.order('review_count', { ascending: false })
  else if (sort === 'name') query = query.order('name')

  const { data, error } = await query
  if (error) return []
  return (data || []).map(normalizeProvider)
}

export async function fetchFeaturedProviders() {
  if (!isConfigured) return mockProviders.filter((p) => p.featured).slice(0, 4)

  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(4)

  if (error) return []
  return (data || []).map(normalizeProvider)
}

export async function fetchProvider(id) {
  if (!isConfigured) return mockProviders.find((p) => p.id === Number(id)) || null

  const { data, error } = await supabase
    .from('providers')
    .select('*, categories(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return normalizeProvider(data)
}

export async function fetchReviews(providerId) {
  if (!isConfigured) {
    const provider = mockProviders.find((p) => p.id === Number(providerId))
    return provider?.reviews || []
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('provider_id', providerId)
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

export async function submitQuoteRequest(providerId, form) {
  if (!isConfigured) {
    console.log('Mock quote request:', { providerId, ...form })
    return { success: true }
  }

  const { error } = await supabase.from('quote_requests').insert({
    provider_id: providerId,
    customer_name: form.name,
    customer_email: form.email,
    customer_phone: form.phone || null,
    service_needed: form.serviceNeeded || null,
    preferred_date: form.preferredDate || null,
    address: form.address || null,
    message: form.message || null,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitReview(providerId, form) {
  if (!isConfigured) {
    console.log('Mock review:', { providerId, ...form })
    return { success: true }
  }

  const { error } = await supabase.from('reviews').insert({
    provider_id: providerId,
    author_name: form.author,
    rating: form.rating,
    text: form.text || null,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

function normalizeProvider(row) {
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
