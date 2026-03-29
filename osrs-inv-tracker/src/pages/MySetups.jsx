import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon, Clock, ArrowRight } from 'lucide-react'
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gold animate-pulse">Loading your setups...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gold mb-2">My Setups</h1>
      <p className="text-parchment-dim text-sm mb-8">
        All your saved gear and inventory screenshots in one place.
      </p>

      {setups.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-parchment-dim/30 mx-auto mb-3" />
          <p className="text-parchment-dim mb-4">You haven't saved any setups yet.</p>
          <Link
            to="/"
            className="inline-block bg-gold hover:bg-gold-light text-dark-bg font-semibold py-2 px-6 rounded-lg transition-colors no-underline"
          >
            Browse Activities
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {setups.map(setup => (
            <Link
              key={setup.id}
              to={`/activity/${setup.activity_slug}`}
              className="bg-dark-card border border-dark-border rounded-xl p-4 hover:bg-dark-hover transition-colors no-underline group flex items-center gap-4"
            >
              {/* Thumbnail previews */}
              <div className="flex gap-2 flex-shrink-0">
                {setup.gear_url ? (
                  <img src={setup.gear_url} alt="Gear" className="w-16 h-16 object-cover rounded-lg border border-dark-border" />
                ) : (
                  <div className="w-16 h-16 bg-dark-surface rounded-lg border border-dark-border flex items-center justify-center">
                    <span className="text-xs text-parchment-dim/40">Gear</span>
                  </div>
                )}
                {setup.inventory_url ? (
                  <img src={setup.inventory_url} alt="Inv" className="w-16 h-16 object-cover rounded-lg border border-dark-border" />
                ) : (
                  <div className="w-16 h-16 bg-dark-surface rounded-lg border border-dark-border flex items-center justify-center">
                    <span className="text-xs text-parchment-dim/40">Inv</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-parchment group-hover:text-gold transition-colors font-medium truncate">
                  {setup.activity_name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-parchment-dim/60">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(setup.updated_at).toLocaleDateString()}
                </div>
                {setup.notes && (
                  <p className="text-xs text-parchment-dim/50 mt-1 truncate">{setup.notes}</p>
                )}
              </div>

              <ArrowRight className="w-4 h-4 text-parchment-dim group-hover:text-gold transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
