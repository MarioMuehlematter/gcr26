# Domain Pitfalls: AR Investigation Games

**Domain:** AR Mobile Gaming / Location-Based Entertainment
**Researched:** October 26, 2023
**Confidence:** HIGH

## Critical Pitfalls

### 1. The "Drift" Disconnect
**What goes wrong:** Clues (footsteps, blood) slowly drift away from their physical anchor point as the session progresses.
**Why it happens:** IMU sensor accumulation error and lack of frequent visual relocalization.
**Consequences:** Players cannot follow a trail if the "start" of the trail has moved 2 meters while they were investigating the "end."
**Prevention:** Use **Spatial Mapping (LiDAR/SLAM)** with frequent relocalization against environmental features rather than raw GPS/IMU.
**Detection:** Implement a "Stability Metric" in the dev UI; if confidence drops, prompt the user to "Scan the room" again.

### 2. "Gorilla Arm" & Physical Fatigue
**What goes wrong:** Players stop playing after 10 minutes because holding a phone at eye level is exhausting.
**Why it happens:** AR requires constant upright device orientation.
**Consequences:** Low retention, players rushing through narrative content to put the phone down.
**Prevention:** 
- Design "Heads-Down" phases (Evidence Log, Map, Dialogue) that don't require AR.
- Place AR clues at "natural" heights (table level or floor) rather than forcing high-reaching interactions.

### 3. Lighting Inconsistency
**What goes wrong:** A "glowing" red bloodstain is invisible in bright sunlight or looks "pasted on" in a dark cellar.
**Why it happens:** Fixed-intensity shaders that don't account for real-world environmental lighting.
**Consequences:** Breaks immersion (the "uncanny valley" of AR).
**Prevention:** Use **AR Lighting Estimation** APIs to adjust the intensity and color temperature of digital highlights dynamically.

## Moderate Pitfalls

### 1. The "Needle in a Haystack" Problem
**What goes wrong:** Players walk around aimlessly because they can't find the first clue in a 10x10m area.
**Prevention:** Use "Directional Hotspots" (e.g., a pulsing arrow or spatial audio) that guide the player toward the general vicinity of a clue before requiring a precise search.

### 2. Safety & Situational Blindness
**What goes wrong:** Players trip over real objects or walk into dangerous areas (stairs, traffic) while looking at the "Witcher Sense" trail.
**Prevention:** Include clear "Look around you" warnings. Avoid placing clues near ledges or busy roads (geofencing filters).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Spatial Mapping** | Mapping fails in featureless environments (white walls). | Warn Game Masters to place clues near "textured" objects (rugs, posters). |
| **Offline Sync** | Initial map download fails in low-signal areas. | Require "Check-in" and map download *before* entering the investigation zone. |
| **Trail Rendering** | Too many decals (footprints) tank the frame rate. | Use object pooling for trail icons and limit the "visible window" of the trail. |

## Sources
- *Google ARCore Design Lab* Best Practices.
- *The Witcher: Monster Slayer* Community Feedback (Reddit/Discord archives).
- *ViroReact* Performance Optimization Documentation.
