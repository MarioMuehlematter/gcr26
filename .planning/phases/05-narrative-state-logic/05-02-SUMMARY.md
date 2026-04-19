---
phase: 05-narrative-state-logic
plan: 02
subsystem: Mobile AR / Narrative
tags: [investigation, ar, discovery, visibility]
requires: [05-01]
provides: [clue-discovery-loop]
affects: [ARScreen, useCluePlacement, useInvestigation]
tech-stack: [React Native, ViroReact, Firestore]
key-files: [apps/mobile/src/hooks/useInvestigation.ts, apps/mobile/src/screens/ARScreen.tsx, apps/mobile/src/components/ClueBillboard.tsx]
decisions:
  - D-05-02-01: Use useInvestigation hook to abstract team-based discovery logic.
  - D-05-02-02: Visibility filtering in ARScreen based on prerequisite clue discovery.
  - D-05-02-03: Added onClick prop to ClueBillboard to support player interaction.
metrics:
  duration: 15m
  completed_date: 2026-04-18
---

# Phase 5 Plan 02: Player Investigation Loop Summary

## One-liner
Implemented the player-side investigation loop, enabling narrative-linked clue visibility and discovery triggers in the AR environment.

## Key Accomplishments

- **useInvestigation Hook**: Created a new hook to handle clue discovery events, integrating with `useUser` and `mapService` to update team progression in Firestore.
- **Narrative Visibility Logic**: Integrated visibility filtering in `ARScreen` where clues are only rendered if their prerequisites have been discovered by the team.
- **Interactive Clues**: Updated `ClueBillboard` and `ARScreen` to support click interactions, allowing players to discover clues by tapping them in AR.
- **Team Sync**: Leveraged `useTeamState` to ensure real-time synchronization of discovery progress across all team members.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: tampering | apps/mobile/src/hooks/useInvestigation.ts | Discovery trigger currently lacks proximity checks (planned for Phase 9), allowing discovery from any distance if the object is clickable. |

## Self-Check: PASSED
- [x] `useInvestigation.ts` created and functional.
- [x] `ClueBillboard.tsx` updated with `onClick`.
- [x] `ARScreen.tsx` updated with visibility and discovery logic.
- [x] Commits made for each task.
- [x] STATE.md and ROADMAP.md updated.
