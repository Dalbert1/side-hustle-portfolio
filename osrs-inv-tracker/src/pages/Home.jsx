import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ChevronRight, Sword, Shield, Pickaxe, Skull, Crown, Compass, ImageIcon } from 'lucide-react'
import { activities, getParentCategories } from '../data/activities'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const categoryIcons = {
  'Minigames': Sword,
  'Minigame-like Activities': Shield,
  'Raids': Crown,
  'Distractions & Diversions': Compass,
  'Bosses': Skull,
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [expandedParents, setExpandedParents] = useState(new Set())
  const [expandedSubs, setExpandedSubs] = useState(new Set())
  const [customActivities, setCustomActivities] = useState([])
  const [userSetups, setUserSetups] = useState(new Set())
  const { user } = useAuth()

  useEffect(() => {
    loadCustomActivities()
    if (user) loadUserSetups()
  }, [user])

  async function loadCustomActivities() {
    const { data } = await supabase
      .from('custom_activities')
      .select('*')
      .order('name')

    if (data) {
      const mapped = data.map(item => ({
        slug: `custom-${item.id}`,
        name: item.name,
        category: item.category || 'Custom Activities',
        parentCategory: 'Custom Activities',
        description: item.description || '',
        isCustom: true,
        customId: item.id,
      }))
      setCustomActivities(mapped)
    }
  }

  async function loadUserSetups() {
    const { data } = await supabase
      .from('user_screenshots')
      .select('activity_slug')
      .eq('user_id', user.id)

    if (data) {
      setUserSetups(new Set(data.map(d => d.activity_slug)))
    }
  }

  const allActivities = useMemo(() => [...activities, ...customActivities], [customActivities])

  const parentCategories = useMemo(() => {
    const base = getParentCategories()
    // Add custom activities as a parent category if any exist
    if (customActivities.length > 0) {
      base.push({
        label: 'Custom Activities',
        subcategories: [{
          label: 'Custom Activities',
          parentCategory: 'Custom Activities',
          items: customActivities,
        }],
      })
    }
    return base
  }, [customActivities])

  const filtered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return allActivities.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.also_known_as?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    )
  }, [search, allActivities])

  function toggleParent(label) {
    setExpandedParents(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  function toggleSub(label) {
    setExpandedSubs(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-2">OSRS Activity Helper</h1>
        <p className="text-parchment-dim">
          Track your gear and inventory setups for every boss, raid, and minigame.
        </p>
        {!user && (
          <p className="text-sm text-gold-dim mt-2">
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in</Link>
            {' '}to save your gear and inventory screenshots.
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-parchment-dim" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search activities, bosses, minigames..."
          className="w-full pl-10 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-parchment placeholder-parchment-dim/50 focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Search results */}
      {filtered !== null ? (
        <div>
          <p className="text-sm text-parchment-dim mb-4">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-parchment-dim">
              <p>No activities found. Try a different search term.</p>
              {user && (
                <Link to="/add-activity" className="text-gold hover:text-gold-light text-sm mt-2 inline-block">
                  Or add a new activity
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-2">
              {filtered.map(activity => (
                <ActivityRow key={activity.slug} activity={activity} hasSetup={userSetups.has(activity.slug)} user={user} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Category browser */
        <div className="space-y-3">
          {parentCategories.map(parent => {
            const Icon = categoryIcons[parent.label] || Sword
            const isExpanded = expandedParents.has(parent.label)
            const totalCount = parent.subcategories.reduce((sum, sub) => sum + sub.items.length, 0)

            return (
              <div key={parent.label} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleParent(parent.label)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-none text-left cursor-pointer hover:bg-dark-hover transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gold flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-parchment-dim flex-shrink-0" />
                  )}
                  <Icon className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="font-semibold text-parchment flex-1">{parent.label}</span>
                  <span className="text-xs text-parchment-dim bg-dark-surface px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t border-dark-border">
                    {parent.subcategories.map(sub => {
                      const subExpanded = expandedSubs.has(sub.label)
                      return (
                        <div key={sub.label}>
                          {parent.subcategories.length > 1 && (
                            <button
                              onClick={() => toggleSub(sub.label)}
                              className="w-full flex items-center gap-2 px-6 py-2.5 bg-transparent border-none text-left cursor-pointer hover:bg-dark-hover transition-colors border-b border-dark-border"
                            >
                              {subExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-gold-dim" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-parchment-dim" />
                              )}
                              <span className="text-sm text-parchment-dim font-medium">{sub.label}</span>
                              <span className="text-xs text-parchment-dim/60 ml-auto">{sub.items.length}</span>
                            </button>
                          )}

                          {(subExpanded || parent.subcategories.length === 1) && (
                            <div className="divide-y divide-dark-border/50">
                              {sub.items.map(activity => (
                                <ActivityRow
                                  key={activity.slug}
                                  activity={activity}
                                  hasSetup={userSetups.has(activity.slug)}
                                  user={user}
                                  indent
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
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

function ActivityRow({ activity, hasSetup, user, indent }) {
  return (
    <Link
      to={`/activity/${activity.slug}`}
      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-dark-hover transition-colors no-underline group ${
        indent ? 'pl-10' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-parchment group-hover:text-gold transition-colors truncate">
            {activity.name}
          </span>
          {activity.also_known_as && (
            <span className="text-xs text-parchment-dim/60">({activity.also_known_as})</span>
          )}
          {activity.combat_level > 0 && (
            <span className="text-xs text-danger/80">Lvl {activity.combat_level}</span>
          )}
          {activity.classification === 'Dangerous' && (
            <span className="text-xs text-danger/60 bg-danger/10 px-1.5 py-0.5 rounded">Dangerous</span>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-parchment-dim/60 truncate mt-0.5">{activity.description}</p>
        )}
      </div>
      {user && hasSetup && (
        <ImageIcon className="w-4 h-4 text-success flex-shrink-0" title="Has saved setup" />
      )}
    </Link>
  )
}
