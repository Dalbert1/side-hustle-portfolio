# WW3 Electric Boogaloo

## Overview
Turn-based strategy game inspired by Axis & Allies, set in a modern Middle East theater. Two-player (Coalition vs Alliance) with dice-based combat, phased turns, and nuclear weapons.

## Tech Stack
- **Frontend:** React (Vite), vanilla CSS
- **State Management:** useReducer (game state is a single serializable JSON object)
- **Deployment:** Vercel
- **Multiplayer (Phase 2):** Supabase Realtime

## Architecture

### Data Flow
All game state lives in `src/game/gameReducer.js` via `useReducer`. State is a single flat object that can be serialized to JSON (important for future Supabase sync and undo/rewind).

### Key Files
```
src/
├── constants/
│   ├── units.js          # Unit type definitions (stats, costs, specials)
│   ├── territories.js    # Territory map data, adjacency, terrain
│   └── factions.js       # Factions, turn order, starting forces, phases
├── game/
│   ├── gameReducer.js    # Core game state + reducer + action types
│   ├── combat.js         # Dice rolling, combat resolution, THAAD intercept
│   └── ai.js             # Basic AI opponent (priority-based)
├── components/
│   ├── Map/
│   │   └── GameMap.jsx   # SVG territory map with unit overlays
│   ├── UI/
│   │   ├── PhaseBar.jsx  # Turn phase indicator + advance/rewind buttons
│   │   ├── PurchasePanel.jsx  # Unit purchase interface
│   │   ├── TerritoryInfo.jsx  # Selected territory details + move options
│   │   └── GameLog.jsx   # Scrolling game event log
│   └── Combat/           # (TODO) Combat resolution UI
├── App.jsx               # Main layout assembling all components
└── App.css               # Dark military theme styles
```

### Game Design Document
Full GDD is at project root: `WW3_ELECTRIC_BOOGALOO_GDD.md`

## Key Design Decisions
- SVG polygons for territory shapes (easy to click, scales to any screen)
- Emoji for unit icons (placeholder — replace with sprites later)
- State snapshots at phase transitions enable rewind mechanic
- All combat uses d6 dice: hit if roll <= unit's attack/defense value
- Territory terrain gives defense bonuses (mountain +1, urban +1)
- Nuclear weapons take 3 rounds to build, can be intercepted by THAAD

## Current State (Phase 1 MVP)
- [x] Game state reducer with full turn phase flow
- [x] Territory map with adjacency data (22 land + 6 sea zones)
- [x] Unit definitions with all stats from GDD
- [x] Purchase phase UI
- [x] Territory selection and info display
- [x] Basic movement (click territory → click adjacent to move all)
- [x] Phase advancement with rewind support
- [x] Game log
- [x] Basic AI skeleton (priority-based)
- [ ] Combat resolution UI (dice rolls, casualty assignment)
- [ ] Unit placement at specific factories (currently auto-places at first factory)
- [ ] Movement validation (range checking, blitz, air landing)
- [ ] Strategic bombing
- [ ] Nuclear weapon delivery + THAAD interception UI
- [ ] Win condition checking wired into turn flow
- [ ] AI actually executing moves during its turn
- [ ] Proper SVG map paths (current paths are approximate)

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Conventions
- All game state changes go through the reducer — never mutate state directly
- State must stay JSON-serializable (no class instances, no functions, no circular refs)
- Unit IDs are auto-generated strings: `unit_1`, `unit_2`, etc.
- Territory IDs are snake_case strings matching their key in TERRITORIES object
- Faction IDs are UPPER_CASE matching their key in FACTIONS object
