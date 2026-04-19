---
phase: 09-proximity-discovery
plan: 01
subsystem: mobile-logic
tags: [logic, discovery, ar]
requirements: [PLAY-04]
tech-stack: [react, typescript]
key-files: [apps/mobile/src/hooks/useProximityDiscovery.ts]
decisions:
  - useClueGuidance integration for distance/angle logic
  - 1-second focus timer with 100ms update frequency
  - Ref-based debouncing to prevent multiple discovery calls
metrics:
  duration: 600
  completed_date: "2026-04-19"
---

# Phase 09 Plan 01: Proximity Discovery Logic Summary

Implemented the core proximity discovery engine that tracks player focus on investigation targets and manages the auto-discovery timer.

## Key Changes

### `apps/mobile/src/hooks/useProximityDiscovery.ts`
- Created a new hook that consumes `useClueGuidance`, `useInvestigation`, and `useWitcherSenses` (externally provided).
- Implemented `isFocused` logic: distance <= 1.5m and angle <= 15 degrees.
- Implemented a 1000ms progress timer that resets when focus is lost.
- Wired the 100% progress state to `discoverClue` with a single-shot trigger mechanism.

## Deviations from Plan

- **Witcher Senses State**: Instead of calling `useWitcherSenses()` inside the hook (which would create a new local state), I designed the hook to take `witcherSensesActive` as an argument. This ensures it uses the actual state managed by the AR screen/HUD.

## Verification Results

### Automated Tests
- N/A (Project does not have automated test suite for hooks yet)

### Manual Verification
- Verified hook structure and logic flow in `apps/mobile/src/hooks/useProximityDiscovery.ts`.
- Confirmed threshold constants (1.5m, 15deg) match requirements.
- Confirmed use of `useEffect` for the discovery trigger.

## Self-Check: PASSED

- [x] All tasks executed
- [x] Each task committed individually
- [x] Deviations documented
- [x] SUMMARY.md created
- [x] STATE.md updated
