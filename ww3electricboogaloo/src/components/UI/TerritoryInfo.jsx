import React from 'react';
import { TERRITORIES } from '../../constants/territories';
import { FACTIONS, PHASES } from '../../constants/factions';
import { UNIT_TYPES } from '../../constants/units';
import { getUnitsInTerritory, areAllied, ACTIONS } from '../../game/gameReducer';
import { ADJACENCY } from '../../constants/territories';

const TerritoryInfo = ({ state, dispatch }) => {
  const { selectedTerritory, currentFaction, currentPhase } = state;

  if (!selectedTerritory) {
    return (
      <div className="territory-info">
        <p className="hint">Click a territory to see details</p>
      </div>
    );
  }

  const territory = TERRITORIES[selectedTerritory];
  if (!territory) return null;

  const owner = state.territoryOwnership[selectedTerritory];
  const ownerFaction = owner ? FACTIONS[owner] : null;
  const units = getUnitsInTerritory(state, selectedTerritory);
  const isNuked = state.nukedTerritories?.[selectedTerritory];

  // Group units by faction then type
  const unitsByFaction = {};
  units.forEach((unit) => {
    if (!unitsByFaction[unit.faction]) {
      unitsByFaction[unit.faction] = {};
    }
    if (!unitsByFaction[unit.faction][unit.type]) {
      unitsByFaction[unit.faction][unit.type] = [];
    }
    unitsByFaction[unit.faction][unit.type].push(unit);
  });

  // Movement: check if we can move units from here
  const isMovementPhase =
    currentPhase === PHASES.COMBAT_MOVE || currentPhase === PHASES.NON_COMBAT_MOVE;
  const ownUnitsHere = units.filter((u) => u.faction === currentFaction && !u.hasMoved);
  const canMoveFrom = isMovementPhase && ownUnitsHere.length > 0;

  // Get adjacent territories for movement
  const adjacentIds = ADJACENCY[selectedTerritory] || [];

  const handleMoveAll = (destination) => {
    dispatch({
      type: ACTIONS.MOVE_UNITS,
      unitIds: ownUnitsHere.map((u) => u.id),
      destination,
    });
  };

  return (
    <div className="territory-info">
      <h3
        style={{
          color: ownerFaction ? ownerFaction.lightColor : '#888',
          borderBottom: `2px solid ${ownerFaction ? ownerFaction.color : '#444'}`,
          paddingBottom: '8px',
        }}
      >
        {territory.name}
        {isNuked && ' ☢️ NUKED'}
      </h3>

      <div className="territory-details">
        {territory.ipcValue > 0 && (
          <span className="detail">💰 {territory.ipcValue} IPC</span>
        )}
        {territory.terrain && (
          <span className="detail">🏔️ {territory.terrain}</span>
        )}
        {territory.hasFactory && <span className="detail">🏭 Factory</span>}
        {owner && (
          <span className="detail" style={{ color: ownerFaction?.lightColor }}>
            🏳️ {ownerFaction?.name}
          </span>
        )}
        {!owner && <span className="detail neutral">⚪ Neutral</span>}
      </div>

      {/* Units in territory */}
      {Object.entries(unitsByFaction).map(([factionId, unitTypes]) => (
        <div key={factionId} className="unit-group">
          <h4 style={{ color: FACTIONS[factionId]?.lightColor }}>
            {FACTIONS[factionId]?.name}
          </h4>
          {Object.entries(unitTypes).map(([type, unitList]) => (
            <div key={type} className="unit-row">
              <span className="unit-icon">{UNIT_TYPES[type]?.icon}</span>
              <span className="unit-name">{UNIT_TYPES[type]?.name}</span>
              <span className="unit-count">×{unitList.length}</span>
            </div>
          ))}
        </div>
      ))}

      {units.length === 0 && (
        <p className="no-units">No units in this territory</p>
      )}

      {/* Movement options */}
      {canMoveFrom && (
        <div className="move-options">
          <h4>Move {ownUnitsHere.length} units to:</h4>
          <div className="move-buttons">
            {adjacentIds.map((adjId) => {
              const adjTerritory = TERRITORIES[adjId];
              if (!adjTerritory) return null;
              const adjOwner = state.territoryOwnership[adjId];
              const isEnemy = adjOwner && !areAllied(adjOwner, currentFaction);

              return (
                <button
                  key={adjId}
                  className={`move-btn ${isEnemy ? 'enemy' : ''}`}
                  onClick={() => handleMoveAll(adjId)}
                >
                  {isEnemy ? '⚔️' : '➡️'} {adjTerritory.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritoryInfo;
