# Phase 5: Narrative State Logic - Context

**Gathered:** April 17, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase connects the clues placed in Phase 4 to the overarching game progression (ADM-03). It focuses on implementing a linear discovery sequence, where certain clues remain invisible until prerequisite evidence is found. It also handles the synchronization of discovery state between the mobile client and Firestore.

</domain>

<decisions>
## Implementation Decisions

### Schema & Logic
- **D-01: Prerequisite Linking** - Each clue in Firestore will have an optional `requiredClueId` field.
- **D-02: Visibility Filtering** - The client-side AR logic will filter the list of clues based on the player's current progression state: `visible = !clue.requiredClueId || discoveredClueIds.includes(clue.requiredClueId)`.

### State Synchronization
- **D-03: Team-based Progression** - Store `discoveredClueIds` on the `Team` document in Firestore to ensure all team members share the same narrative state.
- **D-04: Atomic Discovery Updates** - Use Firestore's `arrayUnion` to add clue IDs to the discovered list, preventing race conditions between team members.

### Admin Tooling
- **D-05: Sequencing UI** - Update the `PlacementScreen` to allow GMs to pick a "Prerequisite Clue" from the list of already placed clues.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Structures
- `packages/shared/src/types.ts` - Core Team and Clue interfaces.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - ADM-03 requirement details.
- `.planning/ROADMAP.md` - Phase 5 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useCluePlacement.ts` - To be extended with visibility filtering.
- `apps/mobile/src/services/mapService.ts` - To be extended with discovery sync logic.

### Established Patterns
- **Firestore Array Ops** - Follow patterns in `QuestsPage.jsx` for updating team scores/progress.

### Integration Points
- **Discovery Trigger** - A new method in `useARSession` or a new `useInvestigation` hook to fire "Discovery" events.

</code_context>

<specifics>
## Specific Ideas
- When a clue becomes visible (prerequisite met), it should trigger a subtle "Discovery Pulse" in the HUD (Phase 7 hint).

</specifics>

<deferred>
## Deferred Ideas
- **Branching Narratives** - Non-linear or complex branching state is deferred; v1 is strictly linear or single-prerequisite.
- **Player UI Feedback** - The "Witcher Sense" visual feedback for discovery is deferred to Phase 6/7.

</deferred>

---
*Phase: 05-narrative-state-logic*
*Context gathered: April 17, 2026*
