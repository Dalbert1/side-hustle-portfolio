// Territory definitions — map data from GDD v1.0

export const TERRAIN_TYPES = {
  DESERT: 'desert',
  MOUNTAIN: 'mountain',
  URBAN: 'urban',
  ISLAND: 'island',
  MIXED: 'mixed',
  SEA: 'sea',
  OFFMAP: 'offmap',
};

// Defense bonus from terrain
export const TERRAIN_DEFENSE_BONUS = {
  [TERRAIN_TYPES.MOUNTAIN]: 1,
  [TERRAIN_TYPES.URBAN]: 1,
  [TERRAIN_TYPES.DESERT]: 0,
  [TERRAIN_TYPES.ISLAND]: 0,
  [TERRAIN_TYPES.MIXED]: 0,
  [TERRAIN_TYPES.SEA]: 0,
  [TERRAIN_TYPES.OFFMAP]: 0,
};

export const TERRITORIES = {
  // ===== COALITION TERRITORIES =====
  israel: {
    id: 'israel',
    name: 'Israel',
    region: 'levant',
    ipcValue: 6,
    startingFaction: 'ISRAEL',
    hasFactory: true,
    terrain: TERRAIN_TYPES.URBAN,
    isCapital: true,
    type: 'land',
    // SVG path coordinates will go here — placeholder center points for now
    center: { x: 185, y: 280 },
  },
  jordan: {
    id: 'jordan',
    name: 'Jordan',
    region: 'levant',
    ipcValue: 1,
    startingFaction: 'ISRAEL',
    hasFactory: false,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 215, y: 300 },
  },
  saudi_north: {
    id: 'saudi_north',
    name: 'Saudi Arabia (North)',
    region: 'gulf',
    ipcValue: 3,
    startingFaction: 'GULF',
    hasFactory: false,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 260, y: 360 },
  },
  saudi_south: {
    id: 'saudi_south',
    name: 'Saudi Arabia (South)',
    region: 'gulf',
    ipcValue: 4,
    startingFaction: 'GULF',
    hasFactory: true,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 280, y: 430 },
  },
  kuwait: {
    id: 'kuwait',
    name: 'Kuwait',
    region: 'gulf',
    ipcValue: 3,
    startingFaction: 'GULF',
    hasFactory: true,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 320, y: 330 },
  },
  uae: {
    id: 'uae',
    name: 'UAE',
    region: 'gulf',
    ipcValue: 4,
    startingFaction: 'GULF',
    hasFactory: true,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 380, y: 410 },
  },
  qatar: {
    id: 'qatar',
    name: 'Qatar',
    region: 'gulf',
    ipcValue: 3,
    startingFaction: 'GULF',
    hasFactory: true,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 350, y: 390 },
  },
  bahrain: {
    id: 'bahrain',
    name: 'Bahrain',
    region: 'gulf',
    ipcValue: 1,
    startingFaction: 'GULF',
    hasFactory: false,
    terrain: TERRAIN_TYPES.ISLAND,
    type: 'land',
    center: { x: 340, y: 370 },
  },

  // ===== NEUTRAL TERRITORIES =====
  iraq_south: {
    id: 'iraq_south',
    name: 'Iraq (South)',
    region: 'contested',
    ipcValue: 2,
    startingFaction: 'NEUTRAL',
    hasFactory: false,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 280, y: 290 },
  },
  iraq_north: {
    id: 'iraq_north',
    name: 'Iraq (North)',
    region: 'contested',
    ipcValue: 2,
    startingFaction: 'NEUTRAL',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 270, y: 230 },
  },
  turkey: {
    id: 'turkey',
    name: 'Turkey',
    region: 'nato',
    ipcValue: 0,
    startingFaction: 'NEUTRAL',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 200, y: 160 },
  },
  afghanistan: {
    id: 'afghanistan',
    name: 'Afghanistan',
    region: 'central',
    ipcValue: 1,
    startingFaction: 'NEUTRAL',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 500, y: 210 },
  },

  // ===== ALLIANCE TERRITORIES =====
  syria: {
    id: 'syria',
    name: 'Syria',
    region: 'levant',
    ipcValue: 2,
    startingFaction: 'IRAN',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MIXED,
    type: 'land',
    center: { x: 220, y: 220 },
  },
  lebanon: {
    id: 'lebanon',
    name: 'Lebanon',
    region: 'levant',
    ipcValue: 1,
    startingFaction: 'IRAN',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 190, y: 240 },
  },
  tehran: {
    id: 'tehran',
    name: 'Tehran',
    region: 'iran',
    ipcValue: 6,
    startingFaction: 'IRAN',
    hasFactory: true,
    terrain: TERRAIN_TYPES.URBAN,
    isCapital: true,
    type: 'land',
    center: { x: 420, y: 230 },
  },
  western_iran: {
    id: 'western_iran',
    name: 'Western Iran',
    region: 'iran',
    ipcValue: 3,
    startingFaction: 'IRAN',
    hasFactory: true,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 370, y: 270 },
  },
  southern_iran: {
    id: 'southern_iran',
    name: 'Southern Iran',
    region: 'iran',
    ipcValue: 2,
    startingFaction: 'IRAN',
    hasFactory: false,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 410, y: 340 },
  },
  eastern_iran: {
    id: 'eastern_iran',
    name: 'Eastern Iran',
    region: 'iran',
    ipcValue: 2,
    startingFaction: 'IRAN',
    hasFactory: false,
    terrain: TERRAIN_TYPES.DESERT,
    type: 'land',
    center: { x: 480, y: 290 },
  },
  northern_iran: {
    id: 'northern_iran',
    name: 'Northern Iran',
    region: 'iran',
    ipcValue: 2,
    startingFaction: 'IRAN',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MOUNTAIN,
    type: 'land',
    center: { x: 430, y: 180 },
  },
  pakistan: {
    id: 'pakistan',
    name: 'Pakistan',
    region: 'central',
    ipcValue: 2,
    startingFaction: 'CHINA',
    hasFactory: false,
    terrain: TERRAIN_TYPES.MIXED,
    type: 'land',
    center: { x: 540, y: 310 },
  },

  // ===== OFF-MAP STAGING AREAS =====
  russia_staging: {
    id: 'russia_staging',
    name: 'Russia',
    region: 'offmap',
    ipcValue: 8,
    startingFaction: 'RUSSIA',
    hasFactory: true,
    terrain: TERRAIN_TYPES.OFFMAP,
    isOffMap: true,
    type: 'land',
    center: { x: 350, y: 60 },
  },
  china_staging: {
    id: 'china_staging',
    name: 'China',
    region: 'offmap',
    ipcValue: 10,
    startingFaction: 'CHINA',
    hasFactory: true,
    terrain: TERRAIN_TYPES.OFFMAP,
    isOffMap: true,
    type: 'land',
    center: { x: 600, y: 100 },
  },
  usa_staging: {
    id: 'usa_staging',
    name: 'USA (Off-Map)',
    region: 'offmap',
    ipcValue: 15,
    startingFaction: 'USA',
    hasFactory: true,
    terrain: TERRAIN_TYPES.OFFMAP,
    isOffMap: true,
    type: 'land',
    center: { x: 50, y: 60 },
  },

  // ===== SEA ZONES =====
  east_med: {
    id: 'east_med',
    name: 'Eastern Mediterranean',
    type: 'sea',
    center: { x: 160, y: 200 },
  },
  red_sea: {
    id: 'red_sea',
    name: 'Red Sea',
    type: 'sea',
    center: { x: 180, y: 400 },
  },
  persian_gulf_west: {
    id: 'persian_gulf_west',
    name: 'Persian Gulf (West)',
    type: 'sea',
    center: { x: 330, y: 350 },
  },
  persian_gulf_east: {
    id: 'persian_gulf_east',
    name: 'Persian Gulf (East)',
    type: 'sea',
    center: { x: 390, y: 370 },
  },
  arabian_sea: {
    id: 'arabian_sea',
    name: 'Arabian Sea',
    type: 'sea',
    center: { x: 460, y: 430 },
  },
  indian_ocean: {
    id: 'indian_ocean',
    name: 'Indian Ocean',
    type: 'sea',
    center: { x: 560, y: 450 },
  },
};

