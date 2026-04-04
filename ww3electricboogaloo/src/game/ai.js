// Basic AI opponent — priority-based decision making
// This is a simple rule-based AI for single-player mode
// Priorities: defend capitals → attack weak neighbors → build units

import { TERRITORIES, ADJACENCY } from '../constants/territories';
import { FACTIONS, ALLIANCES } from '../constants/factions';
import { UNIT_TYPES, getAvailableUnits } from '../constants/units';
import { getUnitsInTerritory, areAllied, getAllianceForFaction } from './gameReducer';

// Determine which alliance the AI controls
// In single-player, player is Coalition, AI is Alliance (or vice versa)
export const AI_ALLIANCE = ALLIANCES.ALLIANCE;

export const isAIFaction = (factionId) => {
  return FACTIONS[factionId]?.alliance === AI_ALLIANCE;
};

// AI: Purchase phase
// Strategy: buy a mix of infantry (bulk) and offensive units
export const aiPurchase = (state) => {
  const faction = state.currentFaction;
  const economy = state.factionEconomies[faction];
  let remaining = economy.ipcs;
  const purchases = [];
  const alliance = FACTIONS[faction].alliance;
  const fighterType = FACTIONS[faction].fighterType;

  // Simple spending ratio: 60% infantry, 20% tanks, 20% air/drones
  // Buy fighters/drones first (more expensive), then tanks, then fill with infantry
  const availableUnits = getAvailableUnits(alliance);

  // Buy 1 fighter if we can afford it
  if (remaining >= UNIT_TYPES[fighterType].cost) {
    purchases.push({ unitType: fighterType, cost: UNIT_TYPES[fighterType].cost });
    remaining -= UNIT_TYPES[fighterType].cost;
  }

  // Buy 1 drone if we can
  if (remaining >= UNIT_TYPES.DRONE.cost) {
    purchases.push({ unitType: 'DRONE', cost: UNIT_TYPES.DRONE.cost });
    remaining -= UNIT_TYPES.DRONE.cost;
  }

  // Buy 1 tank if we can
  if (remaining >= UNIT_TYPES.TANK.cost) {
    purchases.push({ unitType: 'TANK', cost: UNIT_TYPES.TANK.cost });
    remaining -= UNIT_TYPES.TANK.cost;
  }

  // Fill remaining with infantry
  while (remaining >= UNIT_TYPES.INFANTRY.cost) {
    purchases.push({ unitType: 'INFANTRY', cost: UNIT_TYPES.INFANTRY.cost });
    remaining -= UNIT_TYPES.INFANTRY.cost;
  }

  return purchases;
};

// AI: Combat move phase
// Strategy: attack territories where we have numerical advantage
export const aiCombatMoves = (state) => {
  const faction = state.currentFaction;
  const moves = [];

  // Get all territories with our units
  const ourTerritories = {};
  Object.values(state.units).forEach((unit) => {
    if (unit.faction === faction && !unit.hasMoved) {
      if (!ourTerritories[unit.territory]) {
        ourTerritories[unit.territory] = [];
      }
      ourTerritories[unit.territory].push(unit);
    }
  });

  // For each territory, check adjacent enemy territories
  Object.entries(ourTerritories).forEach(([territoryId, units]) => {
    const adjacent = ADJACENCY[territoryId] || [];

    adjacent.forEach((adjId) => {
      const adjTerritory = TERRITORIES[adjId];
      if (!adjTerritory || adjTerritory.type === 'sea') return; // Skip sea for now
      if (adjTerritory.isOffMap) return; // Don't attack off-map

      const owner = state.territoryOwnership[adjId];
      if (owner && areAllied(owner, faction)) return; // Don't attack allies

      // Count enemy units
      const enemyUnits = getUnitsInTerritory(state, adjId).filter(
        (u) => !areAllied(u.faction, faction)
      );

      // Count our available land units
      const availableLandUnits = units.filter(
        (u) => UNIT_TYPES[u.type].category === 'land' && !u.hasMoved
      );

      // Simple heuristic: attack if we outnumber 2:1 or territory is empty
      if (
        enemyUnits.length === 0 ||
        (availableLandUnits.length >= enemyUnits.length * 2 && availableLandUnits.length >= 3)
      ) {
        // Send half our forces (keep some for defense)
        const unitsToSend = availableLandUnits.slice(
          0,
          Math.max(1, Math.ceil(availableLandUnits.length / 2))
        );

        if (unitsToSend.length > 0) {
          moves.push({
            unitIds: unitsToSend.map((u) => u.id),
            destination: adjId,
            from: territoryId,
          });
        }
      }
    });
  });

  return moves;
};

// AI: Non-combat move phase
// Strategy: reinforce threatened territories, move units toward front lines
export const aiNonCombatMoves = (state) => {
  // For MVP, AI doesn't do non-combat moves
  // This keeps things simpler and the AI still functions
  return [];
};

// AI: Place units
// Strategy: place near the front line or at capital
export const aiPlaceUnits = (state) => {
  const faction = state.currentFaction;

  // Get factories owned by this faction
  const factories = Object.entries(state.territoryOwnership)
    .filter(([tid, owner]) => owner === faction && TERRITORIES[tid]?.hasFactory)
    .map(([tid]) => tid);

  if (factories.length === 0) return null;

  // For now, place all at the first factory (usually capital)
  // TODO: smarter placement based on front lines
  return factories[0];
};

// Execute a full AI turn
export const executeAITurn = (state, dispatch) => {
  // This returns a sequence of actions the AI wants to take
  // The game loop calls this and dispatches actions with delays for UX
  return {
    purchases: aiPurchase(state),
    combatMoves: aiCombatMoves(state),
    nonCombatMoves: aiNonCombatMoves(state),
    placementTerritory: aiPlaceUnits(state),
  };
};
