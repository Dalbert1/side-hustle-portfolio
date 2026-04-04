// Game state reducer — core game logic
// Manages turn phases, unit movement, combat, economy

import { TERRITORIES } from '../constants/territories';
import { FACTIONS, TURN_ORDER, PHASES, PHASE_ORDER, STARTING_FORCES } from '../constants/factions';
import { UNIT_TYPES } from '../constants/units';
import { resolveCombatRound } from './combat';

// Generate a unique unit ID
let unitIdCounter = 0;
const generateUnitId = () => `unit_${++unitIdCounter}`;

// Create initial game state from GDD starting forces
export const createInitialState = () => {
  unitIdCounter = 0;

  // Initialize territory ownership
  const territoryOwnership = {};
  Object.values(TERRITORIES).forEach((territory) => {
    if (territory.startingFaction && territory.startingFaction !== 'NEUTRAL') {
      territoryOwnership[territory.id] = territory.startingFaction;
    } else {
      territoryOwnership[territory.id] = null;
    }
  });

  // Initialize units from starting forces
  const units = {};
  Object.entries(STARTING_FORCES).forEach(([factionId, territories]) => {
    Object.entries(territories).forEach(([territoryId, unitCounts]) => {
      Object.entries(unitCounts).forEach(([unitType, count]) => {
        for (let i = 0; i < count; i++) {
          const id = generateUnitId();
          units[id] = {
            id,
            type: unitType,
            faction: factionId,
            territory: territoryId,
            hasMoved: false,
            hasAttacked: false,
          };
        }
      });
    });
  });

  // Initialize faction economies
  const factionEconomies = {};
  Object.values(FACTIONS).forEach((faction) => {
    const income = calculateIncome(faction.id, territoryOwnership);
    factionEconomies[faction.id] = {
      ipcs: income, // Start with one round of income
      income,
    };
  });

  // Factory damage tracking
  const factoryDamage = {};
  Object.values(TERRITORIES).forEach((t) => {
    if (t.hasFactory) {
      factoryDamage[t.id] = 0;
    }
  });

  // Nuclear build tracking: { unitId: roundsRemaining }
  const nuclearBuildQueue = {};

  // Nuked territories
  const nukedTerritories = {};

  return {
    units,
    territoryOwnership,
    factionEconomies,
    factoryDamage,
    nuclearBuildQueue,
    nukedTerritories,

    // Turn state
    currentRound: 1,
    currentFactionIndex: 0,
    currentPhase: PHASES.PURCHASE,
    currentFaction: TURN_ORDER[0],

    // Phase-specific state
    purchases: [], // items bought this turn
    pendingCombats: [], // territories with combat to resolve
    combatLog: [], // log of recent combat results

    // Rewind support
    phaseSnapshots: {},

    // Selection state (UI)
    selectedTerritory: null,
    selectedUnits: [],
    moveOrigin: null,

    // Game status
    gameOver: false,
    winner: null,
    gameLog: ['Game started. Round 1 — USA turn.'],
  };
};

// Calculate income for a faction
const calculateIncome = (factionId, territoryOwnership) => {
  const faction = FACTIONS[factionId];
  let income = faction.baseIncome || 0;

  Object.entries(territoryOwnership).forEach(([territoryId, owner]) => {
    if (owner === factionId) {
      const territory = TERRITORIES[territoryId];
      if (territory && territory.ipcValue) {
        income += territory.ipcValue;
      }
    }
  });

  return income;
};

// Get units in a specific territory
export const getUnitsInTerritory = (state, territoryId) => {
  return Object.values(state.units).filter((u) => u.territory === territoryId);
};

// Get units for a specific faction
export const getUnitsForFaction = (state, factionId) => {
  return Object.values(state.units).filter((u) => u.faction === factionId);
};

// Get the alliance for a faction
export const getAllianceForFaction = (factionId) => {
  return FACTIONS[factionId]?.alliance;
};

// Check if two factions are allied
export const areAllied = (factionA, factionB) => {
  return getAllianceForFaction(factionA) === getAllianceForFaction(factionB);
};

