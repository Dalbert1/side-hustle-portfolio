import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, X, GripVertical, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import ImageUpload from '../components/ImageUpload'
import RatingStars from '../components/RatingStars'

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other']

const EMPTY_RECIPE = {
  title: '',
  description: '',
  hero_image_url: null,
  category: 'dinner',
  prep_minutes: '',
  cook_minutes: '',
  servings: '',
  rating: null,
  rating_notes: '',
  tags: [],
  ingredients: [{ name: '', amount: '', unit: '' }],
  steps: [{ instruction: '', image_url: null }],
  nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '', sugar: '', sodium: '' },
  notes: '',
  made_on: '',
}

export default function RecipeForm({ isEdit = false }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_RECIPE)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [dragIngredientIndex, setDragIngredientIndex] = useState(null)

  useEffect(() => {
    if (isEdit && id) loadRecipe()
  }, [isEdit, id])

  async function loadRecipe() {
    const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
    if (data) {
      setForm({
        ...EMPTY_RECIPE,
        ...data,
        description: data.description || '',
        prep_minutes: data.prep_minutes || '',
        cook_minutes: data.cook_minutes || '',
        servings: data.servings || '',
        ingredients: data.ingredients?.length > 0 ? data.ingredients : [{ name: '', amount: '', unit: '' }],
        steps: data.steps?.length > 0 ? data.steps : [{ instruction: '', image_url: null }],
        nutrition: data.nutrition || EMPTY_RECIPE.nutrition,
        notes: data.notes || '',
        rating_notes: data.rating_notes || '',
        made_on: data.made_on || '',
      })
    }
    setLoading(false)
  }

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function updateIngredient(index, field, value) {
    setForm(f => {
      const updated = [...f.ingredients]
      updated[index] = { ...updated[index], [field]: value }
      return { ...f, ingredients: updated }
    })
  }

  function addIngredient() {
    setForm(f => ({ ...f, ingredients: [...f.ingredients, { name: '', amount: '', unit: '' }] }))
  }

  function removeIngredient(index) {
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== index) }))
  }

  function moveIngredient(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= form.ingredients.length) return
    setForm(f => {
      const updated = [...f.ingredients]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return { ...f, ingredients: updated }
    })
  }

  function handleIngredientDragStart(e, index) {
    setDragIngredientIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleIngredientDragOver(e, index) {
    e.preventDefault()
    if (dragIngredientIndex === null || dragIngredientIndex === index) return
    moveIngredient(dragIngredientIndex, index)
    setDragIngredientIndex(index)
  }

  function handleIngredientDragEnd() {
    setDragIngredientIndex(null)
  }

  function updateStep(index, field, value) {
    setForm(f => {
      const updated = [...f.steps]
      updated[index] = { ...updated[index], [field]: value }
      return { ...f, steps: updated }
    })
  }

  function addStep() {
    setForm(f => ({ ...f, steps: [...f.steps, { instruction: '', image_url: null }] }))
  }

  function removeStep(index) {
    setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }))
  }

  function updateNutrition(field, value) {
    setForm(f => ({ ...f, nutrition: { ...f.nutrition, [field]: value } }))
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      update('tags', [...form.tags, tag])
    }
    setTagInput('')
  }

  function removeTag(tag) {
    update('tags', form.tags.filter(t => t !== tag))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required.'); return }

    setSaving(true)
    setError('')

    // Clean up empty ingredients/steps
    const ingredients = form.ingredients.filter(i => i.name.trim())
    const steps = form.steps.filter(s => s.instruction.trim())

    // Clean nutrition (convert to numbers, null out empty)
    const nutrition = {}
    let hasNutrition = false
    for (const [key, val] of Object.entries(form.nutrition)) {
      if (val !== '' && val != null) {
        nutrition[key] = Number(val)
        hasNutrition = true
      }
    }

    const payload = {
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      hero_image_url: form.hero_image_url,
      category: form.category,
      prep_minutes: form.prep_minutes ? Number(form.prep_minutes) : null,
      cook_minutes: form.cook_minutes ? Number(form.cook_minutes) : null,
      servings: form.servings ? Number(form.servings) : null,
      rating: form.rating,
      rating_notes: form.rating_notes.trim() || null,
      tags: form.tags,
      ingredients,
      steps,
      nutrition: hasNutrition ? nutrition : null,
      notes: form.notes.trim() || null,
      made_on: form.made_on || null,
    }

    let result
    if (isEdit) {
      result = await supabase.from('recipes').update(payload).eq('id', id).select().single()
    } else {
      result = await supabase.from('recipes').insert(payload).select().single()
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
    } else {
      navigate(`/recipe/${result.data.id}`)
    }
  }

  if (loading) return <div className="text-center py-20 text-warm-gray text-sm">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <Link to={isEdit ? `/recipe/${id}` : '/'} className="text-sm text-warm-gray hover:text-bark flex items-center gap-1 transition-colors mb-6">
        <ArrowLeft size={15} />
        {isEdit ? 'Back to recipe' : 'All Recipes'}
      </Link>

      <h1 className="font-serif text-2xl text-bark mb-8">{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && (
          <p className="text-sm text-terra bg-terra/5 border border-terra/20 rounded-lg px-4 py-2.5">{error}</p>
        )}

        {/* Hero Image */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-2 block">Photo</label>
          <div className="max-w-sm">
            <ImageUpload
              value={form.hero_image_url}
              onChange={url => update('hero_image_url', url)}
              path={`${isEdit ? id : 'new-' + Date.now()}/hero`}
            />
          </div>
        </div>

        {/* Title + Description */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Title *</span>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              required
              placeholder="What are we making?"
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Description</span>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={2}
              placeholder="Brief description of the dish..."
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm resize-y focus:border-sage focus:outline-none"
            />
          </label>
        </div>

        {/* Category + Times + Servings + Date */}
        <div className="grid sm:grid-cols-5 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Category</span>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm capitalize focus:border-sage focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Prep (min)</span>
            <input
              type="number"
              value={form.prep_minutes}
              onChange={e => update('prep_minutes', e.target.value)}
              min="0"
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Cook (min)</span>
            <input
              type="number"
              value={form.cook_minutes}
              onChange={e => update('cook_minutes', e.target.value)}
              min="0"
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Servings</span>
            <input
              type="number"
              value={form.servings}
              onChange={e => update('servings', e.target.value)}
              min="1"
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Date Made</span>
            <input
              type="date"
              value={form.made_on}
              onChange={e => update('made_on', e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
            />
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-sage-muted text-sage-light font-medium flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-terra" aria-label={`Remove tag ${tag}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Add a tag..."
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
            />
            <button type="button" onClick={addTag} className="px-3 py-2 text-xs font-medium text-sage border border-sage/30 rounded-lg hover:bg-sage-muted transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3 block">Ingredients</label>
          <div className="flex flex-col gap-2">
            {form.ingredients.map((ing, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 ${dragIngredientIndex === i ? 'opacity-50' : ''}`}
                draggable
                onDragStart={e => handleIngredientDragStart(e, i)}
                onDragOver={e => handleIngredientDragOver(e, i)}
                onDragEnd={handleIngredientDragEnd}
              >
                {form.ingredients.length > 1 && (
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveIngredient(i, i - 1)}
                      disabled={i === 0}
                      className="p-0.5 text-warm-gray hover:text-sage disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move ingredient up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <GripVertical size={14} className="text-warm-gray cursor-grab" />
                    <button
                      type="button"
                      onClick={() => moveIngredient(i, i + 1)}
                      disabled={i === form.ingredients.length - 1}
                      className="p-0.5 text-warm-gray hover:text-sage disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move ingredient down"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={ing.amount}
                  onChange={e => updateIngredient(i, 'amount', e.target.value)}
                  placeholder="Amt"
                  className="w-16 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-20 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
                />
                <input
                  type="text"
                  value={ing.name}
                  onChange={e => updateIngredient(i, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
                />
                {form.ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)} className="p-1.5 text-warm-gray-light hover:text-terra transition-colors" aria-label="Remove ingredient">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addIngredient} className="mt-2 text-xs font-medium text-sage flex items-center gap-1 hover:underline py-1">
            <Plus size={13} />
            Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-3 block">Steps</label>
          <div className="flex flex-col gap-3">
            {form.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-sage text-white text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-2">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    value={step.instruction}
                    onChange={e => updateStep(i, 'instruction', e.target.value)}
                    placeholder={`Step ${i + 1}...`}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-bark resize-y focus:border-sage focus:outline-none"
                  />
                </div>
                {form.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="p-1.5 text-warm-gray-light hover:text-terra transition-colors mt-2" aria-label="Remove step">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addStep} className="mt-2 text-xs font-medium text-sage flex items-center gap-1 hover:underline py-1">
            <Plus size={13} />
            Add step
          </button>
        </div>

        {/* Nutrition */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-1 block">Nutrition (per serving)</label>
          <p className="text-[11px] text-warm-gray mb-3">Optional - fill in what you know</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'calories', label: 'Calories' },
              { key: 'protein', label: 'Protein (g)' },
              { key: 'carbs', label: 'Carbs (g)' },
              { key: 'fat', label: 'Fat (g)' },
              { key: 'fiber', label: 'Fiber (g)' },
              { key: 'sugar', label: 'Sugar (g)' },
              { key: 'sodium', label: 'Sodium (mg)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-[10px] text-warm-gray">{label}</span>
                <input
                  type="number"
                  value={form.nutrition[key]}
                  onChange={e => updateNutrition(key, e.target.value)}
                  min="0"
                  className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-2 block">My Rating</label>
          <RatingStars value={form.rating} onChange={v => update('rating', v)} />
          <input
            type="text"
            value={form.rating_notes}
            onChange={e => update('rating_notes', e.target.value)}
            placeholder="Rating notes (e.g. kids loved it, needs more salt...)"
            className="mt-2 w-full px-4 py-2 rounded-lg border border-border bg-surface text-sm text-bark focus:border-sage focus:outline-none"
          />
        </div>

        {/* Notes */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Notes</span>
          <textarea
            value={form.notes}
            onChange={e => update('notes', e.target.value)}
            rows={3}
            placeholder="Personal notes, tweaks, ideas for next time..."
            className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm resize-y focus:border-sage focus:outline-none"
          />
        </label>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Recipe' : 'Save Recipe'}
          </button>
          <Link to={isEdit ? `/recipe/${id}` : '/'} className="text-sm text-warm-gray hover:text-bark transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
