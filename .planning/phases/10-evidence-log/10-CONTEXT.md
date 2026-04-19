# Phase 10: Evidence Log - Context

**Gathered:** April 19, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the 2D Evidence Log (PLAY-05), allowing players to review all clues discovered by their team. It provides a "heads-down" interface that mitigates "Gorilla Arm" fatigue by allowing narrative review without holding the device in an AR pose.

</domain>

<decisions>
## Implementation Decisions

### Interface
- **D-01: Journal Access** - A "Journal" (Book icon) button in the top-left corner of the `ARScreen`.
- **D-02: Modal Review View** - The log opens as a full-screen, semi-transparent 2D modal, blurring the AR background to focus the player on the text.
- **D-03: Chronological Sorting** - Clues are listed in reverse chronological order (most recently discovered at the top).

### Content
- **D-04: Evidence Cards** - Each log entry shows the Clue Type icon, Name, and "Time Found".
- **D-05: Detailed Lore** - Selecting an entry expands it to show the full narrative text (Lore) provided by the Game Master.

### Interaction
- **D-06: Automatic Refresh** - The log uses real-time Firestore listeners (via `useTeamState`) to ensure new discoveries appear instantly if a teammate finds something.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Structure
- `packages/shared/src/types.ts` - Clue and Team interfaces.
- `apps/mobile/src/hooks/useTeamState.ts` - Source of discovery data.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - PLAY-05 details.
- `.planning/ROADMAP.md` - Phase 10 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/components/SiteNamingModal.tsx` - Reference for full-screen modal pattern.
- `apps/mobile/src/hooks/useInvestigation.ts` - For metadata retrieval.

### Established Patterns
- **Standard 2D UI** - Use standard React Native `FlatList` for the evidence entries.

### Integration Points
- **Evidence Screen/Modal** - A new component `EvidenceLogModal.tsx`.

</code_context>

<specifics>
## Specific Ideas
- Use a parchment-style background or "dark investigator" theme to maintain immersion even in 2D.

</specifics>

<deferred>
## Deferred Ideas
- **Photo Evidence** - Attaching actual camera photos to log entries is deferred to v2.
- **Search/Filter** - Filtering the log by type or location is deferred.

</deferred>

---
*Phase: 10-evidence-log*
*Context gathered: April 19, 2026*
