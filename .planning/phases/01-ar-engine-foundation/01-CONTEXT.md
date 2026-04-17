# Phase 1: AR Engine Foundation - Context

**Gathered:** April 17, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the fundamental AR environment for the mobile app. It focuses on initializing the AR camera, establishing stable SLAM tracking, and implementing plane detection (CORE-02) as the foundation for all future investigation mechanics.

</domain>

<decisions>
## Implementation Decisions

### Tracking & Stability
- **D-01: JSI-based SLAM Tracking** - Use ViroReact's high-performance JSI tracking to minimize latency between physical movement and digital overlay.
- **D-02: World Origin Stability** - Establish a "Stable Anchor" at the world origin (0,0,0) upon session start to serve as a baseline for drift detection.

### Environment Awareness
- **D-03: Dot-Grid Plane Visualization** - Display a subtle dot-grid overlay on detected horizontal and vertical planes to give users feedback on mapping progress.
- **D-04: Multi-Surface Support** - Enable detection for both floors (for footprints) and walls (for bloodstains/marks).

### Integration
- **D-05: Expo Development Client** - Use a custom Expo Development Build to support ViroReact's native modules without ejecting from the Expo managed workflow.
- **D-06: Hybrid Origin Pattern** - Combine GPS (for initial arrival) with local SLAM coordinates for investigation start.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AR Core Documentation
- `.planning/research/STACK.md` - Recommended AR stack and versions.
- `.planning/research/PITFALLS.md` - Tracking drift and IMU error prevention.

### Requirements & Roadmap
- `.planning/PROJECT.md` - Core value and hybrid positioning decision.
- `.planning/REQUIREMENTS.md` - CORE-02 requirement details.
- `.planning/ROADMAP.md` - Phase 1 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/firebase.ts` - For future state sync.
- `apps/mobile/src/tasks/locationTask.ts` - Reference for background task structure (GPS component).

### Established Patterns
- **Expo Config Plugins** - Used for existing native modules; will be needed for ViroReact setup.

### Integration Points
- **AR Screen** - A new screen in `apps/mobile/src/screens/` for the AR viewfinder.

</code_context>

<specifics>
## Specific Ideas
- The plane detection visuals should feel like the "Witcher Sense" scan—subtle, high-contrast, and immersive.

</specifics>

<deferred>
## Deferred Ideas
- **Spatial Serialization** - Saving maps to disk is deferred to Phase 2.
- **Clue Rendering** - Placing specific clue decals is deferred to Phase 4.

</deferred>

---
*Phase: 01-ar-engine-foundation*
*Context gathered: April 17, 2026*