// Adjacency map — bidirectional connections
// For off-map areas, reinforcement routes are one-way (marked)
export const ADJACENCY = {
  // Land
  israel: ['jordan', 'lebanon', 'syria', 'east_med'],
  jordan: ['israel', 'saudi_north', 'iraq_south'],
  saudi_north: ['jordan', 'kuwait', 'iraq_south', 'saudi_south', 'persian_gulf_west'],
  saudi_south: ['saudi_north', 'uae', 'qatar', 'red_sea'],
  kuwait: ['saudi_north', 'iraq_south', 'persian_gulf_west'],
  uae: ['saudi_south', 'southern_iran', 'persian_gulf_east', 'arabian_sea'],
  qatar: ['saudi_south', 'persian_gulf_west'],
  bahrain: ['persian_gulf_west'],
  iraq_south: ['iraq_north', 'jordan', 'saudi_north', 'kuwait', 'western_iran'],
  iraq_north: ['iraq_south', 'syria', 'turkey', 'northern_iran'],
  syria: ['iraq_north', 'lebanon', 'turkey', 'east_med'],
  lebanon: ['israel', 'syria', 'east_med'],
  tehran: ['western_iran', 'northern_iran', 'eastern_iran'],
  western_iran: ['tehran', 'iraq_south', 'northern_iran', 'southern_iran'],
  southern_iran: ['western_iran', 'eastern_iran', 'uae', 'persian_gulf_east', 'arabian_sea'],
  eastern_iran: ['tehran', 'southern_iran', 'afghanistan', 'pakistan', 'arabian_sea'],
  northern_iran: ['tehran', 'western_iran', 'iraq_north', 'turkey', 'afghanistan'],
  turkey: ['iraq_north', 'syria', 'northern_iran', 'east_med'],
  afghanistan: ['eastern_iran', 'northern_iran', 'pakistan'],
  pakistan: ['eastern_iran', 'afghanistan', 'arabian_sea'],

  // Off-map reinforcement routes (these are special — one-way production routes)
  usa_staging: ['east_med', 'arabian_sea'], // USA ships reinforcements by sea
  russia_staging: ['syria', 'northern_iran'], // Russia sends through Syria or N. Iran
  china_staging: ['pakistan', 'indian_ocean'], // China sends through Pakistan or by sea

  // Sea zones
  east_med: ['israel', 'lebanon', 'syria', 'turkey', 'red_sea'],
  red_sea: ['saudi_south', 'east_med'],
  persian_gulf_west: ['kuwait', 'saudi_north', 'bahrain', 'qatar', 'persian_gulf_east'],
  persian_gulf_east: ['uae', 'southern_iran', 'persian_gulf_west', 'arabian_sea'],
  arabian_sea: ['uae', 'southern_iran', 'eastern_iran', 'pakistan', 'persian_gulf_east', 'indian_ocean'],
  indian_ocean: ['arabian_sea', 'china_staging'],
};

// Helper: check if two territories are adjacent
export const isAdjacent = (territoryA, territoryB) => {
  return ADJACENCY[territoryA]?.includes(territoryB) || false;
};

// Helper: get all adjacent territories
export const getAdjacentTerritories = (territoryId) => {
  return ADJACENCY[territoryId] || [];
};

// Helper: get land territories only
export const getLandTerritories = () => {
  return Object.values(TERRITORIES).filter((t) => t.type === 'land');
};

// Helper: get sea zones only
export const getSeaZones = () => {
  return Object.values(TERRITORIES).filter((t) => t.type === 'sea');
};
