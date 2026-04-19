---
phase: 02-spatial-serialization
plan: 03
subsystem: AR Engine
tags: [ar, serialization, relocalization, hook]
requires: [02-02]
provides: [relocalization-logic]
affects: [ar-session-lifecycle]
tech-stack: [React Native, Viro AR, MMKV]
key-files: [apps/mobile/src/hooks/useARSession.ts, apps/mobile/src/screens/ARScreen.tsx]
decisions:
  - Relocalization timeout set to 15 seconds as per D-05.
  - Added LAST_MAP_ID tracking in mapService to facilitate debug testing.
metrics:
  duration: 15m
  completed_date: 2025-02-14
---

# Phase 02 Plan 03: Relocalization Logic Integration Summary

Integrated map serialization and relocalization logic into the AR session lifecycle through the `useARSession` hook and `ARScreen` debug UI.

## Key Accomplishments

### 1. Extended `useARSession` Hook
- Added state management for relocalization (`relocalizing`, `relocalizationStatus`).
- Implemented `saveCurrentMap` and `loadMapAndRelocalize` methods.
- Integrated a 15-second relocalization timeout (Mitigation for T-02-04).
- Updated `onTrackingUpdated` to detect relocalization success when tracking becomes normal during an active relocalization attempt.

### 2. Debug UI in `ARScreen`
- Added "Save Map" and "Load Last Map" buttons to the AR HUD.
- The "Load Last Map" button uses the `LAST_MAP_ID` recorded during the last successful save.
- Added relocalization status indicators to the HUD for visual feedback.

### 3. Service Improvements
- Updated `mapService.saveMap` to automatically record the `LAST_MAP_ID` in storage, enabling easy "Load Last" functionality during development.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Functionality] Added `LAST_MAP_ID` tracking**
- **Found during:** Task 2 implementation.
- **Issue:** The plan required loading the "last saved ID", but `mapService` didn't explicitly track which ID was last.
- **Fix:** Modified `mapService.saveMap` to update `STORAGE_KEYS.LAST_MAP_ID`.
- **Commit:** 5955d34

## Known Stubs

| File | Line | Reason |
|------|------|--------|
| `apps/mobile/src/hooks/useARSession.ts` | 31 | Engine-level serialization call stubbed with placeholder data until Viro/ARKit specific serialization methods are finalized. |
| `apps/mobile/src/hooks/useARSession.ts` | 55 | Engine-level map loading call stubbed until exact Viro API for world map injection is confirmed. |

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| threat_flag: persistence | apps/mobile/src/services/mapService.ts | Local file system storage of spatial maps (Mitigated by encryption in MMKV metadata and app sandbox). |

## Self-Check: PASSED
- [x] `useARSession` manages relocalization state and timeout.
- [x] `ARScreen` HUD updated with debug buttons.
- [x] Commits made for both tasks.
