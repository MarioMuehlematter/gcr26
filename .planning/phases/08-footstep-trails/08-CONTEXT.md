# Phase 8: Footstep Trails - Context

**Gathered:** April 18, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the grounded narrative pathing system (PLAY-03). It focuses on connecting investigation points with a trail of individual footprints that guide the player through the physical space. It includes the logic for interpolating between waypoints and managing trail visibility based on progression.

</domain>

<decisions>
## Implementation Decisions

### Rendering & Style
- **D-01: Segmented Footprint Decals** - Use individual 2D billboards (left/right foot alternation) instead of a continuous ribbon. This matches the "Witcher Sense" aesthetic and is more performant.
- **D-02: Alternating Stride** - The interpolation logic must alternate between "footprint_left" and "footprint_right" assets along the path.

### Pathing Logic
- **D-03: Linear Interpolation (Lerp)** - Automatically generate intermediate "Ghost Footprints" between two GM-placed clues that share the same `pathId`.
- **D-04: Stride Frequency** - Generate one footprint every 0.6 meters along the linear path between waypoints.

### Discovery & Visibility
- **D-05: Path Segment Unlock** - A trail segment between Clue A and Clue B only becomes visible once Clue A has been "discovered" by the team.
- **D-06: Proximity Fade** - Footprints should have a 3-meter visibility radius; they fade out as the player moves away to keep the AR view clean.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Assets & Patterns
- `packages/shared/src/clues.json` - Definitions for footprint assets.
- `apps/mobile/src/components/ClueBillboard.tsx` - Reference for decal rendering.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - PLAY-03 details.
- `.planning/ROADMAP.md` - Phase 8 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useInvestigation.ts` - To be extended with trail interpolation logic.
- `apps/mobile/src/services/mapService.ts` - To be updated with `pathId` support.

### Established Patterns
- **Material Highlighting** - Use the "Witcher Sense" highlight pattern from Phase 6 for the footprints.

### Integration Points
- **Trail Component** - A new `FootstepTrail.tsx` component that renders a collection of footprints.

</code_context>

<specifics>
## Specific Ideas
- The stride should have a slight "wobble" (random offset of 5-10cm) to look more natural and less like a perfect straight line.

</specifics>

<deferred>
## Deferred Ideas
- **Dynamic Obstacle Avoidance** - Trails curving around real objects (requires Meshing) is deferred to v2.
- **Scent Clouds** - Particle-based trails are deferred to Phase 12.

</deferred>

---
*Phase: 08-footstep-trails*
*Context gathered: April 18, 2026*
