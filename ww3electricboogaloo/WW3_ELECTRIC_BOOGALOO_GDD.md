# WW3 Electric Boogaloo — Game Design Document v1.0

## Overview

A web-based, two-player turn-based strategy game inspired by Axis & Allies, set in a near-future Middle East theater. One player controls the **Coalition** (USA, Israel, Gulf States) and the other controls the **Alliance** (Iran, Russian proxies, Chinese proxies). The game uses familiar Axis & Allies mechanics — dice-based combat, IPC-style economy, phased turns — with modern asymmetric units like drones, stealth fighters, and nuclear weapons.

**Platform:** React + Pixi.js/SVG, deployed on Vercel  
**Multiplayer:** Supabase Realtime (Phase 2)  
**Players:** 2 (one Coalition, one Alliance)

---

## Win Conditions

- **Coalition wins** by capturing and holding **Tehran** (Iran's capital territory)
- **Alliance wins** by capturing and holding **Israel**
- If a nuclear weapon successfully detonates on either capital, that side is immediately eliminated

---

## Factions & Turn Order

Each faction takes its turn in the following fixed order within a single game round:

| Order | Faction         | Player    | Role                                      |
|-------|-----------------|-----------|-------------------------------------------|
| 1     | USA             | Coalition | Primary military power, tech advantage    |
| 2     | Israel          | Coalition | Regional power, strong defense            |
| 3     | Gulf States     | Coalition | Production hubs, economic backbone        |
| 4     | Iran            | Alliance  | Homeland defense, drone swarms, proxies   |
| 5     | Russia Proxy    | Alliance  | Air defense systems, heavy armor          |
| 6     | China Proxy     | Alliance  | Economic muscle, naval presence           |

Each faction has its own income, units, and production but is controlled by one of the two players.

---

## Turn Phases

Each faction's turn follows this sequence:

1. **Purchase Phase** — Buy units with available IPCs. Units are placed at the end of the turn.
2. **Combat Move Phase** — Move units into enemy or contested territories to initiate combat.
3. **Combat Phase** — Resolve all battles using dice.
4. **Non-Combat Move Phase** — Move units that did not participate in combat.
5. **Place Units Phase** — Place purchased units in territories with factories.
6. **Collect Income** — Gain IPCs equal to total territory value controlled.

### Rewind Mechanic
During **Combat Move Phase**, the player may rewind to **Purchase Phase** to adjust purchases. State snapshots are taken at each phase transition to enable this. Rewind is only available backward one phase at a time and only before dice are rolled.

---

## Map — Territories

### Land Territories (~22)

| #  | Territory                | Region     | IPC Value | Starting Faction | Factory | Terrain     |
|----|--------------------------|------------|-----------|------------------|---------|-------------|
| 1  | **Israel**               | Levant     | 6         | Coalition        | Yes     | Urban       |
| 2  | **Jordan**               | Levant     | 1         | Coalition        | No      | Desert      |
| 3  | **Saudi Arabia (North)** | Gulf       | 3         | Coalition        | No      | Desert      |
| 4  | **Saudi Arabia (South)** | Gulf       | 4         | Coalition        | Yes     | Desert      |
| 5  | **Kuwait**               | Gulf       | 3         | Coalition        | Yes     | Desert      |
| 6  | **UAE**                  | Gulf       | 4         | Coalition        | Yes     | Desert      |
| 7  | **Qatar**                | Gulf       | 3         | Coalition        | Yes     | Desert      |
| 8  | **Bahrain**              | Gulf       | 1         | Coalition        | No      | Island      |
| 9  | **Iraq (South)**         | Contested  | 2         | Neutral          | No      | Desert      |
| 10 | **Iraq (North/Kurdistan)** | Contested| 2         | Neutral          | No      | Mountain    |
| 11 | **Syria**                | Levant     | 2         | Alliance         | No      | Mixed       |
| 12 | **Lebanon**              | Levant     | 1         | Alliance         | No      | Mountain    |
| 13 | **Tehran**               | Iran       | 6         | Alliance         | Yes     | Urban       |
| 14 | **Western Iran**         | Iran       | 3         | Alliance         | Yes     | Mountain    |
| 15 | **Southern Iran**        | Iran       | 2         | Alliance         | No      | Desert      |
| 16 | **Eastern Iran**         | Iran       | 2         | Alliance         | No      | Desert      |
| 17 | **Northern Iran**        | Iran       | 2         | Alliance         | No      | Mountain    |
| 18 | **Turkey**               | NATO       | 0         | Neutral          | No      | Mountain    |
| 19 | **Afghanistan**          | Central    | 1         | Neutral          | No      | Mountain    |
| 20 | **Pakistan**             | Central    | 2         | Alliance-leaning | No      | Mixed       |
| 21 | **Russia Staging Area**  | Off-map    | 8         | Alliance         | Yes     | —           |
| 22 | **China Staging Area**   | Off-map    | 10        | Alliance         | Yes     | —           |

> **Neutral territories** must be invaded to be controlled. Turkey is NATO but staying neutral unless attacked.  
> **Off-map staging areas** represent the Russian and Chinese homelands. They cannot be invaded — they only produce and send reinforcements via defined routes.

### Sea Zones (6)

| #  | Sea Zone               | Connects To (land)                                         |
|----|------------------------|------------------------------------------------------------|
| S1 | **Eastern Mediterranean** | Israel, Lebanon, Syria, Turkey                           |
| S2 | **Red Sea**            | Saudi Arabia (South), Jordan, Egypt (off-map edge)         |
| S3 | **Persian Gulf (West)**| Kuwait, Saudi Arabia (North), Bahrain, Qatar               |
| S4 | **Persian Gulf (East)**| UAE, Southern Iran                                         |
| S5 | **Arabian Sea**        | UAE, Southern Iran, Eastern Iran, Pakistan                  |
| S6 | **Indian Ocean**       | China Staging Area, Arabian Sea access                      |

### Territory Adjacency List

```
Israel ↔ Jordan, Lebanon, Syria, S1
Jordan ↔ Israel, Saudi Arabia (North), Iraq (South)
Saudi Arabia (North) ↔ Jordan, Kuwait, Iraq (South), Saudi Arabia (South), S3
Saudi Arabia (South) ↔ Saudi Arabia (North), UAE, Qatar, S2
Kuwait ↔ Saudi Arabia (North), Iraq (South), S3
UAE ↔ Saudi Arabia (South), Southern Iran, S4, S5
Qatar ↔ Saudi Arabia (South), S3
Bahrain ↔ S3
Iraq (South) ↔ Iraq (North), Jordan, Saudi Arabia (North), Kuwait, Western Iran
Iraq (North) ↔ Iraq (South), Syria, Turkey, Northern Iran
Syria ↔ Iraq (North), Lebanon, Turkey, S1
Lebanon ↔ Israel, Syria, S1
Tehran ↔ Western Iran, Northern Iran, Eastern Iran
Western Iran ↔ Tehran, Iraq (South), Northern Iran, Southern Iran
Southern Iran ↔ Western Iran, Eastern Iran, UAE, S4, S5
Eastern Iran ↔ Tehran, Southern Iran, Afghanistan, Pakistan, S5
Northern Iran ↔ Tehran, Western Iran, Iraq (North), Turkey, Afghanistan
Turkey ↔ Iraq (North), Syria, Northern Iran, S1
Afghanistan ↔ Eastern Iran, Northern Iran, Pakistan
Pakistan ↔ Eastern Iran, Afghanistan, S5
Russia Staging Area → Syria, Northern Iran (one-way reinforcement routes)
China Staging Area → Pakistan, S6 → S5 (one-way reinforcement route)
```

---

## Units

### Combat Dice
All combat uses a **d6**. Each unit has an attack value and defense value — the unit scores a hit if the die roll is **equal to or less than** that value.

### Terrain Modifiers
- **Mountain:** Defenders get +1 to defense value (capped at 5)
- **Urban:** Defenders get +1 to defense value (capped at 5)
- **Desert:** No modifier

### Land Units

| Unit           | Cost | Move | Attack | Defense | Special                                       |
|----------------|------|------|--------|---------|-----------------------------------------------|
| Infantry       | 3    | 1    | 1      | 2       | Cheapest unit. +1 attack when paired with tank |
| Tank           | 6    | 3    | 3      | 3       | Blitz: can pass through unoccupied territory   |
| THAAD Battery  | 8    | 0    | 0      | 0       | Static. Intercepts nukes on 3 or less (d6)     |

### Air Units

| Unit             | Cost | Move | Attack | Defense | Special                                             |
|------------------|------|------|--------|---------|-----------------------------------------------------|
| Fighter (F-35)   | 10   | 4    | 3      | 4       | Coalition only. Air superiority                     |
| Fighter (SU-57)  | 9    | 4    | 3      | 3       | Alliance only. Slightly cheaper                     |
| Drone            | 4    | 5    | 2      | 1       | Cheap swarm unit. Can hit naval. Fragile             |
| Bomber           | 12   | 6    | 4      | 1       | Strategic bombing raids on factories                |
| Nuclear Bomber   | 30   | 8    | —      | 1       | Delivers nuclear payload. 3-round build time         |

### Naval Units

| Unit             | Cost | Move | Attack | Defense | Special                                            |
|------------------|------|------|--------|---------|---------------------------------------------------|
| Destroyer        | 8    | 2    | 2      | 2       | Can detect and attack submarines                   |
| Cruiser          | 12   | 2    | 3      | 3       | Shore bombardment (1 shot at 3 during amphibious)  |
| Carrier          | 16   | 2    | 1      | 2       | Carries up to 2 air units                          |
| Submarine        | 7    | 2    | 2      | 1       | First strike, can submerge to retreat               |
| Nuclear Sub      | 25   | 3    | 3      | 2       | Delivers nuclear payload. 3-round build time        |
| Transport        | 7    | 2    | 0      | 0       | Carries 1 tank OR 2 infantry. Defenseless           |

---

## Nuclear Weapons

### Acquisition
- Nuclear Bomber and Nuclear Submarine each cost their listed IPC amount
- They take **3 full rounds** to build after purchase (place a "under construction" marker, track rounds)
- Only **Tehran, Israel, Russia Staging, China Staging, and USA (off-map income)** can build nuclear weapons

### Delivery
- Nuclear Bomber flies to target territory. Enemy fighters in the territory or adjacent territories may scramble to intercept (standard air combat, one round)
- Nuclear Sub must be in a sea zone adjacent to the target territory

### Interception
- **THAAD Battery** in the target territory (or adjacent territory) rolls a d6: intercepts on **3 or less**
- Multiple THAAD batteries each get a separate roll
- If intercepted, the nuclear weapon is destroyed along with its carrier

### Detonation Effects
- **All units** in the territory are destroyed (both sides)
- Territory becomes **impassable wasteland** — no units may enter, no production, no income
- The faction that owned the territory **loses all production capability there permanently**
- Existing units in other territories remain active but that faction can no longer produce from the nuked territory

### Mutual Assured Destruction (Optional Rule)
If a capital (Tehran or Israel) is nuked, the owning side may immediately launch any nuclear weapons they have already built as a retaliatory strike, even outside normal turn order.

---

## Economy & Production

### Income
Each faction collects IPCs equal to the total value of all territories they control at the end of their turn.

### Base Income (no territory changes)

| Faction       | Starting IPC Income |
|---------------|---------------------|
| USA           | 15 (off-map base)   |
| Israel        | 6                   |
| Gulf States   | 15                  |
| Iran          | 15                  |
| Russia Proxy  | 8                   |
| China Proxy   | 10                  |

> **USA off-map income** represents the American homeland economy. USA starts with 15 IPC base income that cannot be lost, plus any captured territory income. Units must be transported to the theater.

### Factories
- Units can only be placed in territories with factories
- Factories can be **strategically bombed** by Bombers: each bomber rolls 1d6, that many IPCs of production capacity are lost for the next turn
- Factories can be repaired at a cost of 1 IPC per point of damage
- A new factory can be built in any controlled territory for **15 IPCs** (placed at end of turn, usable next turn)

### USA Reinforcement
USA purchases units during its turn and places them at any factory it controls OR at an off-map staging point. Off-map units must be transported by sea to the theater, arriving in the sea zone on the following turn.

---

## Starting Forces

### Coalition

**USA** (units start off-map, must transport in — OR pre-positioned in Gulf):
- Pre-positioned in Kuwait: 3 Infantry, 1 Tank, 1 Fighter
- Pre-positioned in Qatar: 2 Infantry, 1 Bomber
- Persian Gulf (S3): 1 Carrier, 1 Destroyer, 1 Transport
- Off-map ready to deploy: 5 Infantry, 2 Tanks, 2 Fighters, 1 Bomber, 2 Destroyers, 1 Carrier, 2 Transports

**Israel:**
- Israel: 5 Infantry, 2 Tanks, 2 Fighters (F-35), 1 Bomber, 1 THAAD Battery
- S1 (Eastern Mediterranean): 1 Destroyer, 1 Submarine

**Gulf States:**
- Saudi Arabia (South): 3 Infantry, 1 Tank
- UAE: 2 Infantry, 1 Fighter, 1 Drone
- Saudi Arabia (North): 2 Infantry
- Kuwait: (USA units pre-positioned here)
- S4: 1 Destroyer

### Alliance

**Iran:**
- Tehran: 4 Infantry, 2 Tanks, 1 Fighter (SU-57), 1 THAAD Battery
- Western Iran: 4 Infantry, 2 Tanks
- Southern Iran: 3 Infantry, 1 Drone
- Northern Iran: 3 Infantry, 1 Drone
- Eastern Iran: 2 Infantry, 2 Drones
- S4 (shared): 1 Submarine, 1 Destroyer
- Lebanon: 2 Infantry, 1 Drone (Hezbollah proxy)
- Syria: 3 Infantry, 1 Drone

**Russia Proxy:**
- Syria: 2 Infantry, 1 Tank, 2 Fighters (SU-57), 1 Bomber
- Russia Staging Area: 5 Infantry, 3 Tanks, 2 Fighters, 1 Bomber
- S1 (Eastern Med): 1 Cruiser, 1 Submarine

**China Proxy:**
- Pakistan: 2 Infantry, 1 Tank
- China Staging Area: 6 Infantry, 3 Tanks, 2 Fighters, 1 Bomber, 1 Drone
- S6 (Indian Ocean): 1 Carrier, 2 Destroyers, 1 Submarine, 2 Transports

---

## Combat Rules

### Standard Combat (Land & Sea)
1. **Attacker** rolls 1d6 per attacking unit. Hits scored if roll ≤ unit's attack value.
2. **Defender** rolls 1d6 per defending unit. Hits scored if roll ≤ unit's defense value.
3. Both sides assign casualties simultaneously (owner chooses which units die).
4. Attacker may **retreat** all surviving units to the territory they attacked from, or continue.
5. Repeat until one side is eliminated or attacker retreats.

### Air Combat
- Fighters can **scramble** from adjacent territories to defend (max 1 territory away)
- Air units must land in a friendly territory within their move range at end of turn
- Carriers count as landing zones for air units

### Amphibious Assault
1. Transports unload units into a coastal territory
2. Cruisers/destroyers in the sea zone provide **shore bombardment** (one attack roll each at their attack value)
3. Normal combat proceeds on land
4. If the attacker retreats, surviving land units are destroyed (no transport pickup mid-battle)

### Submarine Special Rules
- **First strike:** Submarines fire first. Casualties from sub attacks are removed before they can fire back (unless a destroyer is present)
- **Submerge:** Submarines can choose to submerge (retreat) instead of fighting, unless an enemy destroyer is present

### Blitz (Tanks)
- Tanks can move through **one unoccupied enemy territory** and continue to attack a second territory in the same move
- Both territories are captured

### Strategic Bombing
- Bombers can target a factory instead of engaging in regular combat
- Escorting fighters and intercepting fighters engage in one round of air combat
- Each surviving bomber rolls 1d6: the factory loses that many IPCs of production capacity next turn

---

## Faction Asymmetry Summary

| Faction     | Strength                        | Weakness                          |
|-------------|----------------------------------|-----------------------------------|
| USA         | Best tech, F-35s, naval power    | Far from theater, needs transports|
| Israel      | Strong defense, THAAD, elite AF  | Small territory, surrounded       |
| Gulf States | Rich, multiple factories         | Weak military, depends on allies  |
| Iran        | Terrain advantage, drone swarms  | Weaker tech, limited navy         |
| Russia      | Air power, S-400 potential       | Off-map, limited reinforcement    |
| China       | Economic power, strong navy      | Farthest from theater             |

---

## Tech Tree (Post-MVP — Future Feature)

Potential future additions:
- **Cyber Warfare:** Disable a factory for 1 turn
- **Stealth Tech:** F-35s get first strike against non-stealth fighters
- **Advanced Drones:** Upgraded drones hit on 1-3
- **Missile Defense Network:** Linked THAAD batteries share intercept rolls
- **Proxy Insurgency:** Spawn free infantry in contested territories

---

## MVP Scope Checklist

### Phase 1 — Single Player Hotseat
- [ ] SVG territory map with clickable regions
- [ ] Game state in React useReducer
- [ ] Turn phase flow with rewind support
- [ ] Unit purchase interface
- [ ] Unit movement (click source → click destination)
- [ ] Dice-based combat resolution UI
- [ ] Unit placement at factories
- [ ] Income collection
- [ ] Win condition check
- [ ] Nuclear weapon build tracking and delivery

### Phase 2 — Online Multiplayer
- [ ] Supabase game state persistence
- [ ] Supabase Realtime for turn sync
- [ ] Lobby/game creation
- [ ] Chat between players

### Phase 3 — Polish
- [ ] Animated dice rolls
- [ ] Unit sprites/icons
- [ ] Sound effects
- [ ] Fog of war (optional)
- [ ] Basic AI opponent
- [ ] Game history/replay

---

*WW3 Electric Boogaloo — v1.0 GDD*
*Designed for fun, not geopolitical accuracy.*
