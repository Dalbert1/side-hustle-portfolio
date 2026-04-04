import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Clock, Users, Edit, Trash2, ArrowLeft, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import NutritionCard from '../components/NutritionCard'
import RatingStars from '../components/RatingStars'

export default function Recipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [ratingNotes, setRatingNotes] = useState('')

  useEffect(() => {
    loadRecipe()
  }, [id])

  async function loadRecipe() {
    const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
    if (data) {
      setRecipe(data)
      setNotes(data.notes || '')
      setRatingNotes(data.rating_notes || '')
    }
    setLoading(false)
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

  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)
  const ingredients = recipe.ingredients || []
  const steps = recipe.steps || []

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-sm text-warm-gray hover:text-bark flex items-center gap-1 transition-colors">
          <ArrowLeft size={15} />
          All Recipes
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/edit/${id}`}
            className="px-3.5 py-2 text-xs font-medium text-sage border border-sage/30 rounded-lg hover:bg-sage-muted transition-colors flex items-center gap-1.5"
          >
            <Edit size={13} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 text-xs font-medium text-terra border border-terra/30 rounded-lg hover:bg-terra/5 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      {/* Hero image */}
      {recipe.hero_image_url && (
        <div className="rounded-xl overflow-hidden mb-6 aspect-[16/9]">
          <img src={recipe.hero_image_url} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title + Meta */}
      <div className="mb-6">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-sage bg-sage-muted px-2.5 py-1 rounded-full">
          {recipe.category}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-bark mt-3 mb-2">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-warm-gray text-sm leading-relaxed">{recipe.description}</p>
        )}
      </div>

      {/* Time + Servings + Rating */}
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
          <div className="text-xs text-warm-gray border-l border-border pl-4">
            {totalTime}m total
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-1.5 text-sm text-bark">
            <Users size={15} className="text-warm-gray" />
            <span>{recipe.servings} servings</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs text-warm-gray uppercase tracking-wider font-medium">My Rating</span>
        <RatingStars value={recipe.rating} onChange={handleRatingChange} />
      </div>

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-sage-muted text-sage-dark font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg text-bark mb-4">Ingredients</h2>
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
                <span className="w-7 h-7 rounded-full bg-sage text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-bark leading-relaxed">{step.instruction}</p>
                  {step.image_url && (
                    <img
                      src={step.image_url}
                      alt={`Step ${i + 1}`}
                      className="mt-3 rounded-lg max-w-sm w-full object-cover"
                      loading="lazy"
                    />
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

      {/* Notes */}
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
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm text-bark resize-y min-h-[100px] focus:border-sage focus:outline-none"
                  placeholder="Personal notes, tweaks, ideas..."
                />
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-warm-gray">Rating notes</span>
                  <input
                    type="text"
                    value={ratingNotes}
                    onChange={e => setRatingNotes(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-white text-sm text-bark focus:border-sage focus:outline-none"
                    placeholder="e.g. kids loved it, needs more salt..."
                  />
                </label>
                <div className="flex gap-2">
                  <button onClick={saveNotes} className="px-4 py-2 bg-sage text-white text-xs font-semibold rounded-lg hover:bg-sage-dark transition-colors">
                    Save
                  </button>
                  <button onClick={() => { setEditingNotes(false); setNotes(recipe.notes || ''); setRatingNotes(recipe.rating_notes || '') }}
                    className="px-4 py-2 text-xs text-warm-gray hover:text-bark transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {recipe.notes ? (
                  <p className="text-sm text-bark/80 leading-relaxed whitespace-pre-wrap">{recipe.notes}</p>
                ) : (
                  <p className="text-sm text-warm-gray italic">No notes yet.</p>
                )}
                {recipe.rating_notes && (
                  <p className="text-xs text-warm-gray mt-2 italic">Rating: {recipe.rating_notes}</p>
                )}
                <button
                  onClick={() => setEditingNotes(true)}
                  className="mt-3 text-xs text-sage font-medium hover:underline"
                >
                  Edit notes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
