import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSettings() {
  const { user, profile, displayName, updateProfile } = useAuth()
  const [name, setName] = useState(profile?.display_name || profile?.rsn || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await updateProfile({
      display_name: name.trim() || null,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Profile updated!')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <Link to="/" className="text-sm text-warm-gray hover:text-bark flex items-center gap-1 transition-colors mb-6">
        <ArrowLeft size={15} />
        Feed
      </Link>

      <h1 className="font-serif text-2xl text-bark mb-8">Profile Settings</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {error && (
          <p className="text-sm text-terra bg-terra/5 border border-terra/20 rounded-lg px-4 py-2.5">{error}</p>
        )}
        {message && (
          <p className="text-sm text-sage bg-sage/5 border border-sage/20 rounded-lg px-4 py-2.5">{message}</p>
        )}

        {/* Avatar preview */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-sage-muted flex items-center justify-center">
            <span className="text-2xl font-semibold text-sage-light uppercase">
              {(name.trim() || displayName)[0]}
            </span>
          </div>
          <p className="text-[11px] text-warm-gray">Your avatar is your display name initial</p>
        </div>

        {/* Display Name */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Display Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="How others see you"
            className="px-4 py-2.5 rounded-lg border border-border bg-surface text-bark text-sm focus:border-sage focus:outline-none"
          />
        </label>

        {/* Email (read-only) */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-warm-gray uppercase tracking-wider">Email</span>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="px-4 py-2.5 rounded-lg border border-border bg-cream-dark text-warm-gray text-sm cursor-not-allowed"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 px-6 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
