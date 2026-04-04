import React, { useState, useCallback } from 'react';
import { TERRITORIES, ADJACENCY } from '../../constants/territories';
import { FACTIONS } from '../../constants/factions';
import { UNIT_TYPES } from '../../constants/units';
import { getUnitsInTerritory, areAllied } from '../../game/gameReducer';

// Simplified territory shapes as SVG polygons
// These are approximate — replace with proper map paths later
const TERRITORY_PATHS = {
  // Levant & Mediterranean
  israel:       'M 170,265 L 185,260 L 200,275 L 195,300 L 180,305 L 170,290 Z',
  jordan:       'M 200,275 L 230,270 L 245,300 L 240,325 L 210,320 L 195,300 Z',
  lebanon:      'M 175,235 L 195,230 L 200,250 L 190,260 L 175,255 Z',
  syria:        'M 195,195 L 260,190 L 270,225 L 235,245 L 200,250 L 195,230 Z',

  // Iraq
  iraq_north:   'M 260,190 L 310,185 L 320,225 L 290,245 L 270,225 Z',
  iraq_south:   'M 270,225 L 290,245 L 330,270 L 330,310 L 300,320 L 260,310 L 245,300 L 250,260 Z',

  // Gulf States
  kuwait:       'M 300,320 L 330,310 L 340,330 L 320,345 L 300,340 Z',
  saudi_north:  'M 245,300 L 260,310 L 300,340 L 320,345 L 340,360 L 300,380 L 260,370 L 240,345 Z',
  saudi_south:  'M 240,345 L 260,370 L 300,380 L 340,400 L 370,410 L 340,440 L 280,450 L 220,430 L 200,400 Z',
  qatar:        'M 340,370 L 355,365 L 360,385 L 350,395 L 340,390 Z',
  bahrain:      'M 330,365 L 340,362 L 342,375 L 335,378 Z',
  uae:          'M 370,385 L 400,375 L 420,395 L 405,420 L 370,410 Z',

  // Iran
  tehran:       'M 390,210 L 440,200 L 460,230 L 445,260 L 400,260 L 385,240 Z',
  western_iran: 'M 330,230 L 385,240 L 400,260 L 395,300 L 360,310 L 330,280 Z',
  northern_iran:'M 350,160 L 420,150 L 450,180 L 440,200 L 390,210 L 370,195 Z',
  southern_iran:'M 360,310 L 395,300 L 430,310 L 440,350 L 410,370 L 375,360 Z',
  eastern_iran: 'M 445,260 L 500,250 L 520,300 L 500,330 L 460,320 L 430,310 L 440,280 Z',

  // Turkey (large, north)
  turkey:       'M 160,140 L 280,130 L 320,160 L 310,185 L 260,190 L 195,195 L 175,180 Z',

  // Central Asia
  afghanistan:  'M 500,180 L 550,175 L 560,220 L 540,260 L 500,250 L 490,210 Z',
  pakistan:     'M 520,300 L 560,280 L 590,310 L 580,360 L 540,370 L 510,340 Z',

  // Off-map areas (simplified boxes)
  usa_staging:     'M 20,30 L 120,30 L 120,90 L 20,90 Z',
  russia_staging:  'M 300,30 L 420,30 L 420,90 L 300,90 Z',
  china_staging:   'M 540,50 L 650,50 L 650,120 L 540,120 Z',
};

// Sea zone shapes (blue regions)
const SEA_ZONE_PATHS = {
  east_med:          'M 130,150 L 170,140 L 175,180 L 175,235 L 170,265 L 145,290 L 120,260 L 120,180 Z',
  red_sea:           'M 140,300 L 170,290 L 180,305 L 200,400 L 180,440 L 140,420 Z',
  persian_gulf_west: 'M 300,340 L 340,330 L 355,365 L 340,390 L 300,380 Z',
  persian_gulf_east: 'M 370,345 L 410,370 L 420,395 L 405,420 L 370,410 L 355,380 Z',
  arabian_sea:       'M 405,420 L 460,390 L 530,400 L 560,440 L 500,470 L 420,460 Z',
  indian_ocean:      'M 560,380 L 650,370 L 660,460 L 560,470 Z',
};

// Get the fill color for a territory
const getTerritoryColor = (territoryId, state, isHovered, isSelected) => {
  const territory = TERRITORIES[territoryId];
  if (!territory) return '#444';

  if (state.nukedTerritories?.[territoryId]) return '#1a1a1a';

  const owner = state.territoryOwnership[territoryId];
  if (!owner) {
    // Neutral
    if (isSelected) return '#b0b0b0';
    if (isHovered) return '#999';
    return '#888';
  }

  const faction = FACTIONS[owner];
  if (!faction) return '#888';

  if (isSelected) return faction.lightColor;
  if (isHovered) return faction.lightColor + 'cc';
  return faction.color;
};

// Count unit types in a territory for display
const getUnitSummary = (state, territoryId) => {
  const units = getUnitsInTerritory(state, territoryId);
  if (units.length === 0) return null;

  const summary = {};
  units.forEach((unit) => {
    const icon = UNIT_TYPES[unit.type]?.icon || '?';
    summary[icon] = (summary[icon] || 0) + 1;
  });

  return summary;
};

