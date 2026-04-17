# Phase 4: Clue Placement Tool - Context

**Gathered:** April 17, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the AR interface for Game Masters to "drop" digital clues into the physical world (ADM-02). It focuses on cm-level anchoring (CORE-01) by calculating coordinates relative to the Image Landmark established in Phase 3. GMs will be able to select assets, place them on planes, and save their relative transforms to Firestore.

</domain>

<decisions>
## Implementation Decisions

### Interaction
- **D-01: Tap-to-Place** - GMs place clues by tapping on a detected AR plane. The engine will perform a hit-test to find the exact 3D coordinate.
- **D-02: Gizmo-less Rotation** - Use a two-finger twist gesture to rotate placed clues (simpler for mobile than a 3D gizmo).

### Spatial Data
- **D-03: Relative Transform Pattern** - All clue positions [x, y, z] and rotations [rx, ry, rz] are stored as offsets from the Image Landmark's origin (0,0,0).
- **D-04: Precise SLAM Anchoring** - Use Viro's `ViroARAnchor` logic to ensure clues "stick" to the plane and don't float during placement.

### Asset Library
- **D-05: JSON-defined Clue Types** - The list of available clues (Footprint, Bloodstain, Scuff mark) is defined in a shared JSON config.
- **D-06: v1 Asset Set** - Focus on 2D decals (billboards) for footprints and stains to ensure high performance and easy alignment.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AR Placement
- `.planning/research/FEATURES.md` - Precise SLAM anchoring requirements.
- `.planning/research/PITFALLS.md` - Managing drift during placement.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - ADM-02 and CORE-01 details.
- `.planning/ROADMAP.md` - Phase 4 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/screens/RecorderScreen.tsx` - To be extended with placement UI.
- `apps/mobile/src/services/mapService.ts` - To be extended with clue-saving logic.

### Established Patterns
- **Material Creation** - Use `ViroMaterials.createMaterials` pattern from Phase 1.

### Integration Points
- **Clue State** - A subcollection or array in the `spatial_maps` document in Firestore.

</code_context>

<specifics>
## Specific Ideas
- Clues should "snap" to detected planes with a subtle green highlight.

</specifics>

<deferred>
## Deferred Ideas
- **Custom 3D Models** - GMs uploading their own models is deferred.
- **Occlusion** - Clues hiding behind real objects is deferred to v2.

</deferred>

---
*Phase: 04-clue-placement-tool*
*Context gathered: April 17, 2026*
