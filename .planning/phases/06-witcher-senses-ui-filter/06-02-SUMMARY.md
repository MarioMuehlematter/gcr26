---
phase: 06-witcher-senses-ui-filter
plan: 02
subsystem: Mobile / AR Engine
tags: [witcher-senses, ui, overlay, animation]
requires: [06-01]
provides: [Interactive Witcher Senses UI]
affects: [apps/mobile/src/components/MedallionButton.tsx, apps/mobile/src/components/WitcherSenseOverlay.tsx]
tech-stack: [react-native, react-native-svg, Animated]
key-files: [apps/mobile/src/components/MedallionButton.tsx, apps/mobile/src/components/WitcherSenseOverlay.tsx]
decisions:
  - "D-06-02-01: Use pointerEvents=\"none\" for visual overlay to avoid blocking AR scene interactions."
  - "D-06-02-02: Use hold-to-activate (onPressIn/Out) interaction for immersive hunting mode simulation."
metrics:
  duration: 15m
  completed_date: "2026-04-18"
---

# Phase 06 Plan 02: Interactive Activation & Overlay Summary

The interactive components for triggering and visualizing the "Witcher Senses" mode have been implemented. This includes a medallion-style button for hold-to-activate interaction and a full-screen visual overlay that simulates the "hunting mode" look.

## Key Changes

### `MedallionButton` Component
- **Interaction**: Implements a "hold-to-activate" pattern using `onPressIn` and `onPressOut`.
- **Feedback**: Triggers a pulsing animation when active to provide visual confirmation.
- **Visuals**: Styled as a dark circular medallion with a red wolf-head silhouette and glowing yellow eyes (SVG).
- **Position**: Fixed at the bottom center of the screen for ergonomic one-thumb activation.

### `WitcherSenseOverlay` Component
- **Visual Effect**: Applies a desaturated, semi-transparent darkening filter (`rgba(50, 50, 50, 0.4)`) to the entire screen.
- **Vignette**: Simulates darker screen edges using layered absolute views with 25% black opacity.
- **Transition**: Uses a 300ms fade-in/out animation for smooth activation/deactivation.
- **Non-Blocking**: Configured with `pointerEvents="none"` to ensure the overlay doesn't intercept touch events intended for AR clues or the medallion button.

## Verification Results

### Automated Tests
- Verified `MedallionButton` triggers `onToggle` on press events.
- Verified `WitcherSenseOverlay` color matches the specification (`rgba(50, 50, 50, 0.4)`).
- Verified `pointerEvents="none"` property on the overlay.

### Manual Verification Required
- Check the "pulse" animation feel on a real device.
- Confirm the 300ms fade feels responsive yet immersive.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED
- [x] Files created/modified:
    - `apps/mobile/src/components/MedallionButton.tsx`
    - `apps/mobile/src/components/WitcherSenseOverlay.tsx`
- [x] Commits:
    - `7f78476`: feat(06-02): add MedallionButton component
    - `888270e`: feat(06-02): add WitcherSenseOverlay component
