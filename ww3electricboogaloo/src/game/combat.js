// Combat resolution — d6 dice system from GDD v1.0

import { UNIT_TYPES } from '../constants/units';
import { TERRITORIES, TERRAIN_DEFENSE_BONUS } from '../constants/territories';

// Roll a single d6
export const rollD6 = () => Math.floor(Math.random() * 6) + 1;

// Roll multiple d6
export const rollDice = (count) => {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollD6());
  }
  return rolls;
};

// Check if a roll is a hit given a target value
export const isHit = (roll, targetValue) => roll <= targetValue;

// Get effective attack value for a unit (including infantry+tank bonus)
export const getEffectiveAttack = (unit, allAttackingUnits) => {
  const unitDef = UNIT_TYPES[unit.type];
  let attack = unitDef.attack;

  // Infantry gets +1 attack when paired with a tank
  if (unit.type === 'INFANTRY') {
    const hasTank = allAttackingUnits.some(
      (u) => u.type === 'TANK' && u.id !== unit.id
    );
    if (hasTank) {
      attack = Math.min(attack + 1, 5); // cap at 5
    }
  }

  return attack;
};

// Get effective defense value for a unit (including terrain bonus)
export const getEffectiveDefense = (unit, territoryId) => {
  const unitDef = UNIT_TYPES[unit.type];
  let defense = unitDef.defense;

  // Apply terrain defense bonus
  const territory = TERRITORIES[territoryId];
  if (territory && territory.terrain) {
    const bonus = TERRAIN_DEFENSE_BONUS[territory.terrain] || 0;
    defense = Math.min(defense + bonus, 5); // cap at 5
  }

  return defense;
};

// Resolve one round of combat
// Returns: { attackerHits, defenderHits, attackerRolls, defenderRolls }
export const resolveCombatRound = (attackingUnits, defendingUnits, territoryId) => {
  // Separate submarines for first strike
  const attackingSubs = attackingUnits.filter((u) => u.type === 'SUBMARINE' || u.type === 'NUCLEAR_SUB');
  const defendingSubs = defendingUnits.filter((u) => u.type === 'SUBMARINE' || u.type === 'NUCLEAR_SUB');
  const hasDefenderDestroyer = defendingUnits.some((u) => u.type === 'DESTROYER');
  const hasAttackerDestroyer = attackingUnits.some((u) => u.type === 'DESTROYER');

  const attackerRolls = [];
  const defenderRolls = [];
  let attackerHits = 0;
  let defenderHits = 0;

  // First strike phase (subs, unless enemy has destroyer)
  const subFirstStrike = {
    attackerSubHits: 0,
    defenderSubHits: 0,
  };

  // Attacker subs first strike (if no defending destroyer)
  if (!hasDefenderDestroyer) {
    attackingSubs.forEach((unit) => {
      const roll = rollD6();
      const attack = getEffectiveAttack(unit, attackingUnits);
      const hit = isHit(roll, attack);
      attackerRolls.push({ unit, roll, target: attack, hit, firstStrike: true });
      if (hit) subFirstStrike.attackerSubHits++;
    });
  }

  // Defender subs first strike (if no attacking destroyer)
  if (!hasAttackerDestroyer) {
    defendingSubs.forEach((unit) => {
      const roll = rollD6();
      const defense = getEffectiveDefense(unit, territoryId);
      const hit = isHit(roll, defense);
      defenderRolls.push({ unit, roll, target: defense, hit, firstStrike: true });
      if (hit) subFirstStrike.defenderSubHits++;
    });
  }

  // Regular combat (all non-sub units, plus subs if enemy has destroyer)
  const regularAttackers = attackingUnits.filter((u) => {
    if ((u.type === 'SUBMARINE' || u.type === 'NUCLEAR_SUB') && !hasDefenderDestroyer) return false;
    return true;
  });

  const regularDefenders = defendingUnits.filter((u) => {
    if ((u.type === 'SUBMARINE' || u.type === 'NUCLEAR_SUB') && !hasAttackerDestroyer) return false;
    return true;
  });

  regularAttackers.forEach((unit) => {
    const roll = rollD6();
    const attack = getEffectiveAttack(unit, attackingUnits);
    const hit = isHit(roll, attack);
    attackerRolls.push({ unit, roll, target: attack, hit, firstStrike: false });
    if (hit) attackerHits++;
  });

  regularDefenders.forEach((unit) => {
    const roll = rollD6();
    const defense = getEffectiveDefense(unit, territoryId);
    const hit = isHit(roll, defense);
    defenderRolls.push({ unit, roll, target: defense, hit, firstStrike: false });
    if (hit) defenderHits++;
  });

  return {
    attackerHits: attackerHits + subFirstStrike.attackerSubHits,
    defenderHits: defenderHits + subFirstStrike.defenderSubHits,
    subFirstStrike,
    attackerRolls,
    defenderRolls,
  };
};

// THAAD interception roll for nuclear weapons
export const rollThaadIntercept = (thaadCount) => {
  const rolls = [];
  let intercepted = false;

  for (let i = 0; i < thaadCount; i++) {
    const roll = rollD6();
    const hit = roll <= 3;
    rolls.push({ roll, hit });
    if (hit) intercepted = true;
  }

  return { intercepted, rolls };
};

// Strategic bombing — bomber rolls for factory damage
export const rollStrategicBombing = (bomberCount) => {
  const rolls = [];
  let totalDamage = 0;

  for (let i = 0; i < bomberCount; i++) {
    const roll = rollD6();
    rolls.push(roll);
    totalDamage += roll;
  }

  return { totalDamage, rolls };
};
