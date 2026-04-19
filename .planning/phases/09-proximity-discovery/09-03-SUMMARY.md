---
phase: 09-proximity-discovery
plan: 09-03
subsystem: mobile
tags: [ar, ui, gameplay]
requires: [PLAY-04]
provides: [proximity-discovery-integration]
affects: [ARScreen, HuntingHUD, ClueBillboard]
tech-stack: [React Native, ViroReact]
key-files: [apps/mobile/src/screens/ARScreen.tsx, apps/mobile/src/components/HuntingHUD.tsx, apps/mobile/src/components/ClueBillboard.tsx]
decisions:
  - Integration of useProximityDiscovery into ARScreen for automatic clue discovery.
  - Visual feedback for scanning progress in both HUD (ScanningProgress) and AR Scene (ClueBillboard opacity/pulse).
metrics:
  duration: 20m
  completed_date: "2026-04-19"
---

# Phase 09 Plan 03: Wire discovery logic and visuals Summary

Finalized the proximity discovery feature by integrating the logic and visuals into the main player experience. This completes the gameplay loop for finding and analyzing clues using Witcher Senses.

## Key Changes

### Mobile App

#### HUD Integration (`HuntingHUD.tsx`)
- Updated `HuntingHUD` to accept `discoveryProgress` and `isScanning` props.
- Integrated `ScanningProgress` component to render the central scanning ring when the player is focusing on a clue.
- Adjusted layout to center the progress ring while keeping the status badge in the top right.

#### AR Scene Integration (`ARScreen.tsx`)
- Initialized `useProximityDiscovery` hook in `ARScreen` to track focus and proximity.
- Passed discovery state through `viroAppProps` to `MainScene` and then to `ClueBillboard`.
- Wired the discovery progress and scanning state to the `HuntingHUD` overlay.

#### Visual Feedback (`ClueBillboard.tsx`)
- Added `discoveryProgress` prop to `ClueBillboard`.
- Enhanced visual feedback during scanning:
  - Forced `pulse_faster` animation when actively scanning.
  - Added dynamic opacity reduction (dimming) to the clue decal while being analyzed to create better contrast with the HUD progress ring.

## Verification Results

### Automated Tests
- Verified `ARScreen` correctly initializes and uses `useProximityDiscovery`.
- Verified `HuntingHUD` conditionally renders `ScanningProgress`.
- Verified `ClueBillboard` handles the new `discoveryProgress` prop for visual feedback.

### Success Criteria
- [x] Discovery progress ring appears in HUD when 1.5m away and in FOV.
- [x] Clue Billboard labels appear at 3m (verified pre-existing logic).
- [x] Team discovery state is updated when the 1s focus completes via `useProximityDiscovery` hook.

## Deviations from Plan
- **Enhanced Visuals**: Added dynamic opacity to `ClueBillboard` during scanning to improve UX, which was not explicitly in the plan but follows the "visual feedback" goal.

## Self-Check: PASSED
- [x] Created/Modified files exist.
- [x] Commits made with proper format.
- [x] All tasks completed.
