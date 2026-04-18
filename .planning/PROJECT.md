# Project: Witcher Senses AR Investigation Engine

A high-fidelity AR investigation layer for real-world games, enabling players to discover hidden digital clues anchored precisely to the physical environment.

## Context

The project adds a "Witcher Senses" mechanic to the existing Ludvia/gcr26 platform. It bridges the gap between digital story states and physical spaces by allowing game masters to record environments and place clues (footsteps, bloodstains, objects) that players can only see through their mobile device's AR lens.

## Core Value

**Seamless Immersion:** Providing a stable, offline-capable digital layer that feels physically present in the real world, enabling deep narrative investigation in any environment.

## Requirements

### Validated (Existing Infrastructure)

- ✓ **BaaS Integration** — Firestore for real-time state and user profiles.
- ✓ **Auth System** — Firebase Auth for admin/player identity.
- ✓ **Monorepo Structure** — Shared types and logic between Admin (Web) and Mobile (Expo).
- ✓ **Location Services** — Background GPS tracking and proximity logic via `expo-location`.
- ✓ **Admin Dashboard** — Web-based UI for managing games, quests, and players.
- ✓ **Plane Detection (CORE-02)** — Verified in Phase 1.
- ✓ **Spatial Map Serialization (CORE-03)** — Verified in Phase 2.
- ✓ **Spatial Mapping Interface (ADM-01)** — Verified in Phase 3.
- ✓ **Clue Placement Tool (ADM-02, CORE-01)** — Verified in Phase 4; GMs can drop and orient clues.

### Active (AR Engine Development)

- [ ] **Offline Clue Persistence** — Ability to preload spatial maps and clue data for areas without connectivity.
- [ ] **Hybrid Positioning** — Using GPS for area navigation and local spatial anchors for precise AR placement.
- [ ] **Visual Discovery Logic** — Hidden clues that only manifest when viewed through the AR lens within specific range/orientation.
- [ ] **Linear Investigation State** — Game state updates that trigger the next clue only after the previous one is "discovered."
- [ ] **AR Rendering Pipeline** — Integration of `expo-gl` or a similar engine to render high-quality "witcher-style" indicators (trails, glows).

### Out of Scope

- **Real-time Audio Processing** — Distorted/directional audio filters (deferred to focus on visuals).
- **Procedural Clue Generation** — Relative placement; we are focusing on authored, fixed-location arcs.
- **Active Clue Interaction** — "Cleaning" or "Extracting" clues; discovery is purely visual for v1.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Spatial Mapping over GPS** | GPS is too imprecise for "hidden clues" (1-10m drift); SLAM/LiDAR allows cm-level anchoring. | **Approved** |
| **Offline-First Preloading** | Investigations often happen in "scary" or remote locations with poor signal (cellars). | **Approved** |
| **Hybrid Navigation** | Use GPS to get to the "zone," then switch to local spatial coordinates for the hunt. | **Approved** |
| **Authored Content Only** | Fixed locations allow for higher narrative quality and better environmental mapping. | **Approved** |
| **Image Landmark Anchoring**| Adopted for Phase 2/3 Relocalization due to JS-bridge limitations for raw SLAM maps. | **Approved** |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: April 18, 2026 after Phase 4 completion*
