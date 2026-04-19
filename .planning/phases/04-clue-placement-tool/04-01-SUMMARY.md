---
phase: 04-clue-placement-tool
plan: 01
subsystem: AR Engine
tags: [clues, firestore, types, assets]
requires: [03-03]
provides: [clue-persistence, clue-config]
affects: [apps/mobile, packages/shared]
tech-stack: [firestore, typescript, expo]
key-files: [packages/shared/src/clues.json, packages/shared/src/types.ts, apps/mobile/src/services/mapService.ts]
decisions:
  - id: D-04-01-01
    name: Clue Type Source of Truth
    description: Clue types are defined in a shared JSON file to ensure consistency between the mobile app (for UI/Rendering) and potential future admin tools.
    rationale: Centralized configuration simplifies adding new clue types without modifying code in multiple places.
metrics:
  duration: 25m
  tasks: 3
  files: 6
---

# Phase 04 Plan 01: Data & Services Foundation Summary

## Objective
Establish the data models, asset library, and persistence layer for AR clues. This foundation ensures that clue types are configurable and clues placed in AR can be serialized and saved to the cloud relative to a physical site map.

## Key Accomplishments
- **Centralized Clue Configuration:** Created `clues.json` in the shared package to define available clue types (footprint, bloodstain, scuff).
- **Strongly Typed Clues:** Updated shared types to include `Clue` and `ClueType` interfaces, with `ClueType` automatically derived from the JSON configuration.
- **Clue Persistence Layer:** Extended `mapService.ts` with methods to synchronize clues to Firestore subcollections, retrieve clues for a specific map, and list available cloud maps.
- **Visual Foundation:** Prepared the mobile app with placeholder assets for all configured clue types.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed missing clueCount in mapService.ts**
- **Found during:** Task 3 verification (TSC)
- **Issue:** `SpatialMapMetadata` was updated to require `clueCount`, but existing code in `saveMap` was not initializing it.
- **Fix:** Added `clueCount: 0` initialization to the `saveMap` function.
- **Files modified:** `apps/mobile/src/services/mapService.ts`
- **Commit:** a26250b

## Verification Results

### Automated Tests
- **Shared Types:** Verified by mobile app compilation.
- **Mobile App:** `npx tsc -p apps/mobile/tsconfig.json` passed successfully.
- **Assets:** Verified existence of `footprint.png`, `bloodstain.png`, and `scuff.png` in `apps/mobile/assets/clues/`.

## Self-Check: PASSED
- [x] Clue types defined in JSON
- [x] Shared types updated and compiling
- [x] Placeholder assets created
- [x] mapService.ts updated with sync and retrieval methods
- [x] All changes committed with proper task-level descriptions
