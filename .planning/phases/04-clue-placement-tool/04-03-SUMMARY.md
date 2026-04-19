---
phase: 04-clue-placement-tool
plan: 03
subsystem: Mobile AR
tags: [ar, placement, authoring, slam]
requires: [04-02]
provides: [placement-interface]
tech-stack: [ViroReact, Firestore, React Native]
key-files:
  - apps/mobile/src/screens/PlacementScreen.tsx
  - apps/mobile/src/components/MapSelectionModal.tsx
  - apps/mobile/src/components/ClueBillboard.tsx
  - apps/mobile/src/navigation/index.tsx
  - apps/mobile/src/screens/HomeScreen.tsx
---

# Phase 4 Plan 03: Placement Screen & Integration Summary

Assembled the full Clue Placement authoring tool. This implementation integrates the tray, billboards, stabilized recorder session, and relative coordinate placement logic into a new AR environment. GMs can now select a site, lock the physical origin, and precisely place digital clues with visual snap-to-plane feedback.

## Substantive Changes

### AR Placement Environment
- Created `PlacementScreen` with a dual-mode AR scene: Scanning (searching for landmark) and Authoring (placing clues).
- Integrated `useRecorderSession` for landmark stabilization and `useCluePlacement` for state management and cloud syncing.
- Implemented **Relative Math (D-03)** by anchoring all clues as children of the `ViroARImageMarker`, ensuring they remain stable relative to the physical world origin.

### HUD & Interaction
- Integrated `ClueTray` for asset selection.
- Implemented **Snap-to-Plane (Checker Issue 3)**: A real-time hit-test performs raycasting against detected planes, rendering a "ghost" clue with a green highlight at the target point.
- Added **Two-Finger Twist (D-02)**: GMs can rotate placed clues using standard mobile gestures.
- Added "Save All" functionality to batch-sync placed clues to Firestore.

### Navigation & UX
- Created `MapSelectionModal` to allow GMs to choose which site/map they want to author clues for.
- Registered the Placement screen in the navigation stack, guarded by admin permissions (T-04-03).
- Added entry points in `HomeScreen` for admins.

## Decisions Made

- **D-04-03-01: Marker-Relative Scene Hierarchy** - Ghost and placed clues are rendered as children of the `ViroARImageMarker` to leverage Viro's internal relative transform engine, simplifying coordinate math and improving stability.
- **D-04-03-02: Real-time Raycasting** - Used `performARHitTestWithRay` on every camera frame when a clue type is selected to provide low-latency "ghost" preview and surface snapping.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- **default_marker**: Uses the app icon (`icon.png`) as a tracking target for development. Real production markers will be substituted in the `ViroARTrackingTargets` config.

## Self-Check: PASSED

- [x] All tasks executed.
- [x] Each task committed individually.
- [x] npx tsc passes for apps/mobile.
- [x] SUMMARY.md created.