const GameMap = ({ state, dispatch, onTerritoryClick }) => {
  const [hoveredTerritory, setHoveredTerritory] = useState(null);

  const handleClick = useCallback(
    (territoryId) => {
      if (onTerritoryClick) onTerritoryClick(territoryId);
    },
    [onTerritoryClick]
  );

  return (
    <div className="game-map-container">
      <svg
        viewBox="0 0 680 500"
        className="game-map-svg"
        style={{
          width: '100%',
          height: '100%',
          background: '#0a1628',
        }}
      >
        {/* Sea zones (render first, behind land) */}
        {Object.entries(SEA_ZONE_PATHS).map(([zoneId, path]) => (
          <g key={zoneId} data-sea-zone={zoneId}>
            <path
              d={path}
              fill={
                state.selectedTerritory === zoneId
                  ? '#2980b9'
                  : hoveredTerritory === zoneId
                  ? '#1a5276'
                  : '#0d2137'
              }
              stroke="#1a3a5c"
              strokeWidth="1"
              opacity="0.7"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredTerritory(zoneId)}
              onMouseLeave={() => setHoveredTerritory(null)}
              onClick={() => handleClick(zoneId)}
            />
            <text
              x={TERRITORIES[zoneId]?.center?.x || 0}
              y={TERRITORIES[zoneId]?.center?.y || 0}
              fill="#3498db"
              fontSize="8"
              textAnchor="middle"
              pointerEvents="none"
              opacity="0.6"
            >
              {TERRITORIES[zoneId]?.name || zoneId}
            </text>
          </g>
        ))}

        {/* Adjacency lines (subtle) */}
        {Object.entries(ADJACENCY).map(([from, neighbors]) =>
          neighbors.map((to) => {
            const fromT = TERRITORIES[from];
            const toT = TERRITORIES[to];
            if (!fromT?.center || !toT?.center) return null;
            // Only draw once (from < to alphabetically)
            if (from > to) return null;
            return (
              <line
                key={`${from}-${to}`}
                x1={fromT.center.x}
                y1={fromT.center.y}
                x2={toT.center.x}
                y2={toT.center.y}
                stroke="#ffffff10"
                strokeWidth="0.5"
                strokeDasharray="3,3"
              />
            );
          })
        )}

        {/* Land territories */}
        {Object.entries(TERRITORY_PATHS).map(([territoryId, path]) => {
          const territory = TERRITORIES[territoryId];
          const isHovered = hoveredTerritory === territoryId;
          const isSelected = state.selectedTerritory === territoryId;
          const color = getTerritoryColor(territoryId, state, isHovered, isSelected);
          const unitSummary = getUnitSummary(state, territoryId);

          return (
            <g key={territoryId} data-territory={territoryId}>
              {/* Territory shape */}
              <path
                d={path}
                fill={color}
                stroke={isSelected ? '#fff' : '#0a1628'}
                strokeWidth={isSelected ? 2 : 1}
                style={{ cursor: 'pointer', transition: 'fill 0.15s' }}
                onMouseEnter={() => setHoveredTerritory(territoryId)}
                onMouseLeave={() => setHoveredTerritory(null)}
                onClick={() => handleClick(territoryId)}
              />

              {/* Territory name */}
              <text
                x={territory?.center?.x || 0}
                y={(territory?.center?.y || 0) - 8}
                fill="#fff"
                fontSize={territory?.isOffMap ? '10' : '7'}
                fontWeight="600"
                textAnchor="middle"
                pointerEvents="none"
                style={{ textShadow: '1px 1px 2px #000' }}
              >
                {territory?.name || territoryId}
              </text>

              {/* IPC value */}
              {territory?.ipcValue > 0 && (
                <text
                  x={territory.center.x}
                  y={territory.center.y}
                  fill="#ffd700"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {territory.ipcValue}
                </text>
              )}

              {/* Factory indicator */}
              {territory?.hasFactory && (
                <text
                  x={territory.center.x + 15}
                  y={territory.center.y - 8}
                  fontSize="10"
                  pointerEvents="none"
                >
                  🏭
                </text>
              )}

              {/* Unit summary */}
              {unitSummary && (
                <text
                  x={territory?.center?.x || 0}
                  y={(territory?.center?.y || 0) + 14}
                  fill="#fff"
                  fontSize="8"
                  textAnchor="middle"
                  pointerEvents="none"
                  style={{ textShadow: '1px 1px 2px #000' }}
                >
                  {Object.entries(unitSummary)
                    .map(([icon, count]) => `${icon}${count}`)
                    .join(' ')}
                </text>
              )}

              {/* Nuked indicator */}
              {state.nukedTerritories?.[territoryId] && (
                <text
                  x={territory?.center?.x || 0}
                  y={territory?.center?.y || 0}
                  fontSize="20"
                  textAnchor="middle"
                  dominantBaseline="central"
                  pointerEvents="none"
                >
                  ☢️
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GameMap;
