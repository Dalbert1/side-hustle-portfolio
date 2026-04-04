import React, { useReducer, useCallback, useEffect, useRef } from 'react';
import {
  gameReducer,
  createInitialState,
  ACTIONS,
} from './game/gameReducer';
import { isAIFaction, aiPurchase, aiCombatMoves } from './game/ai';
import { PHASES } from './constants/factions';
import GameMap from './components/Map/GameMap';
import PhaseBar from './components/UI/PhaseBar';
import PurchasePanel from './components/UI/PurchasePanel';
import TerritoryInfo from './components/UI/TerritoryInfo';
import GameLog from './components/UI/GameLog';
import './App.css';

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const aiTimerRef = useRef(null);

  // AI turn execution - auto-advance through phases
  useEffect(() => {
    if (state.gameOver) return;
    if (!isAIFaction(state.currentFaction)) return;

    // Clear any existing timer
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    aiTimerRef.current = setTimeout(() => {
      const phase = state.currentPhase;

      if (phase === PHASES.PURCHASE) {
        // Execute AI purchases
        const purchases = aiPurchase(state);
        purchases.forEach((p) => {
          dispatch({ type: ACTIONS.PURCHASE_UNIT, unitType: p.unitType });
        });
        // Then advance
        dispatch({ type: ACTIONS.ADVANCE_PHASE });
      } else if (phase === PHASES.COMBAT_MOVE) {
        // Execute AI combat moves
        const moves = aiCombatMoves(state);
        moves.forEach((move) => {
          dispatch({
            type: ACTIONS.MOVE_UNITS,
            unitIds: move.unitIds,
            destination: move.destination,
          });
        });
        dispatch({ type: ACTIONS.ADVANCE_PHASE });
      } else {
        // For all other phases (combat resolution, non-combat, place, collect), just advance
        dispatch({ type: ACTIONS.ADVANCE_PHASE });
      }
    }, 800); // Short delay so player can see what's happening

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [state.currentFaction, state.currentPhase, state.gameOver]);

  const handleTerritoryClick = useCallback(
    (territoryId) => {
      dispatch({ type: ACTIONS.SELECT_TERRITORY, territoryId });
    },
    [dispatch]
  );

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>WW3 <span className="subtitle">Electric Boogaloo</span></h1>
        <button className="btn btn-small" onClick={handleNewGame}>
          New Game
        </button>
      </header>

      {/* Phase Bar */}
      <PhaseBar state={state} dispatch={dispatch} />

      {/* Main Game Area */}
      <div className="game-layout">
        {/* Left Panel */}
        <aside className="panel panel-left">
          <PurchasePanel state={state} dispatch={dispatch} />
          <TerritoryInfo state={state} dispatch={dispatch} />
        </aside>

        {/* Map */}
        <main className="map-area">
          <GameMap
            state={state}
            dispatch={dispatch}
            onTerritoryClick={handleTerritoryClick}
          />
        </main>

        {/* Right Panel */}
        <aside className="panel panel-right">
          <GameLog log={state.gameLog} />
        </aside>
      </div>

      {/* Game Over Overlay */}
      {state.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>🏆 {state.winner} Wins!</h2>
            <p>Game Over — Round {state.currentRound}</p>
            <button className="btn btn-advance" onClick={handleNewGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
