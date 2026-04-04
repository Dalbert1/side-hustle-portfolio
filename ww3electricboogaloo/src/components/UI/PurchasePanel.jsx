import React from 'react';
import { UNIT_TYPES, getAvailableUnits } from '../../constants/units';
import { FACTIONS, PHASES } from '../../constants/factions';
import { ACTIONS } from '../../game/gameReducer';

const PurchasePanel = ({ state, dispatch }) => {
  if (state.currentPhase !== PHASES.PURCHASE) return null;

  const faction = FACTIONS[state.currentFaction];
  const alliance = faction.alliance;
  const economy = state.factionEconomies[state.currentFaction];
  const spent = state.purchases.reduce((sum, p) => p.cost + sum, 0);
  const remaining = economy.ipcs - spent;

  const availableUnits = getAvailableUnits(alliance);

  // Group by category
  const categories = {
    land: availableUnits.filter((u) => u.category === 'land'),
    air: availableUnits.filter((u) => u.category === 'air'),
    naval: availableUnits.filter((u) => u.category === 'naval'),
  };

  return (
    <div className="purchase-panel">
      <h3>Purchase Units</h3>
      <p className="remaining-ipcs">
        Available: <strong>{remaining}</strong> IPCs
      </p>

      {Object.entries(categories).map(([cat, units]) => (
        <div key={cat} className="unit-category">
          <h4>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
          {units.map((unit) => (
            <button
              key={unit.id}
              className={`purchase-btn ${remaining < unit.cost ? 'disabled' : ''}`}
              disabled={remaining < unit.cost}
              onClick={() =>
                dispatch({ type: ACTIONS.PURCHASE_UNIT, unitType: unit.id })
              }
            >
              <span className="unit-icon">{unit.icon}</span>
              <span className="unit-name">{unit.name}</span>
              <span className="unit-cost">{unit.cost} IPC</span>
              <span className="unit-stats">
                A:{unit.attack} D:{unit.defense} M:{unit.move}
              </span>
            </button>
          ))}
        </div>
      ))}

      {state.purchases.length > 0 && (
        <div className="purchase-cart">
          <h4>Purchased ({spent} IPCs)</h4>
          {state.purchases.map((purchase, index) => (
            <div key={index} className="purchase-item">
              <span>
                {UNIT_TYPES[purchase.unitType].icon}{' '}
                {UNIT_TYPES[purchase.unitType].name}
              </span>
              <button
                className="cancel-btn"
                onClick={() =>
                  dispatch({ type: ACTIONS.CANCEL_PURCHASE, index })
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasePanel;
