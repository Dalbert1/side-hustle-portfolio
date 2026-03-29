import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Clock, User, ImageIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Community() {
  const { user } = useAuth()
  const [setups, setSetups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublicSetups()
  }, [])

  async function loadPublicSetups() {
    // Fetch public setups (no join - user_screenshots FK points to auth.users, not user_profiles)
    const { data, error } = await supabase
      .from('user_screenshots')
      .select('*')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Failed to load public setups:', error.message)
      setSetups([])
      setLoading(false)
      return
    }

    // Fetch display names for each unique user
    const userIds = [...new Set((data || []).map(s => s.user_id))]
    const profileMap = {}

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, rsn')
        .in('id', userIds)

      for (const p of profiles || []) {
        profileMap[p.id] = p.rsn || null
      }
    }

    const enriched = (data || []).map(s => ({
      ...s,
      display_name: profileMap[s.user_id] || null,
    }))

    setSetups(enriched)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <span className="text-gold-muted text-sm animate-pulse">Loading community setups...</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gold">Community Setups</h1>
        <p className="text-text-secondary text-sm mt-1">
          Public gear and inventory setups shared by other players.
          {!user && (
            <> <Link to="/login" className="text-gold hover:text-gold-hover transition-colors duration-150">Sign in</Link> to share your own.</>
          )}
        </p>
      </header>

      {setups.length === 0 ? (
        <div className="border border-border-subtle rounded-md p-8 text-center">
          <Globe className="w-8 h-8 text-text-muted/30 mx-auto mb-2" aria-hidden="true" />
          <p className="text-text-muted text-sm mb-1">No public setups yet.</p>
          <p className="text-text-muted/60 text-[12px]">
            Be the first to share! Toggle any of your setups to "Public" on the activity page.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {setups.map(setup => {
            const isOwnSetup = user && setup.user_id === user.id

            return (
              <div
                key={setup.id}
                className="border border-border-subtle rounded-md overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      to={`/activity/${setup.activity_slug}`}
                      className="text-sm font-medium text-text-primary hover:text-gold transition-colors duration-150 no-underline truncate"
                    >
                      {setup.activity_name}
                    </Link>
                    {isOwnSetup && (
                      <span className="text-[10px] text-gold bg-gold/8 px-1.5 py-0.5 rounded flex-shrink-0">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted flex-shrink-0">
                    {setup.display_name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" aria-hidden="true" />
                        {setup.display_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {new Date(setup.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Screenshots */}
                <div className="grid grid-cols-2 gap-px bg-border-subtle">
                  <div className="bg-surface-base">
                    {setup.gear_url ? (
                      <div>
                        <div className="px-2 py-1 text-[10px] text-text-muted font-medium">Gear</div>
                        <img src={setup.gear_url} alt={`${setup.activity_name} gear`} className="w-full block" loading="lazy" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <span className="text-[11px] text-text-muted/40">No gear image</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-surface-base">
                    {setup.inventory_url ? (
                      <div>
                        <div className="px-2 py-1 text-[10px] text-text-muted font-medium">Inventory</div>
                        <img src={setup.inventory_url} alt={`${setup.activity_name} inventory`} className="w-full block" loading="lazy" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <span className="text-[11px] text-text-muted/40">No inventory image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {setup.notes && (
                  <div className="px-3 py-2 border-t border-border-subtle">
                    <p className="text-[12px] text-text-secondary whitespace-pre-wrap">{setup.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
