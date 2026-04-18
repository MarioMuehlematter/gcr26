# Phase 6: Witcher Senses UI & Filter - Context

**Gathered:** April 18, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the signature "Witcher Sense" visual style (PLAY-01). It focuses on the player-facing UI for activating hunting mode, the visual desaturation of the AR environment, and the high-contrast highlighting of digital clues.

</domain>

<decisions>
## Implementation Decisions

### Visual Filter
- **D-01: Grayscale Overlay** - Use a semi-transparent (`rgba(50, 50, 50, 0.4)`) overlay with a grayscale effect on the 2D View layer to simulate desaturation. This avoids complex native post-processing shaders for v1.
- **D-02: Emissive Clue Highlight** - Update `ClueBillboard` to use a dedicated "WitcherSense" material with high emissive power (`bloom`-like) when senses are active.

### Interaction
- **D-03: Hold-to-Sense Activation** - A prominent "Witcher Medallion" button at the bottom of the screen. Players must HOLD this button to keep senses active (mimicking the game's focus).
- **D-04: Haptic Feedback** - Trigger a subtle pulse haptic when senses are activated and when a new clue is detected in the field of view.

### UI / HUD
- **D-05: Hunting HUD** - When active, hide standard GPS/Map navigation. Show only the "Active Senses" status and a vignetted screen edge.
- **D-06: Discovery Notification** - A small, non-intrusive notification overlay that appears when the team's `discoveredClueIds` updates.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Aesthetics
- `.planning/research/FEATURES.md` - Witcher 3 UX analysis and visual expectations.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - PLAY-01 details.
- `.planning/ROADMAP.md` - Phase 6 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/screens/ARScreen.tsx` - The primary canvas for this phase.
- `apps/mobile/src/components/ClueBillboard.tsx` - To be updated with highlight logic.

### Established Patterns
- **Animated Components** - Use `Animated` from React Native for the progress ring and medallion pulse.

### Integration Points
- **Senses State** - A local boolean state in `ARScreen` or a new `useWitcherSenses` hook.

</code_context>

<specifics>
## Specific Ideas
- The grayscale effect should "fade in" over 300ms when the button is pressed.

</specifics>

<deferred>
## Deferred Ideas
- **Chromatic Aberration** - Lens distortion effects are deferred to Phase 12 (Polish).
- **Audio Processing** - Muffling real-world sounds is deferred.

</deferred>

---
*Phase: 06-witcher-senses-ui-filter*
*Context gathered: April 18, 2026*
