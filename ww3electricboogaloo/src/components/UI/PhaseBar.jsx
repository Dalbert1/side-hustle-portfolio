import React from 'react';
import { FACTIONS, PHASES, PHASE_ORDER, PHASE_LABELS } from '../../constants/factions';
import { ACTIONS } from '../../game/gameReducer';
import { isAIFaction } from '../../game/ai';

const PhaseBar = ({ state, dispatch }) => {
  const currentFaction = FACTIONS[state.currentFaction];
  const currentPhaseIndex = PHASE_ORDER.indexOf(state.currentPhase);
  const economy = state.factionEconomies[state.currentFaction];
  const isAI = isAIFaction(state.currentFaction);

  const spent = state.purchases.reduce((sum, p) => p.cost + sum, 0);

  const canRewind = currentPhaseIndex > 0 && !isAI;

  return (
    <div className="phase-bar">
      <div className="phase-bar-top">
        <div className="round-info">
          Round {state.currentRound}
        </div>
        <div
          className="faction-name"
          style={{ color: currentFaction.lightColor }}
        >
          {currentFaction.name}
        </div>
        <div className="economy-info">
          💰 {economy.ipcs - spent} IPCs
          {spent > 0 && <span className="spent"> (-{spent} pending)</span>}
        </div>
      </div>

      <div className="phase-bar-phases">
        {PHASE_ORDER.map((phase, index) => (
          <div
            key={phase}
            className={`phase-step ${
              index === currentPhaseIndex
                ? 'active'
                : index < currentPhaseIndex
                ? 'completed'
                : ''
            }`}
            style={{
              borderColor:
                index === currentPhaseIndex
                  ? currentFaction.lightColor
                  : 'transparent',
            }}
          >
            {PHASE_LABELS[phase]}
          </div>
        ))}
      </div>

      <div className="phase-bar-actions">
        {canRewind && (
          <button
            className="btn btn-rewind"
            onClick={() => dispatch({ type: ACTIONS.REWIND_PHASE })}
          >
            ⏪ Rewind
          </button>
        )}
        <button
          className="btn btn-advance"
          onClick={() => dispatch({ type: ACTIONS.ADVANCE_PHASE })}
          style={{ backgroundColor: currentFaction.color }}
          disabled={isAI}
        >
          {currentPhaseIndex >= PHASE_ORDER.length - 1
            ? 'End Turn ▶'
            : `Next Phase ▶`}
        </button>
      </div>
    </div>
  );
};

export default PhaseBar;
