import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2, ImageIcon, RefreshCw, StickyNote, Save } from 'lucide-react'
import { getActivityBySlug } from '../data/activities'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Activity() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [activity, setActivity] = useState(null)
  const [setup, setSetup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState({ gear: false, inventory: false })
  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    loadActivity()
  }, [slug, user])

  async function loadActivity() {
    setLoading(true)

    // Check built-in activities first
    let found = getActivityBySlug(slug)

    // If not found and starts with "custom-", fetch from DB
    if (!found && slug.startsWith('custom-')) {
      const customId = slug.replace('custom-', '')
      const { data } = await supabase
        .from('custom_activities')
        .select('*')
        .eq('id', customId)
        .single()

      if (data) {
        found = {
          slug,
          name: data.name,
          category: data.category || 'Custom Activities',
          description: data.description || '',
          isCustom: true,
        }
      }
    }

    setActivity(found)

    // Load user's screenshots for this activity
    if (user && found) {
      const { data } = await supabase
        .from('user_screenshots')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_slug', slug)
        .single()

      if (data) {
        setSetup(data)
        setNotes(data.notes || '')
      }
    }

    setLoading(false)
  }

  async function handleUpload(type) {
    if (!user) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(prev => ({ ...prev, [type]: true }))

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${slug}/${type}.${fileExt}`

      // Upload to storage (upsert by removing old file first)
      await supabase.storage.from('osrs-screenshots').remove([filePath])
      const { error: uploadError } = await supabase.storage
        .from('osrs-screenshots')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message)
        setUploading(prev => ({ ...prev, [type]: false }))
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('osrs-screenshots')
        .getPublicUrl(filePath)

      // Add cache-busting param
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`

      // Upsert screenshot record
      const updateData = {
        user_id: user.id,
        activity_slug: slug,
        activity_name: activity.name,
        [`${type}_url`]: urlWithCacheBust,
        updated_at: new Date().toISOString(),
      }

      const { data: existing } = await supabase
        .from('user_screenshots')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_slug', slug)
        .single()

      if (existing) {
        await supabase
          .from('user_screenshots')
          .update({ [`${type}_url`]: urlWithCacheBust, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('user_screenshots')
          .insert(updateData)
      }

      // Reload
      await loadActivity()
      setUploading(prev => ({ ...prev, [type]: false }))
    }
    input.click()
  }

  async function handleDelete(type) {
    if (!user || !setup) return
    if (!confirm(`Remove your ${type} screenshot?`)) return

    const { data: files } = await supabase.storage
      .from('osrs-screenshots')
      .list(`${user.id}/${slug}`)

    const toRemove = files?.filter(f => f.name.startsWith(`${type}.`))
    if (toRemove?.length) {
      await supabase.storage
        .from('osrs-screenshots')
        .remove(toRemove.map(f => `${user.id}/${slug}/${f.name}`))
    }

    await supabase
      .from('user_screenshots')
      .update({ [`${type}_url`]: null, updated_at: new Date().toISOString() })
      .eq('id', setup.id)

    await loadActivity()
  }

  async function handleSaveNotes() {
    if (!user || !setup) return
    setSavingNotes(true)

    await supabase
      .from('user_screenshots')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', setup.id)

    setEditingNotes(false)
    setSavingNotes(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gold animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-parchment-dim text-lg mb-4">Activity not found.</p>
        <Link to="/" className="text-gold hover:text-gold-light transition-colors">
          Back to activities
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-parchment-dim hover:text-gold transition-colors text-sm no-underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        All Activities
      </Link>

      {/* Activity header */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gold mb-1">{activity.name}</h1>
            <p className="text-sm text-parchment-dim mb-2">{activity.category}</p>
            {activity.description && (
              <p className="text-sm text-parchment/80">{activity.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {activity.combat_level > 0 && (
                <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-lg">
                  Combat Lvl {activity.combat_level}
                </span>
              )}
              {activity.location && (
                <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-lg">
                  {activity.location}
                </span>
              )}
              {activity.slayer_level && (
                <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-lg">
                  Slayer {activity.slayer_level}
                </span>
              )}
              {activity.classification === 'Dangerous' && (
                <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-lg">
                  Dangerous
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot sections */}
      {!user ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-parchment-dim/40 mx-auto mb-3" />
          <p className="text-parchment-dim mb-3">Sign in to save your gear and inventory screenshots for this activity.</p>
          <Link
            to="/login"
            className="inline-block bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2 px-6 rounded-lg transition-colors no-underline"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScreenshotCard
              label="Gear Setup"
              type="gear"
              url={setup?.gear_url}
              uploading={uploading.gear}
              onUpload={() => handleUpload('gear')}
              onDelete={() => handleDelete('gear')}
            />
            <ScreenshotCard
              label="Inventory Setup"
              type="inventory"
              url={setup?.inventory_url}
              uploading={uploading.inventory}
              onUpload={() => handleUpload('inventory')}
              onDelete={() => handleDelete('inventory')}
            />
          </div>

          {/* Notes section */}
          {setup && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-semibold text-parchment">Notes</h3>
                </div>
                {!editingNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-xs text-parchment-dim hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingNotes ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about this setup (prayer, spellbook, strategy tips...)"
                    className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-parchment text-sm placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors resize-y"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="flex items-center gap-1.5 bg-gold hover:bg-gold-light text-dark-bg text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-none"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingNotes ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditingNotes(false); setNotes(setup?.notes || '') }}
                      className="text-xs text-parchment-dim hover:text-parchment bg-dark-surface px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-dark-border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-parchment/80 whitespace-pre-wrap">
                  {notes || <span className="text-parchment-dim/50 italic">No notes yet. Click Edit to add some.</span>}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScreenshotCard({ label, type, url, uploading, onUpload, onDelete }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-parchment">{label}</h3>
        <div className="flex gap-1.5">
          <button
            onClick={onUpload}
            disabled={uploading}
            className="flex items-center gap-1 text-xs bg-gold/10 text-gold hover:bg-gold/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {uploading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : url ? (
              <RefreshCw className="w-3 h-3" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            {uploading ? 'Uploading...' : url ? 'Replace' : 'Upload'}
          </button>
          {url && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs bg-danger/10 text-danger hover:bg-danger/20 px-2 py-1 rounded-lg transition-colors cursor-pointer border-none"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {url ? (
          <img
            src={url}
            alt={`${label} screenshot`}
            className="w-full rounded-lg border border-dark-border"
            loading="lazy"
          />
        ) : (
          <div
            onClick={onUpload}
            className="flex flex-col items-center justify-center py-12 cursor-pointer group"
          >
            <ImageIcon className="w-10 h-10 text-parchment-dim/30 group-hover:text-gold/40 transition-colors mb-2" />
            <p className="text-xs text-parchment-dim/50 group-hover:text-parchment-dim transition-colors">
              Click to upload {type} screenshot
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
