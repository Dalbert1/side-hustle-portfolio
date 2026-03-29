import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-parchment-dim hover:text-gold transition-colors text-sm no-underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        All Activities
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gold mb-1">Add New Activity</h1>
          <p className="text-sm text-parchment-dim">
            OSRS is always changing. Add a new boss, minigame, or activity that isn't in the list yet.
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-parchment mb-1.5">Activity Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. New Boss Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-parchment mb-1.5">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment focus:outline-none focus:border-gold transition-colors appearance-none"
            >
              <option value="" className="text-parchment-dim">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="text-parchment">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-parchment mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors resize-y"
              placeholder="Brief description of the activity (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Adding...' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  )
}