// Action types
export const ACTIONS = {
  SELECT_TERRITORY: 'SELECT_TERRITORY',
  PURCHASE_UNIT: 'PURCHASE_UNIT',
  CANCEL_PURCHASE: 'CANCEL_PURCHASE',
  MOVE_UNITS: 'MOVE_UNITS',
  ADVANCE_PHASE: 'ADVANCE_PHASE',
  REWIND_PHASE: 'REWIND_PHASE',
  RESOLVE_COMBAT: 'RESOLVE_COMBAT',
  ASSIGN_CASUALTIES: 'ASSIGN_CASUALTIES',
  RETREAT: 'RETREAT',
  PLACE_UNIT: 'PLACE_UNIT',
  END_GAME: 'END_GAME',
  ADD_LOG: 'ADD_LOG',
};

// Main game reducer
export const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_TERRITORY: {
      return {
        ...state,
        selectedTerritory: action.territoryId,
      };
    }

    case ACTIONS.PURCHASE_UNIT: {
      const { unitType } = action;
      const unitDef = UNIT_TYPES[unitType];
      const economy = state.factionEconomies[state.currentFaction];

      // Calculate remaining IPCs after existing purchases
      const spent = state.purchases.reduce((sum, p) => sum + UNIT_TYPES[p.unitType].cost, 0);
      const remaining = economy.ipcs - spent;

      if (remaining < unitDef.cost) return state; // Can't afford

      return {
        ...state,
        purchases: [...state.purchases, { unitType, cost: unitDef.cost }],
        gameLog: [
          ...state.gameLog,
          `${FACTIONS[state.currentFaction].name} purchased ${unitDef.name} (${unitDef.cost} IPCs)`,
        ],
      };
    }

    case ACTIONS.CANCEL_PURCHASE: {
      const { index } = action;
      const newPurchases = [...state.purchases];
      newPurchases.splice(index, 1);
      return { ...state, purchases: newPurchases };
    }

    case ACTIONS.MOVE_UNITS: {
      const { unitIds, destination } = action;
      const newUnits = { ...state.units };

      unitIds.forEach((id) => {
        newUnits[id] = {
          ...newUnits[id],
          territory: destination,
          hasMoved: true,
        };
      });

      // Check if this creates a combat situation
      const destinationUnits = Object.values(newUnits).filter(
        (u) => u.territory === destination
      );
      const hasEnemies = destinationUnits.some(
        (u) => !areAllied(u.faction, state.currentFaction)
      );

      let newPendingCombats = [...state.pendingCombats];
      if (hasEnemies && !newPendingCombats.includes(destination)) {
        newPendingCombats.push(destination);
      }

      return {
        ...state,
        units: newUnits,
        pendingCombats: newPendingCombats,
        selectedTerritory: null,
        selectedUnits: [],
      };
    }

    case ACTIONS.ADVANCE_PHASE: {
      const currentPhaseIndex = PHASE_ORDER.indexOf(state.currentPhase);

      // Save snapshot for rewind
      const newSnapshots = { ...state.phaseSnapshots };
      newSnapshots[state.currentPhase] = {
        units: JSON.parse(JSON.stringify(state.units)),
        purchases: [...state.purchases],
        factionEconomies: JSON.parse(JSON.stringify(state.factionEconomies)),
        territoryOwnership: { ...state.territoryOwnership },
        pendingCombats: [...state.pendingCombats],
      };

      // If last phase, advance to next faction
      if (currentPhaseIndex >= PHASE_ORDER.length - 1) {
        const nextFactionIndex = (state.currentFactionIndex + 1) % TURN_ORDER.length;
        const newRound = nextFactionIndex === 0 ? state.currentRound + 1 : state.currentRound;
        const nextFaction = TURN_ORDER[nextFactionIndex];

        // Collect income for current faction before advancing
        const income = calculateIncome(state.currentFaction, state.territoryOwnership);
        const newEconomies = { ...state.factionEconomies };
        newEconomies[state.currentFaction] = {
          ...newEconomies[state.currentFaction],
          ipcs: newEconomies[state.currentFaction].ipcs + income,
          income,
        };

        // Reset unit movement flags for next faction
        const newUnits = { ...state.units };
        Object.keys(newUnits).forEach((id) => {
          if (newUnits[id].faction === nextFaction || areAllied(newUnits[id].faction, nextFaction)) {
            newUnits[id] = { ...newUnits[id], hasMoved: false, hasAttacked: false };
          }
        });

        // Advance nuclear build queue
        const newNuclearQueue = { ...state.nuclearBuildQueue };
        Object.entries(newNuclearQueue).forEach(([unitId, roundsLeft]) => {
          if (state.units[unitId]?.faction === state.currentFaction) {
            newNuclearQueue[unitId] = roundsLeft - 1;
          }
        });

        // Check win conditions before moving to next turn
        const postState = {
          ...state,
          units: newUnits,
          territoryOwnership: state.territoryOwnership,
          nukedTerritories: state.nukedTerritories,
        };
        const winCheck = checkWinConditions(postState);
        if (winCheck.gameOver) {
          return {
            ...state,
            units: newUnits,
            factionEconomies: newEconomies,
            gameOver: true,
            winner: winCheck.winner,
            gameLog: [
              ...state.gameLog,
              `GAME OVER! ${winCheck.winner} wins!`,
            ],
          };
        }

        return {
          ...state,
          units: newUnits,
          factionEconomies: newEconomies,
          nuclearBuildQueue: newNuclearQueue,
          currentRound: newRound,
          currentFactionIndex: nextFactionIndex,
          currentFaction: nextFaction,
          currentPhase: PHASES.PURCHASE,
          purchases: [],
          pendingCombats: [],
          phaseSnapshots: {},
          selectedTerritory: null,
          selectedUnits: [],
          gameLog: [
            ...state.gameLog,
            `--- Round ${newRound} — ${FACTIONS[nextFaction].name} turn ---`,
          ],
        };
      }

      // Resolve combat when advancing from COMBAT phase
      let newUnits = { ...state.units };
      let newOwnership = { ...state.territoryOwnership };
      let combatLogs = [];

      if (state.currentPhase === PHASES.COMBAT && state.pendingCombats.length > 0) {
        state.pendingCombats.forEach((territoryId) => {
          const allUnits = Object.values(newUnits).filter(
            (u) => u.territory === territoryId
          );
          let attackers = allUnits.filter(
            (u) => areAllied(u.faction, state.currentFaction) && u.hasMoved
          );
          let defenders = allUnits.filter(
            (u) => !areAllied(u.faction, state.currentFaction)
          );

          if (attackers.length === 0 || defenders.length === 0) return;

          const territoryName = TERRITORIES[territoryId]?.name || territoryId;
          combatLogs.push(`Combat at ${territoryName}:`);

          // Resolve up to 10 rounds of combat
          let round = 0;
          while (attackers.length > 0 && defenders.length > 0 && round < 10) {
            round++;
            const result = resolveCombatRound(attackers, defenders, territoryId);

            // Remove casualties - defenders lose cheapest units first
            let defCasualties = result.attackerHits;
            const sortedDefenders = [...defenders].sort(
              (a, b) => (UNIT_TYPES[a.type]?.cost || 0) - (UNIT_TYPES[b.type]?.cost || 0)
            );
            for (let i = 0; i < defCasualties && i < sortedDefenders.length; i++) {
              delete newUnits[sortedDefenders[i].id];
            }

            let attCasualties = result.defenderHits;
            const sortedAttackers = [...attackers].sort(
              (a, b) => (UNIT_TYPES[a.type]?.cost || 0) - (UNIT_TYPES[b.type]?.cost || 0)
            );
            for (let i = 0; i < attCasualties && i < sortedAttackers.length; i++) {
              delete newUnits[sortedAttackers[i].id];
            }

            // Recalculate surviving units
            const surviving = Object.values(newUnits).filter(
              (u) => u.territory === territoryId
            );
            attackers = surviving.filter(
              (u) => areAllied(u.faction, state.currentFaction) && u.hasMoved
            );
            defenders = surviving.filter(
              (u) => !areAllied(u.faction, state.currentFaction)
            );

            combatLogs.push(
              `  Rd ${round}: Att scored ${result.attackerHits} hits, Def scored ${result.defenderHits} hits`
            );
          }

          // Determine outcome
          if (defenders.length === 0 && attackers.length > 0) {
            newOwnership[territoryId] = state.currentFaction;
            combatLogs.push(
              `  ${FACTIONS[state.currentFaction].name} captured ${territoryName}!`
            );
          } else if (attackers.length === 0) {
            combatLogs.push(`  Attack on ${territoryName} repelled!`);
          } else {
            combatLogs.push(`  Stalemate at ${territoryName} after 10 rounds`);
            // Attackers retreat - move back (simplified: just mark them unmoved)
            attackers.forEach((u) => {
              if (newUnits[u.id]) {
                newUnits[u.id] = { ...newUnits[u.id], hasMoved: false };
              }
            });
          }
        });

        // Check win conditions after combat
        const postCombatState = {
          ...state,
          units: newUnits,
          territoryOwnership: newOwnership,
          nukedTerritories: state.nukedTerritories,
        };
        const winCheck = checkWinConditions(postCombatState);
        if (winCheck.gameOver) {
          return {
            ...state,
            units: newUnits,
            territoryOwnership: newOwnership,
            pendingCombats: [],
            gameOver: true,
            winner: winCheck.winner,
            gameLog: [
              ...state.gameLog,
              ...combatLogs,
              `GAME OVER! ${winCheck.winner} wins!`,
            ],
          };
        }
      }

      // Handle place units phase - place purchased units
      let newEconomies = { ...state.factionEconomies };

      if (state.currentPhase === PHASES.PLACE_UNITS && state.purchases.length > 0) {
        const faction = state.currentFaction;
        const factories = Object.entries(newOwnership)
          .filter(([tid, owner]) => owner === faction && TERRITORIES[tid]?.hasFactory)
          .map(([tid]) => tid);

        const primaryFactory = factories[0] || null;
        if (primaryFactory) {
          state.purchases.forEach((purchase) => {
            const id = generateUnitId();
            newUnits[id] = {
              id,
              type: purchase.unitType,
              faction,
              territory: primaryFactory,
              hasMoved: false,
              hasAttacked: false,
            };
          });

          const totalCost = state.purchases.reduce((sum, p) => p.cost + sum, 0);
          newEconomies[faction] = {
            ...newEconomies[faction],
            ipcs: newEconomies[faction].ipcs - totalCost,
          };
        }
      }

      const nextPhase = PHASE_ORDER[currentPhaseIndex + 1];

      return {
        ...state,
        units: newUnits,
        territoryOwnership: newOwnership,
        factionEconomies: newEconomies,
        pendingCombats: state.currentPhase === PHASES.COMBAT ? [] : state.pendingCombats,
        currentPhase: nextPhase,
        phaseSnapshots: newSnapshots,
        selectedTerritory: null,
        selectedUnits: [],
        gameLog: [
          ...state.gameLog,
          ...combatLogs,
          `${FACTIONS[state.currentFaction].name}: ${nextPhase} phase`,
        ],
      };
    }

    case ACTIONS.REWIND_PHASE: {
      const currentPhaseIndex = PHASE_ORDER.indexOf(state.currentPhase);
      if (currentPhaseIndex <= 0) return state; // Can't rewind past purchase

      const prevPhase = PHASE_ORDER[currentPhaseIndex - 1];
      const snapshot = state.phaseSnapshots[prevPhase];
      if (!snapshot) return state;

      return {
        ...state,
        currentPhase: prevPhase,
        units: snapshot.units,
        purchases: snapshot.purchases,
        factionEconomies: snapshot.factionEconomies,
        territoryOwnership: snapshot.territoryOwnership,
        pendingCombats: snapshot.pendingCombats,
        selectedTerritory: null,
        selectedUnits: [],
        gameLog: [
          ...state.gameLog,
          `${FACTIONS[state.currentFaction].name} rewound to ${prevPhase} phase`,
        ],
      };
    }

    case ACTIONS.PLACE_UNIT: {
      const { purchaseIndex, territoryId } = action;
      // For manual placement — used when player chooses which factory
      // Implementation extends the auto-place logic above
      return state; // TODO: implement manual placement
    }

    case ACTIONS.END_GAME: {
      return {
        ...state,
        gameOver: true,
        winner: action.winner,
        gameLog: [
          ...state.gameLog,
          `GAME OVER! ${action.winner} wins!`,
        ],
      };
    }

    case ACTIONS.ADD_LOG: {
      return {
        ...state,
        gameLog: [...state.gameLog, action.message],
      };
    }

    default:
      return state;
  }
};

// Check win conditions
export const checkWinConditions = (state) => {
  const tehranOwner = state.territoryOwnership.tehran;
  const israelOwner = state.territoryOwnership.israel;

  // Check if Tehran is captured by Coalition
  if (tehranOwner && getAllianceForFaction(tehranOwner) === 'coalition') {
    return { gameOver: true, winner: 'Coalition' };
  }

  // Check if Israel is captured by Alliance
  if (israelOwner && getAllianceForFaction(israelOwner) === 'alliance') {
    return { gameOver: true, winner: 'Alliance' };
  }

  // Check nuked capitals
  if (state.nukedTerritories.tehran) {
    return { gameOver: true, winner: 'Coalition' };
  }
  if (state.nukedTerritories.israel) {
    return { gameOver: true, winner: 'Alliance' };
  }

  return { gameOver: false, winner: null };
};
