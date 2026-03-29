import rawData from '../../minigames-and-bosses.json'

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function flattenActivities() {
  const activities = []

  // Minigames
  const minigameCategories = {
    combat: 'Combat Minigames',
    skilling: 'Skilling Minigames',
    combat_and_skilling: 'Combat & Skilling Minigames',
    miscellaneous: 'Miscellaneous Minigames',
  }

  for (const [key, label] of Object.entries(minigameCategories)) {
    if (rawData.minigames[key]) {
      for (const item of rawData.minigames[key]) {
        activities.push({
          slug: slugify(item.name),
          name: item.name,
          category: label,
          parentCategory: 'Minigames',
          description: item.description,
          classification: item.classification,
          type: item.type,
          skills: item.skills,
          f2p: item.f2p,
        })
      }
    }
  }

  // Minigame-like activities
  if (rawData.minigame_like_activities) {
    for (const item of rawData.minigame_like_activities.bosses || []) {
      activities.push({
        slug: slugify(item.name),
        name: item.name,
        category: 'Minigame-like Bosses',
        parentCategory: 'Minigame-like Activities',
        description: item.description,
        classification: item.classification,
        skills: item.skills,
      })
    }
    for (const item of rawData.minigame_like_activities.other_activities || []) {
      activities.push({
        slug: slugify(item.name),
        name: item.name,
        category: 'Other Activities',
        parentCategory: 'Minigame-like Activities',
        description: item.description,
        classification: item.classification,
      })
    }
  }

  // Raids
  for (const item of rawData.raids || []) {
    activities.push({
      slug: slugify(item.name),
      name: item.name,
      category: 'Raids',
      parentCategory: 'Raids',
      description: item.description,
      also_known_as: item.also_known_as,
    })
  }

  // Distractions & Diversions
  for (const item of rawData.distractions_and_diversions || []) {
    activities.push({
      slug: slugify(item.name),
      name: item.name,
      category: 'Distractions & Diversions',
      parentCategory: 'Distractions & Diversions',
      description: item.description,
    })
  }

  // Bosses
  const bossCategories = {
    world_bosses: 'World Bosses',
    god_wars_dungeon: 'God Wars Dungeon',
    slayer_bosses: 'Slayer Bosses',
    wilderness_bosses: 'Wilderness Bosses',
    dagannoth_kings: 'Dagannoth Kings',
    desert_treasure_2_bosses: 'Desert Treasure 2 Bosses',
    quest_and_other_bosses: 'Quest & Other Bosses',
    skilling_bosses: 'Skilling Bosses',
    gauntlet_bosses: 'Gauntlet Bosses',
    inferno_and_fight_cave: 'Inferno & Fight Cave',
  }

  for (const [key, label] of Object.entries(bossCategories)) {
    if (rawData.bosses[key]) {
      for (const item of rawData.bosses[key]) {
        activities.push({
          slug: slugify(item.name),
          name: item.name,
          category: label,
          parentCategory: 'Bosses',
          description: item.description || '',
          combat_level: item.combat_level,
          location: item.location,
          slayer_level: item.slayer_level,
          requirements: item.requirements,
        })
      }
    }
  }

  return activities
}

export const activities = flattenActivities()

export function getActivityBySlug(slug) {
  return activities.find(a => a.slug === slug)
}

export function getCategories() {
  const map = new Map()
  for (const a of activities) {
    if (!map.has(a.category)) {
      map.set(a.category, { label: a.category, parentCategory: a.parentCategory, items: [] })
    }
    map.get(a.category).items.push(a)
  }
  return Array.from(map.values())
}

export function getParentCategories() {
  const map = new Map()
  const cats = getCategories()
  for (const cat of cats) {
    if (!map.has(cat.parentCategory)) {
      map.set(cat.parentCategory, [])
    }
    map.get(cat.parentCategory).push(cat)
  }
  return Array.from(map.entries()).map(([label, subcategories]) => ({ label, subcategories }))
}
