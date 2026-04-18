# Phase 7: Clue Guidance (Pulse/Glow) - Context

**Gathered:** April 18, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the visual guidance system for clue hunting (PLAY-02). It focuses on making undiscovered clues "pulse" or "glow" to catch the player's eye and provides directional indicators for clues outside the current field of view.

</domain>

<decisions>
## Implementation Decisions

### Visual Effects
- **D-01: Sinusoidal Glow Pulse** - Use `ViroAnimations` to animate the clue's material opacity or emissive intensity in a slow sinusoidal loop (e.g., 2.0s duration) when Witcher Senses are active.
- **D-02: Target Highlight Color** - Use a distinct "Pulse" color (e.g., Bright Orange/Yellow) for the next narrative clue to differentiate it from already found evidence.

### Guidance Logic
- **D-03: Distance-based Pulse** - Clues pulse only if they are within a 15-meter radius and undiscovered.
- **D-04: Off-Screen Indicators** - Render subtle "Aura" gradients at the edges of the HUD when the next clue is not in the camera's FOV.

### Sequencing Integration
- **D-05: Focus on Next Clue** - Only the immediate next clue in the linear sequence (defined in Phase 5) will provide guidance pulses. This prevents "clue clutter."

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AR Visuals
- `.planning/research/FEATURES.md` - Visual guidance and "glow" expectations.
- `apps/mobile/src/components/ClueBillboard.tsx` - Target component for guidance.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - PLAY-02 details.
- `.planning/ROADMAP.md` - Phase 7 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useWitcherSenses.ts` - To provide the active state.
- `apps/mobile/src/hooks/useInvestigation.ts` - To provide clue sequence data.

### Established Patterns
- **ViroAnimations** - Reference Viro documentation for defining and triggering animations.

### Integration Points
- **Clue Guidance Component** - Potential new component or extension to `ClueBillboard`.

</code_context>

<specifics>
## Specific Ideas
- The edge aura should get stronger/brighter as the player turns toward the target clue.

</specifics>

<deferred>
## Deferred Ideas
- **Audio Guidance** - Directional "whispers" or "humming" is deferred.
- **Minimap Guidance** - Showing clues on the 2D map is deferred.

</deferred>

---
*Phase: 07-clue-guidance-pulse-glow*
*Context gathered: April 18, 2026*
