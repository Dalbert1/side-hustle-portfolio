import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2, ImageIcon, RefreshCw, Save, Globe, Lock } from 'lucide-react'
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
  const [togglingVisibility, setTogglingVisibility] = useState(false)

  useEffect(() => {
    loadActivity()
  }, [slug, user])

  async function loadActivity() {
    setLoading(true)

    let found = getActivityBySlug(slug)

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

      await supabase.storage.from('osrs-screenshots').remove([filePath])
      const { error: uploadError } = await supabase.storage
        .from('osrs-screenshots')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message)
        setUploading(prev => ({ ...prev, [type]: false }))
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('osrs-screenshots')
        .getPublicUrl(filePath)

      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`

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

  async function toggleVisibility() {
    if (!user || !setup) return
    setTogglingVisibility(true)

    const newValue = !setup.is_public
    await supabase
      .from('user_screenshots')
      .update({ is_public: newValue, updated_at: new Date().toISOString() })
      .eq('id', setup.id)

    setSetup(prev => ({ ...prev, is_public: newValue }))
    setTogglingVisibility(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <span className="text-gold-muted text-sm animate-pulse">Loading...</span>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-text-secondary text-sm mb-3">Activity not found.</p>
        <Link to="/" className="text-gold hover:text-gold-hover transition-colors duration-150 text-sm">
          Back to activities
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1 text-text-muted hover:text-gold transition-colors duration-150 text-[13px] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Activities
      </Link>

      {/* Activity header */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gold leading-tight">{activity.name}</h1>
            <p className="text-[13px] text-text-muted mt-0.5">{activity.category}</p>
          </div>

          {/* Visibility toggle */}
          {user && setup && (setup.gear_url || setup.inventory_url) && (
            <button
              onClick={toggleVisibility}
              disabled={togglingVisibility}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-md border transition-colors duration-150 cursor-pointer flex-shrink-0 ${
                setup.is_public
                  ? 'bg-success/8 border-success/20 text-success hover:bg-success/15'
                  : 'bg-surface-overlay border-border-subtle text-text-muted hover:text-text-secondary'
              }`}
              aria-label={setup.is_public ? 'Set setup to private' : 'Set setup to public'}
            >
              {setup.is_public ? (
                <><Globe className="w-3 h-3" aria-hidden="true" /> Public</>
              ) : (
                <><Lock className="w-3 h-3" aria-hidden="true" /> Private</>
              )}
            </button>
          )}
        </div>

        {activity.description && (
          <p className="text-sm text-text-secondary mt-2 max-w-prose">{activity.description}</p>
        )}

        {/* Meta tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {activity.combat_level > 0 && (
            <span className="text-[11px] text-danger bg-danger/8 px-1.5 py-0.5 rounded tabular-nums">
              Combat {activity.combat_level}
            </span>
          )}
          {activity.location && (
            <span className="text-[11px] text-info bg-info/8 px-1.5 py-0.5 rounded">
              {activity.location}
            </span>
          )}
          {activity.slayer_level && (
            <span className="text-[11px] text-gold bg-gold/8 px-1.5 py-0.5 rounded tabular-nums">
              Slayer {activity.slayer_level}
            </span>
          )}
          {activity.classification === 'Dangerous' && (
            <span className="text-[11px] text-danger-muted bg-danger/5 px-1.5 py-0.5 rounded">
              Dangerous
            </span>
          )}
        </div>
      </header>

      {/* Screenshot sections */}
      {!user ? (
        <div className="border border-border-subtle rounded-md p-6 text-center">
          <p className="text-text-muted text-sm mb-3">Sign in to save screenshots for this activity.</p>
          <Link
            to="/login"
            className="inline-block bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-4 rounded-md transition-colors duration-150 no-underline"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScreenshotSlot
              label="Gear"
              type="gear"
              url={setup?.gear_url}
              uploading={uploading.gear}
              onUpload={() => handleUpload('gear')}
              onDelete={() => handleDelete('gear')}
            />
            <ScreenshotSlot
              label="Inventory"
              type="inventory"
              url={setup?.inventory_url}
              uploading={uploading.inventory}
              onUpload={() => handleUpload('inventory')}
              onDelete={() => handleDelete('inventory')}
            />
          </div>

          {/* Notes */}
          {setup && (
            <div className="border border-border-subtle rounded-md">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
                <span className="text-[13px] font-medium text-text-primary">Notes</span>
                {!editingNotes && (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-[12px] text-text-muted hover:text-gold transition-colors duration-150 bg-transparent border-none cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-3">
                {editingNotes ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Prayer, spellbook, strategy notes..."
                      aria-label="Setup notes"
                      className="w-full px-2.5 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150 resize-y"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="flex items-center gap-1 bg-gold hover:bg-gold-hover text-text-on-gold text-[12px] font-semibold px-2.5 py-1.5 rounded-md transition-colors duration-150 cursor-pointer border-none"
                      >
                        <Save className="w-3 h-3" aria-hidden="true" />
                        {savingNotes ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setEditingNotes(false); setNotes(setup?.notes || '') }}
                        className="text-[12px] text-text-muted hover:text-text-secondary px-2.5 py-1.5 rounded-md transition-colors duration-150 cursor-pointer bg-transparent border border-border-subtle"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {notes || <span className="text-text-muted italic">No notes yet.</span>}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScreenshotSlot({ label, type, url, uploading, onUpload, onDelete }) {
  return (
    <div className="border border-border-subtle rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
        <span className="text-[13px] font-medium text-text-primary">{label}</span>
        <div className="flex gap-1">
          <button
            onClick={onUpload}
            disabled={uploading}
            className="flex items-center gap-1 text-[11px] font-medium text-gold hover:text-gold-hover px-2 py-1 rounded transition-colors duration-150 cursor-pointer border-none bg-transparent disabled:opacity-50"
            aria-label={url ? `Replace ${label} screenshot` : `Upload ${label} screenshot`}
          >
            {uploading ? (
              <RefreshCw className="w-3 h-3 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="w-3 h-3" aria-hidden="true" />
            )}
            {uploading ? 'Uploading' : url ? 'Replace' : 'Upload'}
          </button>
          {url && (
            <button
              onClick={onDelete}
              className="text-[11px] text-danger-muted hover:text-danger px-1.5 py-1 rounded transition-colors duration-150 cursor-pointer border-none bg-transparent"
              aria-label={`Delete ${label} screenshot`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {url ? (
        <img
          src={url}
          alt={`${label} setup screenshot`}
          className="w-full block"
          loading="lazy"
        />
      ) : (
        <button
          onClick={onUpload}
          className="w-full flex flex-col items-center justify-center py-10 cursor-pointer group bg-transparent border-none"
          aria-label={`Upload ${label} screenshot`}
        >
          <ImageIcon className="w-8 h-8 text-text-muted/30 group-hover:text-gold-dim transition-colors duration-150 mb-1" aria-hidden="true" />
          <span className="text-[12px] text-text-muted/50 group-hover:text-text-muted transition-colors duration-150">
            Upload {type} screenshot
          </span>
        </button>
      )}
    </div>
  )
}
