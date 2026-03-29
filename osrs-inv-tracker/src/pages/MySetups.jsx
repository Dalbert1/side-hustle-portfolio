import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon, Clock, Globe, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function MySetups() {
  const { user } = useAuth()
  const [setups, setSetups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSetups()
  }, [user])

  async function loadSetups() {
    if (!user) return

    const { data } = await supabase
      .from('user_screenshots')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    setSetups(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <span className="text-gold-muted text-sm animate-pulse">Loading your setups...</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gold">My Setups</h1>
        <p className="text-text-secondary text-sm mt-1">
          {setups.length} saved setup{setups.length !== 1 ? 's' : ''}.
          {setups.filter(s => s.is_public).length > 0 && (
            <> {setups.filter(s => s.is_public).length} shared publicly.</>
          )}
        </p>
      </header>

      {setups.length === 0 ? (
        <div className="border border-border-subtle rounded-md p-8 text-center">
          <p className="text-text-muted text-sm mb-3">No setups saved yet.</p>
          <Link
            to="/"
            className="inline-block bg-gold hover:bg-gold-hover text-text-on-gold font-semibold text-sm py-2 px-4 rounded-md transition-colors duration-150 no-underline"
          >
            Browse Activities
          </Link>
        </div>
      ) : (
        <div className="border border-border-subtle rounded-md divide-y divide-border-subtle overflow-hidden">
          {setups.map(setup => (
            <Link
              key={setup.id}
              to={`/activity/${setup.activity_slug}`}
              className="flex items-center gap-3 px-3 py-3 hover:bg-surface-hover transition-colors duration-150 no-underline group"
            >
              {/* Thumbnail previews */}
              <div className="flex gap-1.5 flex-shrink-0">
                {setup.gear_url ? (
                  <img src={setup.gear_url} alt="Gear" className="w-12 h-12 object-cover rounded border border-border-subtle" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 bg-surface-overlay rounded border border-border-subtle flex items-center justify-center">
                    <span className="text-[9px] text-text-muted">Gear</span>
                  </div>
                )}
                {setup.inventory_url ? (
                  <img src={setup.inventory_url} alt="Inventory" className="w-12 h-12 object-cover rounded border border-border-subtle" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 bg-surface-overlay rounded border border-border-subtle flex items-center justify-center">
                    <span className="text-[9px] text-text-muted">Inv</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm text-text-primary group-hover:text-gold transition-colors duration-150 font-medium truncate">
                    {setup.activity_name}
                  </h3>
                  {setup.is_public ? (
                    <Globe className="w-3 h-3 text-success flex-shrink-0" aria-label="Public" />
                  ) : (
                    <Lock className="w-3 h-3 text-text-muted flex-shrink-0" aria-label="Private" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-text-muted">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {new Date(setup.updated_at).toLocaleDateString()}
                </div>
                {setup.notes && (
                  <p className="text-[11px] text-text-muted mt-0.5 truncate">{setup.notes}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
