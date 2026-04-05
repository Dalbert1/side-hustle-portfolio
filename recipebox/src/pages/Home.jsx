import { useState, useEffect } from 'react'
import { Search, Plus, SlidersHorizontal, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import RecipeCard from '../components/RecipeCard'

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other']

export default function Home() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingFavs, setLoadingFavs] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [tab, setTab] = useState('mine')

  useEffect(() => {
    if (user) {
      loadRecipes()
      loadFavorites()
    }
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

  async function loadFavorites() {
    setLoadingFavs(true)
    const { data: likes } = await supabase
      .from('recipe_likes')
      .select('recipe_id')
      .eq('user_id', user.id)

    if (!likes || likes.length === 0) {
      setFavorites([])
      setLoadingFavs(false)
      return
    }

    const ids = likes.map(l => l.recipe_id)
    const { data: favsData } = await supabase
      .from('recipes')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false })

    setFavorites(favsData || [])
    setLoadingFavs(false)
  }

  const activeList = tab === 'mine' ? recipes : favorites
  const isLoading = tab === 'mine' ? loading : loadingFavs

  const filtered = activeList.filter(r => {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-bark">My Recipes</h1>
        </div>
        <Link
          to="/add"
          className="px-4 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Recipe</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab('mine')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
            tab === 'mine' ? 'text-sage' : 'text-warm-gray hover:text-bark'
          }`}
        >
          My Recipes
          <span className="ml-1.5 text-xs text-warm-gray">({recipes.length})</span>
          {tab === 'mine' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage rounded-t" />}
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
            tab === 'favorites' ? 'text-terra' : 'text-warm-gray hover:text-bark'
          }`}
        >
          <Heart size={14} className={tab === 'favorites' ? 'fill-terra' : ''} />
          Favorites
          <span className="text-xs text-warm-gray">({favorites.length})</span>
          {tab === 'favorites' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terra rounded-t" />}
        </button>
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-bark placeholder:text-warm-gray-light focus:border-sage focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-warm-gray" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-border rounded-lg px-3 py-2.5 bg-surface text-bark focus:border-sage focus:outline-none"
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
                : 'bg-surface text-warm-gray border-border hover:border-sage/40'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {isLoading ? (
        <div className="text-center py-20 text-warm-gray text-sm">Loading recipes...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-warm-gray mb-4">
            {activeList.length === 0
              ? tab === 'favorites'
                ? 'No favorites yet. Like recipes on the Feed to save them here!'
                : 'No recipes yet. Add your first one!'
              : 'No recipes match your search.'}
          </p>
          {activeList.length === 0 && tab === 'mine' && (
            <Link
              to="/add"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark transition-colors"
            >
              <Plus size={16} />
              Add Recipe
            </Link>
          )}
          {activeList.length === 0 && tab === 'favorites' && (
            <Link to="/" className="text-sm text-sage font-medium hover:underline">
              Browse the Feed
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
