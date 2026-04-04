// Faction definitions and starting forces — GDD v1.0

export const ALLIANCES = {
  COALITION: 'coalition',
  ALLIANCE: 'alliance',
};

export const FACTIONS = {
  USA: {
    id: 'USA',
    name: 'United States',
    alliance: ALLIANCES.COALITION,
    color: '#1a5276',
    lightColor: '#3498db',
    baseIncome: 15,
    turnOrder: 1,
    fighterType: 'FIGHTER_F35',
  },
  ISRAEL: {
    id: 'ISRAEL',
    name: 'Israel',
    alliance: ALLIANCES.COALITION,
    color: '#1e8449',
    lightColor: '#2ecc71',
    baseIncome: 0, // income from territories only
    turnOrder: 2,
    fighterType: 'FIGHTER_F35',
  },
  GULF: {
    id: 'GULF',
    name: 'Gulf States',
    alliance: ALLIANCES.COALITION,
    color: '#b7950b',
    lightColor: '#f1c40f',
    baseIncome: 0,
    turnOrder: 3,
    fighterType: 'FIGHTER_F35',
  },
  IRAN: {
    id: 'IRAN',
    name: 'Iran',
    alliance: ALLIANCES.ALLIANCE,
    color: '#922b21',
    lightColor: '#e74c3c',
    baseIncome: 0,
    turnOrder: 4,
    fighterType: 'FIGHTER_SU57',
  },
  RUSSIA: {
    id: 'RUSSIA',
    name: 'Russia',
    alliance: ALLIANCES.ALLIANCE,
    color: '#6c3483',
    lightColor: '#9b59b6',
    baseIncome: 0,
    turnOrder: 5,
    fighterType: 'FIGHTER_SU57',
  },
  CHINA: {
    id: 'CHINA',
    name: 'China',
    alliance: ALLIANCES.ALLIANCE,
    color: '#d35400',
    lightColor: '#e67e22',
    baseIncome: 0,
    turnOrder: 6,
    fighterType: 'FIGHTER_SU57',
  },
};

export const TURN_ORDER = ['USA', 'ISRAEL', 'GULF', 'IRAN', 'RUSSIA', 'CHINA'];

export const PHASES = {
  PURCHASE: 'purchase',
  COMBAT_MOVE: 'combatMove',
  COMBAT: 'combat',
  NON_COMBAT_MOVE: 'nonCombatMove',
  PLACE_UNITS: 'placeUnits',
  COLLECT_INCOME: 'collectIncome',
};

export const PHASE_ORDER = [
  PHASES.PURCHASE,
  PHASES.COMBAT_MOVE,
  PHASES.COMBAT,
  PHASES.NON_COMBAT_MOVE,
  PHASES.PLACE_UNITS,
  PHASES.COLLECT_INCOME,
];

export const PHASE_LABELS = {
  [PHASES.PURCHASE]: 'Purchase Units',
  [PHASES.COMBAT_MOVE]: 'Combat Move',
  [PHASES.COMBAT]: 'Combat',
  [PHASES.NON_COMBAT_MOVE]: 'Non-Combat Move',
  [PHASES.PLACE_UNITS]: 'Place Units',
  [PHASES.COLLECT_INCOME]: 'Collect Income',
};

// Starting forces per territory per faction
// Format: { territoryId: { unitType: count, ... } }
export const STARTING_FORCES = {
  USA: {
    kuwait: { INFANTRY: 3, TANK: 1, FIGHTER_F35: 1 },
    qatar: { INFANTRY: 2, BOMBER: 1 },
    persian_gulf_west: { CARRIER: 1, DESTROYER: 1, TRANSPORT: 1 },
    usa_staging: { INFANTRY: 5, TANK: 2, FIGHTER_F35: 2, BOMBER: 1, DESTROYER: 2, CARRIER: 1, TRANSPORT: 2 },
  },
  ISRAEL: {
    israel: { INFANTRY: 5, TANK: 2, FIGHTER_F35: 2, BOMBER: 1, THAAD: 1 },
    east_med: { DESTROYER: 1, SUBMARINE: 1 },
  },
  GULF: {
    saudi_south: { INFANTRY: 3, TANK: 1 },
    uae: { INFANTRY: 2, FIGHTER_F35: 1, DRONE: 1 },
    saudi_north: { INFANTRY: 2 },
    persian_gulf_east: { DESTROYER: 1 },
  },
  IRAN: {
    tehran: { INFANTRY: 4, TANK: 2, FIGHTER_SU57: 1, THAAD: 1 },
    western_iran: { INFANTRY: 4, TANK: 2 },
    southern_iran: { INFANTRY: 3, DRONE: 1 },
    northern_iran: { INFANTRY: 3, DRONE: 1 },
    eastern_iran: { INFANTRY: 2, DRONE: 2 },
    persian_gulf_east: { SUBMARINE: 1, DESTROYER: 1 },
    lebanon: { INFANTRY: 2, DRONE: 1 },
    syria: { INFANTRY: 3, DRONE: 1 },
  },
  RUSSIA: {
    syria: { INFANTRY: 2, TANK: 1, FIGHTER_SU57: 2, BOMBER: 1 },
    russia_staging: { INFANTRY: 5, TANK: 3, FIGHTER_SU57: 2, BOMBER: 1 },
    east_med: { CRUISER: 1, SUBMARINE: 1 },
  },
  CHINA: {
    pakistan: { INFANTRY: 2, TANK: 1 },
    china_staging: { INFANTRY: 6, TANK: 3, FIGHTER_SU57: 2, BOMBER: 1, DRONE: 1 },
    indian_ocean: { CARRIER: 1, DESTROYER: 2, SUBMARINE: 1, TRANSPORT: 2 },
  },
};

// Helper: get all factions for an alliance
export const getFactionsForAlliance = (alliance) => {
  return Object.values(FACTIONS).filter((f) => f.alliance === alliance);
};
