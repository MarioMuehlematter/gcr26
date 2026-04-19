---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to execute
last_updated: "2026-04-19T12:14:12.262Z"
progress:
  total_phases: 11
  completed_phases: 7
  total_plans: 24
  completed_plans: 21
  percent: 88
---

# Project State: Witcher Senses AR Engine

## Project Reference

**Core Value**: High-fidelity AR investigation layer with stable, offline-capable digital clues anchored precisely to the physical environment.
**Current Focus**: Phase 8 - Footstep Trails.

## Current Position

**Phase**: 8 - Footstep Trails
**Plan**: 01/03
**Status**: Ready
**Progress**: [░░░░░░░░░░] 0%

## Performance Metrics

- **Requirement Coverage**: 100% (13/13 v1 requirements mapped)
- **Phase Completion**: 7/11
- **Critical Path**: AR Foundation -> Site Recorder -> Clue Placement -> Player Loop

## Accumulated Context

### Decisions

- **Spatial Mapping over GPS**: Confirmed. GPS is for area arrival; SLAM is for clue hunting.
- **Offline-First**: Confirmed. Map and asset preloading is a core requirement for reliability.
- **ViroReact Stack**: Research suggests ViroReact for React Native AR performance.
- [Phase 1]: Used viroAppProps to pass tracking callbacks from ARScreen to MainScene to keep HUD and Scene in sync.
- [Phase 01-ar-engine-foundation]: Used ViroARPlane with onAnchorUpdated to dynamically scale the visualization quad to match the detected surface size.
- [Phase 02]: Use MMKV for metadata and Expo FileSystem for large binary maps (D-02-01-01)
- [Phase 02-02]: Implemented Map Service with binary utilities for local map persistence.
- [Phase 02]: Relocalization timeout set to 15 seconds as per D-05.
- [Phase 02]: Added LAST_MAP_ID tracking in mapService to facilitate debug testing.
- [Phase 03]: Implemented Admin Guard for Site Recorder navigation (D-05).
- [Phase 03]: Established 5-second locking requirement for World Origin (D-01).
- [Phase 03]: Defined Firestore `spatial_maps` collection for cloud persistence (D-03).
- [Phase 3]: Use 5-second Lock Duration
- [Phase 3]: Local Placeholder for Testing
- [Phase 03]: Used spatial_maps Firestore collection for world origin persistence (D-03).
- [Phase 04]: Clue Type Source of Truth: Clue types defined in a shared JSON file for consistency (D-04-01-01).
- [Phase 04]: D-04-02-01: Used ViroQuad with -90 rotation on X axis for ground-aligned decals.
- [Phase 04]: D-04-02-02: Implemented a 50-clue limit in useCluePlacement to mitigate performance threats (T-04-02).
- [Phase 04]: D-04-03-01: Marker-Relative Scene Hierarchy - Anchored clues as children of ViroARImageMarker for automatic relative transform handling.
- [Phase 04]: D-04-03-02: Real-time Raycasting - Used performARHitTestWithRay on every frame for low-latency ghost preview and snapping.
- [Phase 05]: D-01: Prerequisite Linking - Added requiredClueId field to Clue interface.
- [Phase 05]: D-03: Team-based Progression - Stored discoveredClueIds on Team document for shared narrative state.
- [Phase 05]: D-04: Atomic Discovery Updates - Used arrayUnion for race-condition-safe progression updates.
- [Phase 05-narrative-state-logic]: D-05-02-01: Use useInvestigation hook to abstract team-based discovery logic.
- [Phase 05-narrative-state-logic]: D-05-02-02: Visibility filtering in ARScreen based on prerequisite clue discovery.
- [Phase 05-narrative-state-logic]: D-05-02-03: Added onClick prop to ClueBillboard to support player interaction.
- [Phase 05-narrative-state-logic]: Integrated prerequisite selection UI into the AR placement workflow using a stacked bottom-tray layout.
- [Phase 6]: D-06-01-01: Use Medium haptic feedback for Witcher Senses activation.
- [Phase 6]: D-06-01-02: Implement highlight as an overlay material in ClueBillboard.
- [Phase 06]: D-06-02-01: Use pointerEvents="none" for visual overlay to avoid blocking AR scene interactions.
- [Phase 06]: D-06-02-02: Use hold-to-activate (onPressIn/Out) interaction for immersive hunting mode simulation.
- [Phase 6]: D-06-03-01: Hidden standard HUD/Debug controls when senses are active to maintain focus on investigation.
- [Phase 07-01]: D-07-01-01: Angle-based HUD Opacity - Auras become brighter (up to 0.8 opacity) as the player turns toward the target.
- [Phase 07-01]: D-07-01-02: SVG Gradients for Auras - Used react-native-svg for smooth directional indicators.
- [Phase 08]: D-08-01: Segmented Footprint Decals.
- [Phase 08]: D-08-02: Alternating Stride.
- [Phase 08]: D-08-03: Linear Interpolation (Lerp).
- [Phase 08]: D-08-04: Stride Frequency (0.6m).
- [Phase 08]: D-08-05: Path Segment Unlock (Discovery based).
- [Phase 08]: D-08-06: Proximity Fade (3m).

### Blockers

- None.

### Session Continuity

- **Last Action**: Planned Phase 8 - Footstep Trails.
- **Next Step**: Phase 8 - Plan 01 (Data Model & Pathing Logic).
