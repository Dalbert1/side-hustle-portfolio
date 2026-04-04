import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Clock, UtensilsCrossed, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Feed() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [profiles, setProfiles] = useState({})
  const [myLikes, setMyLikes] = useState(new Set())
  const [commentCounts, setCommentCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFeed() }, [])

  async function loadFeed() {
    // Load all recipes, newest first
    const { data: recipesData } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!recipesData) { setLoading(false); return }
    setRecipes(recipesData)

    // Load profiles for display names
    const userIds = [...new Set(recipesData.map(r => r.user_id))]
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('id, email, rsn')
        .in('id', userIds)
      const map = {}
      profilesData?.forEach(p => { map[p.id] = p.rsn || p.email?.split('@')[0] || 'User' })
      setProfiles(map)
    }

    // Load my likes
    if (user) {
      const { data: likesData } = await supabase
        .from('recipe_likes')
        .select('recipe_id')
        .eq('user_id', user.id)
      setMyLikes(new Set(likesData?.map(l => l.recipe_id) || []))
    }

    // Load comment counts
    const recipeIds = recipesData.map(r => r.id)
    if (recipeIds.length > 0) {
      const { data: comments } = await supabase
        .from('recipe_comments')
        .select('recipe_id')
        .in('recipe_id', recipeIds)
      const counts = {}
      comments?.forEach(c => { counts[c.recipe_id] = (counts[c.recipe_id] || 0) + 1 })
      setCommentCounts(counts)
    }

    setLoading(false)
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

  if (loading) return <div className="text-center py-20 text-warm-gray text-sm">Loading feed...</div>

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl text-bark mb-2">Feed</h1>
      <p className="text-sm text-warm-gray mb-8">Latest recipes from everyone</p>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-warm-gray mb-4">No recipes posted yet.</p>
          <Link to="/add" className="text-sm text-sage font-medium hover:underline">Be the first to add one</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {recipes.map(recipe => (
            <FeedCard
              key={recipe.id}
              recipe={recipe}
              author={profiles[recipe.user_id] || 'User'}
              isOwn={recipe.user_id === user?.id}
              liked={myLikes.has(recipe.id)}
              commentCount={commentCounts[recipe.id] || 0}
              onLike={() => toggleLike(recipe.id)}
            />
          ))}
        </div>
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
    <article className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Author bar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sage-muted flex items-center justify-center">
            <span className="text-[10px] font-semibold text-sage-dark uppercase">
              {author[0]}
            </span>
          </div>
          <span className="text-sm font-medium text-bark">{author}</span>
          {isOwn && <span className="text-[9px] font-medium text-sage bg-sage-muted px-1.5 py-0.5 rounded-full">You</span>}
        </div>
        <span className="text-[11px] text-warm-gray">{dateStr}</span>
      </div>

      {/* Image */}
      <Link to={`/recipe/${recipe.id}`}>
        {recipe.hero_image_url ? (
          <div className="aspect-[16/10] overflow-hidden">
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
          <h2 className="font-serif text-lg text-bark hover:text-sage-dark transition-colors leading-snug">
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
                <span key={tag} className="px-2 py-0.5 rounded-full bg-sage-muted text-sage-dark font-medium">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
