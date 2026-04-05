import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Clock, Users, Edit, Trash2, ArrowLeft, Star, ChevronDown, ChevronUp,
  Heart, MessageCircle, Send, Calendar, ShoppingCart, Check,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import NutritionCard from '../components/NutritionCard'
import RatingStars from '../components/RatingStars'

export default function Recipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [author, setAuthor] = useState({ name: '', avatar_url: null })
  const [loading, setLoading] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [ratingNotes, setRatingNotes] = useState('')

  // Cart
  const { addRecipeToCart, removeRecipeFromCart, isRecipeInCart } = useCart()

  // Like state
  const [liked, setLiked] = useState(false)

  // Comments state
  const [comments, setComments] = useState([])
  const [commentProfiles, setCommentProfiles] = useState({})
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => { loadRecipe(); loadComments() }, [id])

  async function loadRecipe() {
    const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
    if (data) {
      setRecipe(data)
      setNotes(data.notes || '')
      setRatingNotes(data.rating_notes || '')

      // Load author name + avatar
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email, rsn, display_name, avatar_url')
        .eq('id', data.user_id)
        .single()
      setAuthor({
        name: profile?.display_name || profile?.rsn || profile?.email?.split('@')[0] || 'User',
        avatar_url: profile?.avatar_url || null,
      })

      // Check if current user liked it
      if (user) {
        const { data: likeData } = await supabase
          .from('recipe_likes')
          .select('user_id')
          .eq('user_id', user.id)
          .eq('recipe_id', id)
          .maybeSingle()
        setLiked(!!likeData)
      }
    }
    setLoading(false)
  }

  async function loadComments() {
    const { data } = await supabase
      .from('recipe_comments')
      .select('*')
      .eq('recipe_id', id)
      .order('created_at', { ascending: true })

    if (data) {
      setComments(data)
      const userIds = [...new Set(data.map(c => c.user_id))]
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, email, rsn, display_name, avatar_url')
          .in('id', userIds)
        const map = {}
        profiles?.forEach(p => {
          map[p.id] = {
            name: p.display_name || p.rsn || p.email?.split('@')[0] || 'User',
            avatar_url: p.avatar_url,
          }
        })
        setCommentProfiles(map)
      }
    }
  }

  async function toggleLike() {
    if (liked) {
      await supabase.from('recipe_likes').delete().eq('user_id', user.id).eq('recipe_id', id)
      setLiked(false)
      setRecipe(r => ({ ...r, like_count: Math.max(0, (r.like_count || 0) - 1) }))
    } else {
      await supabase.from('recipe_likes').insert({ user_id: user.id, recipe_id: id })
      setLiked(true)
      setRecipe(r => ({ ...r, like_count: (r.like_count || 0) + 1 }))
    }
  }

  async function submitComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmittingComment(true)
    await supabase.from('recipe_comments').insert({
      user_id: user.id,
      recipe_id: id,
      body: newComment.trim(),
    })
    setNewComment('')
    setSubmittingComment(false)
    loadComments()
  }

  async function deleteComment(commentId) {
    await supabase.from('recipe_comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  async function handleDelete() {
    if (!confirm('Delete this recipe? This cannot be undone.')) return
    await supabase.from('recipes').delete().eq('id', id)
    navigate('/')
  }

  async function handleRatingChange(rating) {
    const { data } = await supabase
      .from('recipes')
      .update({ rating })
      .eq('id', id)
      .select()
      .single()
    if (data) setRecipe(data)
  }

  async function saveNotes() {
    await supabase.from('recipes').update({ notes, rating_notes: ratingNotes }).eq('id', id)
    setRecipe(r => ({ ...r, notes, rating_notes: ratingNotes }))
    setEditingNotes(false)
  }

  if (loading) return <div className="text-center py-20 text-warm-gray text-sm">Loading...</div>
  if (!recipe) return <div className="text-center py-20 text-warm-gray">Recipe not found.</div>

  const isOwner = user?.id === recipe.user_id
  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)
  const ingredients = recipe.ingredients || []
  const steps = recipe.steps || []

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-sm text-warm-gray hover:text-bark flex items-center gap-1 transition-colors">
          <ArrowLeft size={15} />
          Feed
        </Link>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${id}`}
              className="px-3.5 py-2 text-xs font-medium text-sage border border-sage/30 rounded-lg hover:bg-sage-muted transition-colors flex items-center gap-1.5"
            >
              <Edit size={13} /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3.5 py-2 text-xs font-medium text-terra border border-terra/30 rounded-lg hover:bg-terra/5 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Hero image */}
      {recipe.hero_image_url && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-[16/9] bg-cream-dark">
          <img src={recipe.hero_image_url} alt={recipe.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {/* Title + Meta */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sage bg-sage-muted px-2.5 py-1 rounded-full">
            {recipe.category}
          </span>
          <span className="text-[11px] text-warm-gray">by {author.name}</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-bark mb-2">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-warm-gray text-sm leading-relaxed">{recipe.description}</p>
        )}
      </div>

      {/* Like + Comment counts */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-1 ${liked ? 'text-terra' : 'text-warm-gray hover:text-terra'}`}
        >
          <Heart size={18} className={liked ? 'fill-terra' : ''} />
          {(recipe.like_count || 0) > 0 && recipe.like_count}
          <span className="text-xs">{liked ? 'Liked' : 'Like'}</span>
        </button>
        <span className="flex items-center gap-1.5 text-sm text-warm-gray">
          <MessageCircle size={17} />
          {comments.length > 0 && comments.length}
        </span>
      </div>

      {/* Time + Servings + Date */}
      <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-border">
        {recipe.prep_minutes > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-bark">
            <Clock size={15} className="text-sage" />
            <span className="font-medium">{recipe.prep_minutes}m</span>
            <span className="text-warm-gray text-xs">prep</span>
          </div>
        )}
        {recipe.cook_minutes > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-bark">
            <Clock size={15} className="text-terra" />
            <span className="font-medium">{recipe.cook_minutes}m</span>
            <span className="text-warm-gray text-xs">cook</span>
          </div>
        )}
        {totalTime > 0 && (
          <div className="text-xs text-warm-gray border-l border-border pl-4">{totalTime}m total</div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-1.5 text-sm text-bark">
            <Users size={15} className="text-warm-gray" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
        {recipe.made_on && (
          <div className="flex items-center gap-1.5 text-sm text-warm-gray">
            <Calendar size={14} />
            <span>Made {new Date(recipe.made_on + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Rating (only owner) */}
      {isOwner && (
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs text-warm-gray uppercase tracking-wider font-medium">My Rating</span>
          <RatingStars value={recipe.rating} onChange={handleRatingChange} />
        </div>
      )}

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-sage-muted text-sage-light font-medium">{tag}</span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-bark">Ingredients</h2>
            {isRecipeInCart(recipe.id) ? (
              <button
                onClick={() => removeRecipeFromCart(recipe.id)}
                className="px-3 py-1.5 text-xs font-medium text-sage border border-sage/30 rounded-lg hover:bg-sage-muted transition-colors flex items-center gap-1.5"
              >
                <Check size={13} />
                In Cart
              </button>
            ) : (
              <button
                onClick={() => addRecipeToCart(recipe)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-sage rounded-lg hover:bg-sage-dark transition-colors flex items-center gap-1.5"
              >
                <ShoppingCart size={13} />
                Add to Cart
              </button>
            )}
          </div>
          <ul className="flex flex-col gap-2">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-baseline gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-1.5" />
                <span>
                  {ing.amount && <span className="font-medium text-bark">{ing.amount}</span>}
                  {ing.unit && <span className="text-warm-gray"> {ing.unit}</span>}
                  {' '}<span className="text-bark">{ing.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg text-bark mb-4">Instructions</h2>
          <ol className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-sage text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-bark leading-relaxed">{step.instruction}</p>
                  {step.image_url && (
                    <img src={step.image_url} alt={`Step ${i + 1}`} className="mt-3 rounded-lg max-w-sm w-full object-cover" loading="lazy" />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Nutrition */}
      <div className="mb-8">
        <NutritionCard nutrition={recipe.nutrition} />
      </div>

      {/* Notes (only owner) */}
      {isOwner && (
        <div className="mb-8">
          <button
            onClick={() => setShowNotes(n => !n)}
            className="flex items-center gap-2 text-sm font-medium text-warm-gray hover:text-bark transition-colors py-2"
          >
            {showNotes ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            Notes {recipe.notes ? '' : '(none)'}
          </button>
          {showNotes && (
            <div className="mt-2">
              {editingNotes ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-bark resize-y min-h-[100px] focus:border-sage focus:outline-none"
                    placeholder="Personal notes, tweaks, ideas..."
                  />
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-warm-gray">Rating notes</span>
                    <input type="text" value={ratingNotes} onChange={e => setRatingNotes(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
                      placeholder="e.g. kids loved it, needs more salt..." />
                  </label>
                  <div className="flex gap-2">
                    <button onClick={saveNotes} className="px-4 py-2 bg-sage text-white text-xs font-semibold rounded-lg hover:bg-sage-dark transition-colors">Save</button>
                    <button onClick={() => { setEditingNotes(false); setNotes(recipe.notes || ''); setRatingNotes(recipe.rating_notes || '') }}
                      className="px-4 py-2 text-xs text-warm-gray hover:text-bark transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  {recipe.notes ? <p className="text-sm text-bark/80 leading-relaxed whitespace-pre-wrap">{recipe.notes}</p> : <p className="text-sm text-warm-gray italic">No notes yet.</p>}
                  {recipe.rating_notes && <p className="text-xs text-warm-gray mt-2 italic">Rating: {recipe.rating_notes}</p>}
                  <button onClick={() => setEditingNotes(true)} className="mt-3 text-xs text-sage font-medium hover:underline">Edit notes</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-border pt-8">
        <h2 className="font-serif text-lg text-bark mb-6 flex items-center gap-2">
          <MessageCircle size={18} className="text-warm-gray" />
          Comments {comments.length > 0 && <span className="text-sm font-sans text-warm-gray font-normal">({comments.length})</span>}
        </h2>

        {/* Comment form */}
        <form onSubmit={submitComment} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submittingComment}
            className="px-4 py-2.5 bg-sage text-white rounded-lg hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Post comment"
          >
            <Send size={15} />
          </button>
        </form>

        {/* Comment list */}
        {comments.length === 0 ? (
          <p className="text-sm text-warm-gray italic">No comments yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                {commentProfiles[c.user_id]?.avatar_url ? (
                  <img src={commentProfiles[c.user_id].avatar_url} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-sage-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-semibold text-sage-light uppercase">
                      {(commentProfiles[c.user_id]?.name || 'U')[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-bark">{commentProfiles[c.user_id]?.name || 'User'}</span>
                    <span className="text-[10px] text-warm-gray">
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {c.user_id === user?.id && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="text-[10px] text-warm-gray-light hover:text-terra transition-colors ml-auto"
                      >
                        delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-bark/80 leading-relaxed mt-0.5">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
