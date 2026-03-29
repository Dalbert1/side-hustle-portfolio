import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Combat Minigames',
  'Skilling Minigames',
  'Combat & Skilling Minigames',
  'Miscellaneous Minigames',
  'Raids',
  'Distractions & Diversions',
  'World Bosses',
  'God Wars Dungeon',
  'Slayer Bosses',
  'Wilderness Bosses',
  'Quest & Other Bosses',
  'Skilling Bosses',
  'Custom Activities',
]

export default function AddActivity() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Activity name is required.')
      return
    }
    if (!category) {
      setError('Please select a category.')
      return
    }

    setLoading(true)

    const { data, error: insertError } = await supabase
      .from('custom_activities')
      .insert({
        name: name.trim(),
        category,
        description: description.trim() || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    navigate(`/activity/custom-${data.id}`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-text-muted hover:text-gold transition-colors duration-150 text-[13px] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Activities
      </Link>

      <header className="mb-5">
        <h1 className="text-xl font-bold text-gold">Add Activity</h1>
        <p className="text-text-secondary text-sm mt-1">
          Add a new boss, minigame, or activity that isn't in the list yet.
        </p>
      </header>

      {error && (
        <div className="bg-danger/8 border border-danger/20 text-danger rounded-md p-2.5 mb-4 text-[13px]" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="activity-name" className="block text-[13px] font-medium text-text-primary mb-1">Name *</label>
          <input
            id="activity-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
            placeholder="e.g. New Boss Name"
          />
        </div>

        <div>
          <label htmlFor="activity-category" className="block text-[13px] font-medium text-text-primary mb-1">Category *</label>
          <select
            id="activity-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary focus:outline-none focus:border-gold transition-colors duration-150 appearance-none"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="activity-description" className="block text-[13px] font-medium text-text-primary mb-1">Description</label>
          <textarea
            id="activity-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150 resize-y"
            placeholder="Brief description (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-3 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          {loading ? 'Adding...' : 'Add Activity'}
        </button>
      </form>
    </div>
  )
}
