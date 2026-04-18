# Phase 7 Plan 01: Guidance Logic & HUD Foundation Summary

Implemented the core logic for identifying the "next" clue in the investigation sequence and provided the visual foundation for off-screen guidance via HUD auras.

## Sub substantive one-liner
Core guidance logic via `useClueGuidance` hook and visual direction indicators via `ClueGuidanceHUD` component.

## Tech Stack
- React Native
- React Native SVG (for gradients)
- Animated API

## Key Files
- `apps/mobile/src/hooks/useClueGuidance.ts`: Logic for identifying target clue and calculating relative distance/angle.
- `apps/mobile/src/components/ClueGuidanceHUD.tsx`: Visual directional indicators for off-screen clues.

## Decisions Made
- **D-07-01-01: Angle-based HUD Opacity** - Auras become brighter (up to 0.8 opacity) as the player turns toward the target (near 20 degrees off-center) and dimmer (0.1 opacity) when far away (120+ degrees).
- **D-07-01-02: SVG Gradients for Auras** - Used `react-native-svg` to create smooth gold/orange gradients for edge indicators, avoiding additional heavy dependencies.

## Deviations from Plan
- None - Plan executed as written.

## Known Stubs
- None.

## Metrics
- **Duration**: ~20 minutes
- **Completed Date**: April 18, 2026
- **Tasks**: 2/2

## Self-Check: PASSED
- [x] `useClueGuidance.ts` exists and implements sequence logic.
- [x] `ClueGuidanceHUD.tsx` exists and uses Animated SVG gradients.
- [x] Commits made for each task.
