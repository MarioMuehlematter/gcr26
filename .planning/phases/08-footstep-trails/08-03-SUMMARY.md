---
phase: "08-footstep-trails"
plan: "03"
subsystem: "AR Engine / Investigation"
tags: ["integration", "footsteps", "pathing", "narrative"]
requires: ["08-02"]
provides: ["Investigation-integrated footstep trails"]
affects: ["ARScreen"]
tech-stack: ["React Native", "ViroReact"]
key-files: ["apps/mobile/src/hooks/useFootstepTrails.ts", "apps/mobile/src/screens/ARScreen.tsx"]
decisions:
  - "D-05: Trail segments only appear after their origin clue is discovered."
metrics:
  duration: "15m"
  completed_date: "2026-04-19"
---

# Phase 08 Plan 03: Investigation Integration Summary

Integrated footstep trail components into the main investigation loop, connecting narrative waypoints with visible paths that unlock dynamically based on player progress.

## One-liner
Investigation-integrated footstep trails that dynamically appear as players discover narrative waypoints.

## Key Changes

### `useFootstepTrails` Hook
- Implemented logic to group clues by `pathId`.
- Sorted clues by `pathSequence` to form ordered trail segments.
- Enforced visibility rules: a segment `(A -> B)` is only rendered if clue `A` has been discovered.
- Used `useMemo` to optimize filtering and grouping logic.

### `ARScreen` Integration
- Connected `useFootstepTrails` to the `ARScreen` state.
- Passed `activeSegments` and real-time `cameraPosition` down to `MainScene` via `viroAppProps`.
- Updated `MainScene` to render `FootstepTrail` components for all active segments.

## Deviations from Plan
None - plan executed exactly as written.

## Verification Results

### Automated Tests
- Verified `pathId` presence in `useFootstepTrails.ts`.
- Verified `FootstepTrail` and `useFootstepTrails` usage in `ARScreen.tsx`.

### Manual Verification Required
- Verify that trails appear only after discovering the preceding clue in a path.
- Verify that trails disappear when Witcher Senses are deactivated.
- Verify proximity fading of footprints as the player moves.

## Self-Check: PASSED
- [x] All tasks executed.
- [x] Commits made with proper format.
- [x] SUMMARY.md created.
- [x] STATE.md and ROADMAP.md updates pending (next steps).
