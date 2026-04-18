---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to plan
last_updated: "2026-04-18T23:52:24.610Z"
progress:
  total_phases: 11
  completed_phases: 7
  total_plans: 21
  completed_plans: 21
  percent: 100
---

# Project State: Witcher Senses AR Engine

## Project Reference

**Core Value**: High-fidelity AR investigation layer with stable, offline-capable digital clues anchored precisely to the physical environment.
**Current Focus**: Phase 7 - Clue Guidance (Pulse/Glow).

## Current Position

**Phase**: 7 - Clue Guidance (Pulse/Glow)
**Plan**: 01/02
**Status**: In Progress
**Progress**: [█████░░░░░] 50%

## Performance Metrics

- **Requirement Coverage**: 100% (13/13 v1 requirements mapped)
- **Phase Completion**: 6/11
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

### Blockers

- None.

### Session Continuity

- **Last Action**: Completed Phase 6 - Plan 02 (Interactive Activation & Overlay).
- **Next Step**: Phase 6 - Plan 03 (System Integration).
