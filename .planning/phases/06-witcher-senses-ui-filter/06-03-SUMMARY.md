---
phase: 06-witcher-senses-ui-filter
plan: 03
subsystem: Mobile App
tags: [ar, ui, witcher-senses, integration]
requirements: [PLAY-01]
tech-stack: [React Native, ViroReact, Expo Haptics]
key-files: [apps/mobile/src/screens/ARScreen.tsx, apps/mobile/src/components/HuntingHUD.tsx, apps/mobile/src/components/DiscoveryNotification.tsx]
decisions:
  - D-06-03-01: Hidden standard HUD/Debug controls when senses are active to maintain focus on investigation.
metrics:
  duration: 20m
  completed_date: "2026-04-18"
---

# Phase 6 Plan 03: HUD & Integration Summary

Finalized the Witcher Senses feature by integrating the specialized HUD, discovery notifications, and visual filters into the main AR investigation experience.

## Key Accomplishments

- **Hunting HUD**: Created a specialized indicator that appears when Witcher Senses are active, reinforcing the "hunting mode" state.
- **Discovery Notifications**: Implemented a top-sliding notification system that alerts players when a teammate discovers a new clue, providing real-time feedback on team progress.
- **Full Integration**:
    - Wired `useWitcherSenses` into `ARScreen`.
    - Integrated `MedallionButton` for hold-to-activate interaction.
    - Integrated `WitcherSenseOverlay` for the visual desaturation/vignette filter.
    - Synchronized `witcherSensesActive` state with `MainScene` and `ClueBillboard` for orange glow highlights on clues.
- **Detection Haptics**: Implemented a subtle haptic pulse (Light) that triggers specifically when a new clue is added to the discovered list while the player is actively using Witcher Senses.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- [x] `HuntingHUD` created and displays correct label.
- [x] `DiscoveryNotification` created and monitors `discoveredClueIds`.
- [x] `ARScreen` integrates all Witcher Senses components.
- [x] Haptic detection pulse implemented.
- [x] Standard HUD hides when senses are active.
