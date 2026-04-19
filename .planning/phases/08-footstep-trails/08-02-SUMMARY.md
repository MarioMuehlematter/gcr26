---
phase: 8
plan: 08-02
subsystem: AR Components
tags: ["AR", "Witcher Senses", "Footsteps"]
requirements: ["PLAY-03"]
tech-stack: ["React Native", "ViroReact"]
key-files:
  - "apps/mobile/src/components/FootstepBillboard.tsx"
  - "apps/mobile/src/components/FootstepTrail.tsx"
decisions:
  - "D-06: Implemented 3m radius proximity fade for footprints."
  - "T-08-02-01: Used useMemo for path generation to optimize AR performance."
metrics:
  duration: "15m"
  completed_date: "2026-04-19"
---

# Phase 8 Plan 02: Footstep AR Components Summary

## Objective
Implement the AR components responsible for rendering individual footprints and trail segments with proximity-based visibility and Witcher Sense styling.

## Key Changes
### Individual Footprint Rendering (`FootstepBillboard.tsx`)
- Created a `ViroQuad` based component that renders footprints flat on the ground.
- Implemented **Proximity Fade** (D-06): Footprints smoothly fade out as the player moves beyond a 3-meter radius.
- Integrated **Witcher Sense Highlight**: Footprints use the `witcher_sense_highlight` material overlay when senses are active.
- Visibility logic: Footprints are only rendered when Witcher Senses are active and they are within the visibility range.

### Trail Orchestration (`FootstepTrail.tsx`)
- Created a component to manage the sequence of footprints between two investigation waypoints.
- Used `useMemo` to prevent expensive pathing logic recalculations on every AR frame update (T-08-02-01).
- Calculates real-time distance between the player (camera) and each footprint to drive the individual fade effects.

## Verification Results
- `FootstepBillboard` includes `witcher_sense_highlight`.
- `FootstepTrail` correctly calls `generateFootprints` and maps over the results.
- Code conforms to AR performance patterns (memoization, early returns).

## Deviations
None - plan executed exactly as written.

## Self-Check: PASSED
- [x] `FootstepBillboard.tsx` exists and implements proximity fade.
- [x] `FootstepTrail.tsx` exists and orchestrates footprint sequences.
- [x] Commits made for each component.
