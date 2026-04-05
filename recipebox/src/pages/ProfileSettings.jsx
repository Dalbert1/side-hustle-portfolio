import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSettings() {
  const { user, profile, displayName, updateProfile } = useAuth()
  const [name, setName] = useState(profile?.display_name || profile?.rsn || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const url = data.publicUrl + '?t=' + Date.now()
      setAvatarUrl(url)
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await updateProfile({
      display_name: name.trim() || null,
      avatar_url: avatarUrl,
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

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                <User size={36} className="text-warm-gray-light" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-sage text-white rounded-full flex items-center justify-center hover:bg-sage-dark transition-colors shadow-lg"
              aria-label="Change avatar"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
            </button>
          </div>
          <p className="text-[11px] text-warm-gray">Click the camera to upload a photo</p>
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
          className="mt-2 px-6 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  )
}
