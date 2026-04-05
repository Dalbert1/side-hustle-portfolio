import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Clock, UtensilsCrossed, Star, ChevronDown, Search, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const PAGE_SIZE = 10
const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other']

export default function Feed() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [profiles, setProfiles] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [commentCounts, setCommentCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const searchTimer = useRef(null)
  const activeSearch = useRef('')
  const activeCategory = useRef('all')

  // Load likes once on mount
  useEffect(() => {
    if (user) {
      supabase
        .from('recipe_likes')
        .select('recipe_id')
        .eq('user_id', user.id)
        .then(({ data }) => setMyLikes(new Set(data?.map(l => l.recipe_id) || [])))
    }
  }, [user])

  const loadPage = useCallback(async (pageNum, append = false, searchQuery = '', cat = 'all') => {
    if (pageNum > 0) setLoadingMore(true)
    else setLoading(true)

    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('recipes')
      .select('id, user_id, title, description, hero_image_url, category, prep_minutes, cook_minutes, servings, rating, tags, like_count, made_on, created_at')
      .order('created_at', { ascending: false })

    if (cat !== 'all') {
      query = query.eq('category', cat)
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery.toLowerCase()}}`)
    }

    query = query.range(from, to)

    const { data: recipesData } = await query

    if (!recipesData) {
      setLoading(false)
      setLoadingMore(false)
      return
    }

    if (recipesData.length < PAGE_SIZE) setHasMore(false)
    else setHasMore(true)

    const allRecipes = append ? [...recipes, ...recipesData] : recipesData

    // Load profiles for new recipes
    const existingProfiles = append ? profiles : {}
    const newUserIds = [...new Set(recipesData.map(r => r.user_id))].filter(id => !existingProfiles[id])
    let updatedProfiles = existingProfiles
    if (newUserIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('id, email, rsn, display_name')
        .in('id', newUserIds)
      updatedProfiles = { ...existingProfiles }
      profilesData?.forEach(p => {
        updatedProfiles[p.id] = { name: p.display_name || p.rsn || p.email?.split('@')[0] || 'User' }
      })
      setProfiles(updatedProfiles)
    }

    // Load comment counts for new recipes
    const newIds = recipesData.map(r => r.id)
    if (newIds.length > 0) {
      const { data: comments } = await supabase
        .from('recipe_comments')
        .select('recipe_id')
        .in('recipe_id', newIds)
      const counts = append ? { ...commentCounts } : {}
      comments?.forEach(c => { counts[c.recipe_id] = (counts[c.recipe_id] || 0) + 1 })
      setCommentCounts(counts)
    }

    setRecipes(allRecipes)
    setLoading(false)
    setLoadingMore(false)
  }, [recipes, profiles, commentCounts])

  useEffect(() => { loadPage(0) }, [])

  function resetAndSearch(newSearch, newCategory) {
    activeSearch.current = newSearch
    activeCategory.current = newCategory
    setPage(0)
    setRecipes([])
    loadPage(0, false, newSearch, newCategory)
  }

  function handleSearchChange(value) {
    setSearch(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      resetAndSearch(value.trim(), activeCategory.current)
    }, 400)
  }

  function handleCategoryChange(cat) {
    setCategory(cat)
    resetAndSearch(activeSearch.current, cat)
  }

  function clearSearch() {
    setSearch('')
    resetAndSearch('', activeCategory.current)
  }

  function loadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    loadPage(nextPage, true, activeSearch.current, activeCategory.current)
  }

  async function toggleLike(recipeId) {
    if (myLikes.has(recipeId)) {
      await supabase.from('recipe_likes').delete().eq('user_id', user.id).eq('recipe_id', recipeId)
      setMyLikes(prev => { const next = new Set(prev); next.delete(recipeId); return next })
      setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, like_count: Math.max(0, (r.like_count || 0) - 1) } : r))
    } else {
      await supabase.from('recipe_likes').insert({ user_id: user.id, recipe_id: recipeId })
      setMyLikes(prev => new Set(prev).add(recipeId))
      setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, like_count: (r.like_count || 0) + 1 } : r))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl text-bark mb-2">Feed</h1>
      <p className="text-sm text-warm-gray mb-6">Latest recipes from everyone</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray-light" />
        <input
          type="text"
          placeholder="Search recipes or tags..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-surface text-sm text-bark placeholder:text-warm-gray-light focus:border-sage focus:outline-none"
        />
        {search && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-bark transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
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

      {loading ? (
        <div className="text-center py-20 text-warm-gray text-sm">Loading feed...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <UtensilsCrossed size={40} className="text-warm-gray-light mx-auto mb-4" />
          <p className="text-warm-gray mb-4">
            {search || category !== 'all' ? 'No recipes match your search.' : 'No recipes posted yet.'}
          </p>
          {!search && category === 'all' && (
            <Link to="/add" className="text-sm text-sage font-medium hover:underline">Be the first to add one</Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {recipes.map(recipe => (
              <FeedCard
                key={recipe.id}
                recipe={recipe}
                author={profiles[recipe.user_id] || { name: 'User' }}
                isOwn={recipe.user_id === user?.id}
                liked={myLikes.has(recipe.id)}
                commentCount={commentCounts[recipe.id] || 0}
                onLike={() => toggleLike(recipe.id)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 text-sm font-medium text-bark border border-border rounded-lg hover:bg-cream-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 mx-auto"
              >
                {loadingMore ? 'Loading...' : (
                  <>
                    <ChevronDown size={15} />
                    Load More
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function FeedCard({ recipe, author, isOwn, liked, commentCount, onLike }) {
  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)
  const dateStr = recipe.made_on
    ? new Date(recipe.made_on + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : new Date(recipe.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <article className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Author bar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sage-muted flex items-center justify-center">
            <span className="text-[10px] font-semibold text-sage-light uppercase">
              {author.name[0]}
            </span>
          </div>
          <span className="text-sm font-medium text-bark">{author.name}</span>
          {isOwn && <span className="text-[9px] font-medium text-sage bg-sage-muted px-1.5 py-0.5 rounded-full">You</span>}
        </div>
        <span className="text-[11px] text-warm-gray">{dateStr}</span>
      </div>

      {/* Image */}
      <Link to={`/recipe/${recipe.id}`}>
        {recipe.hero_image_url ? (
          <div className="aspect-[16/10] overflow-hidden bg-cream-dark">
            <img src={recipe.hero_image_url} alt={recipe.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-cream-dark flex items-center justify-center">
            <UtensilsCrossed size={36} className="text-warm-gray-light" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Actions row */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-terra' : 'text-warm-gray hover:text-terra'}`}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={18} className={liked ? 'fill-terra' : ''} />
            {(recipe.like_count || 0) > 0 && <span className="text-xs font-medium">{recipe.like_count}</span>}
          </button>
          <Link to={`/recipe/${recipe.id}`} className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-bark transition-colors">
            <MessageCircle size={17} />
            {commentCount > 0 && <span className="text-xs font-medium">{commentCount}</span>}
          </Link>
          {recipe.rating && (
            <div className="flex items-center gap-0.5 ml-auto">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < recipe.rating ? 'text-terra fill-terra' : 'text-warm-gray-light'} />
              ))}
            </div>
          )}
        </div>

        {/* Title + description */}
        <Link to={`/recipe/${recipe.id}`}>
          <h2 className="font-serif text-lg text-bark hover:text-sage-light transition-colors leading-snug">
            {recipe.title}
          </h2>
        </Link>
        {recipe.description && (
          <p className="text-sm text-warm-gray mt-1 line-clamp-2 leading-relaxed">{recipe.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-warm-gray">
          <span className="capitalize px-2 py-0.5 rounded-full bg-cream-dark font-medium">{recipe.category}</span>
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {totalTime} min
            </span>
          )}
          {recipe.tags?.length > 0 && (
            <div className="flex gap-1">
              {recipe.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-sage-muted text-sage-light font-medium">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
