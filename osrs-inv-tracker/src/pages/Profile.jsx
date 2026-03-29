import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, profile, updateProfile } = useAuth()
  const [rsn, setRsn] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) setRsn(profile.rsn || '')
  }, [profile])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    const { error } = await updateProfile({ rsn: rsn.trim() || null })

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-text-muted hover:text-gold transition-colors duration-150 text-[13px] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Activities
      </Link>

      <header className="mb-5">
        <h1 className="text-xl font-bold text-gold">Profile</h1>
        <p className="text-text-secondary text-sm mt-1">{user?.email}</p>
      </header>

      {error && (
        <div className="bg-danger/8 border border-danger/20 text-danger rounded-md p-2.5 mb-4 text-[13px]" role="alert">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-success/8 border border-success/20 text-success rounded-md p-2.5 mb-4 text-[13px]" role="status">
          Profile updated.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profile-rsn" className="block text-[13px] font-medium text-text-primary mb-1">
            RSN (RuneScape Name)
          </label>
          <input
            id="profile-rsn"
            type="text"
            value={rsn}
            onChange={e => setRsn(e.target.value)}
            maxLength={12}
            className="w-full px-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
            placeholder="Your RuneScape name"
          />
          <p className="text-[11px] text-text-muted mt-1">
            Shown on your public setups in the Community page. Leave blank to stay anonymous.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-4 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
        >
          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
