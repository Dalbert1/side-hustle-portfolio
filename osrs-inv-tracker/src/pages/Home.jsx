import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ChevronRight, ImageIcon } from 'lucide-react'
import { activities, getParentCategories } from '../data/activities'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Header - left aligned, not centered */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold mb-1">Activity Helper</h1>
        <p className="text-text-secondary text-sm">
          Gear and inventory setups for every boss, raid, and minigame.
          {!user && (
            <>
              {' '}<Link to="/login" className="text-gold hover:text-gold-hover transition-colors duration-150">Sign in</Link> to save screenshots.
            </>
          )}
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search activities..."
          aria-label="Search activities"
          className="w-full pl-9 pr-3 py-2 bg-surface-raised border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-gold transition-colors duration-150"
        />
      </div>

      {/* Search results */}
      {filtered !== null ? (
        <section aria-label="Search results">
          <p className="text-xs text-text-muted mb-3">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
          {filtered.length === 0 ? (
            <div className="py-8 text-text-muted text-sm">
              <p>No activities found.</p>
              {user && (
                <Link to="/add-activity" className="text-gold hover:text-gold-hover text-sm mt-1 inline-block transition-colors duration-150">
                  Add a new activity
                </Link>
              )}
            </div>
          ) : (
            <div className="border border-border-subtle rounded-md overflow-hidden divide-y divide-border-subtle">
              {filtered.map(activity => (
                <ActivityRow key={activity.slug} activity={activity} hasSetup={userSetups.has(activity.slug)} user={user} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Category browser */
        <nav className="space-y-2" aria-label="Activity categories">
          {parentCategories.map(parent => {
            const isExpanded = expandedParents.has(parent.label)
            const totalCount = parent.subcategories.reduce((sum, sub) => sum + sub.items.length, 0)

            return (
              <div key={parent.label} className="border border-border-subtle rounded-md overflow-hidden">
                <button
                  onClick={() => toggleParent(parent.label)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-transparent border-none text-left cursor-pointer hover:bg-surface-hover transition-colors duration-150"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gold flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-sm font-semibold text-text-primary flex-1">{parent.label}</span>
                  <span className="text-[11px] text-text-muted tabular-nums">{totalCount}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-border-subtle">
                    {parent.subcategories.map(sub => {
                      const subExpanded = expandedSubs.has(sub.label)
                      const showSubHeader = parent.subcategories.length > 1

                      return (
                        <div key={sub.label}>
                          {showSubHeader && (
                            <button
                              onClick={() => toggleSub(sub.label)}
                              aria-expanded={subExpanded}
                              className="w-full flex items-center gap-1.5 px-3 pl-7 py-2 bg-transparent border-none text-left cursor-pointer hover:bg-surface-hover transition-colors duration-150 border-b border-border-subtle"
                            >
                              {subExpanded ? (
                                <ChevronDown className="w-3 h-3 text-gold-dim" aria-hidden="true" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-text-muted" aria-hidden="true" />
                              )}
                              <span className="text-[13px] text-text-secondary font-medium">{sub.label}</span>
                              <span className="text-[11px] text-text-muted ml-auto tabular-nums">{sub.items.length}</span>
                            </button>
                          )}

                          {(subExpanded || !showSubHeader) && (
                            <div className="divide-y divide-border-subtle/50">
                              {sub.items.map(activity => (
                                <ActivityRow
                                  key={activity.slug}
                                  activity={activity}
                                  hasSetup={userSetups.has(activity.slug)}
                                  user={user}
                                  indent={showSubHeader}
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
        </nav>
      )}
    </div>
  )
}

function ActivityRow({ activity, hasSetup, user, indent }) {
  return (
    <Link
      to={`/activity/${activity.slug}`}
      className={`flex items-center gap-2 px-3 py-2 hover:bg-surface-hover transition-colors duration-150 no-underline group ${
        indent ? 'pl-9' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] text-text-primary group-hover:text-gold transition-colors duration-150">
            {activity.name}
          </span>
          {activity.also_known_as && (
            <span className="text-[11px] text-text-muted">({activity.also_known_as})</span>
          )}
          {activity.combat_level > 0 && (
            <span className="text-[10px] text-danger tabular-nums">Lvl {activity.combat_level}</span>
          )}
          {activity.classification === 'Dangerous' && (
            <span className="text-[10px] text-danger-muted">Dangerous</span>
          )}
        </div>
      </div>
      {user && hasSetup && (
        <ImageIcon className="w-3.5 h-3.5 text-success flex-shrink-0" aria-label="Has saved setup" />
      )}
    </Link>
  )
}
