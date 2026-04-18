---
phase: 06-witcher-senses-ui-filter
plan: 01
subsystem: Mobile / AR Engine
tags: [witcher-senses, haptics, ar-ui, material]
requires: [PLAY-01]
provides: [Witcher Senses Foundation]
affects: [apps/mobile/src/hooks/useWitcherSenses.ts, apps/mobile/src/components/ClueBillboard.tsx]
tech-stack: [expo-haptics, ViroReact]
key-files: [apps/mobile/src/hooks/useWitcherSenses.ts, apps/mobile/src/components/ClueBillboard.tsx]
decisions:
  - "D-06-01-01: Use Medium haptic feedback for Witcher Senses activation for distinct tactile confirmation."
  - "D-06-01-02: Implement highlight as an overlay material in ClueBillboard to maintain base decal visibility."
metrics:
  duration: 10m
  completed_date: "2026-04-18"
---

# Phase 06 Plan 01: Foundation & Clue Highlights Summary

The foundation for the "Witcher Senses" investigation mode has been established. This includes a dedicated hook for state management and haptic feedback, and visual highlighting for clue decals in the AR scene.

## Key Changes

### `useWitcherSenses` Hook
- **State Management**: Provides an `active` boolean and `setEnabled` function.
- **Haptic Feedback**: Automatically triggers `Haptics.ImpactFeedbackStyle.Medium` when the senses are activated.
- **Detection Helper**: Includes `triggerDetectionHaptic` (Light impact) for future use when clues enter the field of view or are discovered.
- **Dependency**: Added `expo-haptics` to `@gcr26/mobile`.

### `ClueBillboard` Enhancements
- **New Prop**: Added `witcherSensesActive` to control highlighting.
- **Highlight Material**: Defined `witcher_sense_highlight` using an orange emissive-style Viro material.
- **Multi-Material Support**: The component now overlays the highlight material on top of the base clue texture when senses are active.

## Verification Results

### Automated Tests
- Verified `expo-haptics` in `package.json`.
- Verified `useWitcherSenses` hook exports and logic.
- Verified `witcher_sense_highlight` material and prop in `ClueBillboard`.

### Manual Verification Required
- None at this stage; functional integration occurs in Plan 06-02.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED
- [x] Files created/modified:
    - `apps/mobile/package.json`
    - `apps/mobile/src/hooks/useWitcherSenses.ts`
    - `apps/mobile/src/components/ClueBillboard.tsx`
- [x] Commits:
    - `d621f38`: feat(06-01): create useWitcherSenses hook and install expo-haptics
    - `abb36eb`: feat(06-01): add witcher_sense_highlight to ClueBillboard
