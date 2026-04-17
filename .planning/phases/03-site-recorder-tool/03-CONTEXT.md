# Phase 3: Site Recorder Tool - Context

**Gathered:** April 17, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the mobile interface for Game Masters to "record" and map physical spaces (ADM-01). It leverages the Image Landmark Anchoring established in Phase 2 to create a "Site Origin." The GM will use this tool to scan a room, lock onto a landmark, and save the resulting spatial metadata to Firestore.

</domain>

<decisions>
## Implementation Decisions

### Authoring Workflow
- **D-01: Admin Origin Calibration** - The GM must point the camera at a physical landmark for 5 seconds to establish the world origin (0,0,0) before they can place any clues in future phases.
- **D-02: Visual Progress UI** - A circular progress ring will fill around the detected landmark to indicate "Locking origin...".

### Data Persistence (Cloud)
- **D-03: Firestore Map Documents** - Save site metadata to a root `spatial_maps` collection in Firestore. 
- **D-04: Relocalization Reference** - The Firestore document MUST include the `targetImageId` used for relocalization so players can be prompted to find the same landmark.

### Security & UX
- **D-05: Admin-Only Guard** - The Recorder tool will only be visible and accessible if `user.isAdmin` is true.
- **D-06: Site Naming** - GMs must provide a human-readable name for the site (e.g., "The Wine Cellar") before saving.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Core
- `.planning/PROJECT.md` - Decision on Image Landmark Anchoring.
- `.planning/research/ARCHITECTURE.md` - Recorder/Hunter pattern overview.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - ADM-01 requirement details.
- `.planning/ROADMAP.md` - Phase 3 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useAuth.ts` - For admin state verification.
- `apps/mobile/src/services/storage.ts` - MMKV reference.
- `apps/mobile/src/services/mapService.ts` - Local disk I/O to be extended with Cloud sync.

### Integration Points
- **Admin Tab** - A new tab or drawer item in the Mobile app specifically for Game Masters.

</code_context>

<specifics>
## Specific Ideas
- Use a "Witcher-style" scan visual (subtle chromatic aberration) when the landmark is detected to signal that the "magic" is working.

</specifics>

<deferred>
## Deferred Ideas
- **Image Upload** - Taking a custom photo and uploading to Firebase Storage as a landmark is deferred; v1 uses pre-defined marker keys.
- **Clue Placement** - The actual "dropping" of clues is deferred to Phase 4.

</deferred>

---
*Phase: 03-site-recorder-tool*
*Context gathered: April 17, 2026*
