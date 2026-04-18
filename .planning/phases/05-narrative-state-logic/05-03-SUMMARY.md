# Phase 5 Plan 03: GM Narrative Sequencing Summary

## Overview
Provided the Game Master with the tools to define the narrative discovery chain during clue placement. GMs can now set a prerequisite for any clue, ensuring linear story progression in AR.

- **One-liner:** Integrated a prerequisite selection UI into the AR placement workflow, enabling linear narrative sequencing for AR clues.
- **Key changes:**
  - Updated `useCluePlacement` hook to manage prerequisite state and store `requiredClueId`.
  - Created `PrerequisitePicker` component for selecting from existing placed clues.
  - Integrated the picker into `PlacementScreen` and updated the HUD layout.
  - Modified `ClueTray` to support stacked layout in the GM tool.

## Technical Changes

### Mobile App
- **Hook: useCluePlacement** (`apps/mobile/src/hooks/useCluePlacement.ts`)
  - Added `selectedPrerequisiteId` state.
  - Updated `addClue` to accept `requiredClueId` and include it in the `Clue` object.
- **Component: PrerequisitePicker** (`apps/mobile/src/components/PrerequisitePicker.tsx`)
  - New horizontal scrollable picker showing existing clues.
  - Includes a "None" option to clear prerequisites.
  - Styled with blue accents to distinguish from the green clue type tray.
- **Screen: PlacementScreen** (`apps/mobile/src/screens/PlacementScreen.tsx`)
  - Integrated `PrerequisitePicker` into the bottom HUD.
  - Linked prerequisite state to the AR placement logic.
  - Implemented `bottomTrays` container for organized UI stacking.
- **Component: ClueTray** (`apps/mobile/src/components/ClueTray.tsx`)
  - Removed absolute positioning to allow it to be stacked inside the new container.

## Verification Results

### Automated Tests
- [x] `useCluePlacement.ts` contains `selectedPrerequisiteId` state and updated `addClue`.
- [x] `PrerequisitePicker.tsx` created and exports correctly.
- [x] `PlacementScreen.tsx` imports and renders `PrerequisitePicker`.
- [x] `mapService.ts` correctly persists all clue fields including `requiredClueId`.

### Manual Verification Steps (Internal)
1. Open Placement Tool.
2. Select a clue type (e.g., Bloodstain).
3. Select a prerequisite from the list (or "None").
4. Place the clue in AR.
5. Verify (via logs/inspection) that the new clue object contains the `requiredClueId`.
6. Save All and verify Firestore subcollection structure.

## Deviations
- **[Rule 3 - Blocking Issue] UI Stacking:** `ClueTray` was originally absolutely positioned, which made it difficult to stack with the new `PrerequisitePicker`. I modified `ClueTray` to remove its internal absolute positioning and instead wrapped both components in a `bottomTrays` container in `PlacementScreen.tsx`.

## Known Stubs
- None.

## Self-Check: PASSED
- [x] All tasks executed.
- [x] Each task committed individually.
- [x] `requiredClueId` persisted in Firestore.
- [x] SUMMARY.md created.
- [x] STATE.md updated.
