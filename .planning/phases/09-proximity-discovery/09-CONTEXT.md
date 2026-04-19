# Phase 9: Proximity Discovery - Context

**Gathered:** April 19, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the range-based discovery and detail reveal mechanics (PLAY-04). It focuses on ensuring that players physically approach digital clues to unlock their narrative content. It includes the "3D Hover Label" system and the "Auto-Discovery" logic triggered by close proximity and field-of-view (FOV) focus.

</domain>

<decisions>
## Implementation Decisions

### Range Thresholds
- **D-01: Detail Reveal Range** - Clue labels (text/metadata) are only rendered when the player is within **3.0 meters** of the clue.
- **D-02: Auto-Discovery Range** - Clues are automatically marked as "discovered" (synced to Team state) if the player remains within **1.5 meters** and has the clue in their center FOV for **1.0 second**.

### Visual Feedback
- **D-03: 3D Hover Labels** - Use `ViroText` components that float 0.2m above the clue billboard to display lore/notes when in reveal range.
- **D-04: Transition Animation** - Clues scale up by 20% and shift from pulsing to static high-emissive when entering the discovery range.

### State & Interaction
- **D-05: Senses Requirement** - Auto-discovery only triggers if **Witcher Senses are active** (D-03 from Phase 6). This prevents accidental discovery while just walking.
- **D-06: Discovery Debounce** - Implement a 1-second focus timer (look-at-target) to ensure intentionality.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Discovery Patterns
- `apps/mobile/src/hooks/useInvestigation.ts` - The existing discovery sync logic.
- `apps/mobile/src/components/ClueBillboard.tsx` - Target for hover labels.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - PLAY-04 details.
- `.planning/ROADMAP.md` - Phase 9 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useClueGuidance.ts` - Already calculates real-time distance to clues.
- `apps/mobile/src/components/LockingProgressRing.tsx` - Reference for focus-timer animations (if used in HUD).

### Established Patterns
- **Coordinate Math** - Use the distance logic from Phase 7 to drive visibility.

### Integration Points
- **Discovery Hook** - Extension of `useInvestigation` or a specialized `useProximityDiscovery`.

</code_context>

<specifics>
## Specific Ideas
- When the 1-second auto-discovery timer starts, show a small "Scanning..." progress ring in the center of the HUD.

</specifics>

<deferred>
## Deferred Ideas
- **Audio Log Playback** - Playing voice notes on discovery is deferred to v2.
- **Complex UI Popups** - 2D overlay modals for clue text are deferred; focus on 3D hover text.

</deferred>

---
*Phase: 09-proximity-discovery*
*Context gathered: April 19, 2026*
