import { useState, useEffect } from 'react'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import RecipeCard from '../components/RecipeCard'

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other']

export default function Home() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (user) loadRecipes()
  }, [user])

  async function loadRecipes() {
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setRecipes(data || [])
    setLoading(false)
  }

  const filtered = recipes.filter(r => {
    const matchesCategory = category === 'all' || r.category === category
    const q = search.toLowerCase()
    const matchesSearch = !q
      || r.title.toLowerCase().includes(q)
      || r.description?.toLowerCase().includes(q)
      || r.tags?.some(t => t.toLowerCase().includes(q))
    return matchesCategory && matchesSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-bark">My Recipes</h1>
          <p className="text-sm text-warm-gray mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Link
          to="/add"
          className="px-4 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Recipe</span>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray-light" />
          <input
            type="text"
            placeholder="Search recipes or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-bark placeholder:text-warm-gray-light focus:border-sage focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-warm-gray" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-border rounded-lg px-3 py-2.5 bg-white text-bark focus:border-sage focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors capitalize ${
              category === cat
                ? 'bg-sage text-white border-sage'
                : 'bg-white text-warm-gray border-border hover:border-sage/40'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {loading ? (
        <div className="text-center py-20 text-warm-gray text-sm">Loading recipes...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-warm-gray mb-4">
            {recipes.length === 0
              ? 'No recipes yet. Add your first one!'
              : 'No recipes match your search.'}
          </p>
          {recipes.length === 0 && (
            <Link
              to="/add"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark transition-colors"
            >
              <Plus size={16} />
              Add Recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
