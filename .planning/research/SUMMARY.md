# Research Summary: Witcher Senses AR Engine

## Executive Summary
The Witcher Senses AR Engine (gcr26) is a high-fidelity spatial investigation tool built for the Ludvia platform. It enables the creation of "digital hunts" where clues (footprints, scent trails, objects) are anchored with centimeter-level precision in the physical world. Unlike generic GPS games, this engine prioritizes deep environmental immersion and stability, allowing clues to be hidden behind real-world furniture or tucked into the corners of physical rooms.

The research recommends a **ViroReact (React Native)** stack leveraging **SLAM/LiDAR** for spatial mapping, moving away from unstable GPS-only placement. To ensure reliability in typical investigation settings (cellars, remote parks), the system uses an **Offline-First** architecture where spatial maps and clue metadata are pre-cached on the device, enabling full functionality without an active internet connection during the hunt.

## Key Findings

### Technical Stack (STACK.md)
- **Core:** `@reactvision/react-viro` for high-performance AR via JSI.
- **Framework:** **Expo SDK 55** (Development Builds) for native AR module support without ejection.
- **Persistence:** **MMKV** for ultra-fast local metadata; **Expo FileSystem** for asset/map caching.
- **Rendering:** **Three.js** & `@react-three/fiber` for complex shaders (glowing trails, scent clouds).

### Feature Landscape (FEATURES.md)
- **Table Stakes:** Precise anchoring, visual pulsing, proximity discovery, and grounded decals.
- **Differentiators:** Environmental occlusion (hiding clues behind objects), perspective puzzles, and multi-modal senses (scent/sound).
- **MVP Focus:** Stability over visual polish; mastering the "Footstep Trail" and "Proximity Discovery" loop first.

### Architecture (ARCHITECTURE.md)
- **Recorder/Hunter Pattern:** Separate modes for environment authoring (Game Master) and investigation (Player).
- **Spatial Hierarchy:** Hybrid navigation using GPS for area arrival and SLAM for local clue discovery.
- **Data Flow:** Metadata-driven reconstruction using relative offsets from physical anchors.

### Critical Pitfalls (PITFALLS.md)
- **The "Drift":** Solved via frequent SLAM relocalization against environmental features.
- **Gorilla Arm:** Mitigated by designing "Heads-Down" phases (Evidence Log/Maps) to give players' arms a rest.
- **Lighting:** Requires dynamic intensity adjustment using AR Lighting Estimation to maintain immersion.

## Roadmap Implications

### Suggested Phase Structure

1. **Phase 1: AR Foundation (The Engine)**
   - **Rationale:** Establish stable tracking before building any game logic.
   - **Deliverable:** Mobile app with ViroReact integration, plane detection, and a "Stable Anchor" prototype.
   - **Pitfall to avoid:** The "Drift" (establish relocalization early).

2. **Phase 2: The Recorder (Admin Tooling)**
   - **Rationale:** You cannot test a hunt without a way to author it.
   - **Deliverable:** Admin mode in the mobile app for scanning spaces, dropping anchors, and saving clue metadata to Firestore.
   - **Features:** Grounding Decals, Precise Anchoring.

3. **Phase 3: The Hunter (Player Loop)**
   - **Rationale:** Connect the authored clues to the narrative state machine.
   - **Deliverable:** Proximity discovery logic, "Witcher Senses" visual filters, and the Footstep Trail system.
   - **Features:** Trail Breadcrumbs, Evidence Log, Visual Discovery.

4. **Phase 4: Persistence & Offline Optimization**
   - **Rationale:** Enable the "anywhere, anytime" core value.
   - **Deliverable:** Map serialization (ARWorldMap), bundle pre-downloading, and MMKV integration for offline hunts.
   - **Features:** Offline Spatial Sync.

### Research Flags
- **Needs Research:** Android-specific spatial map persistence (parity with iOS ARWorldMap) is the highest technical risk.
- **Standard Patterns:** GPS proximity and Firebase integration are well-documented; focus research on the SLAM-to-JS bridge performance.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | ViroReact is the clear choice for RN-based AR in 2026. |
| Features | HIGH | Based on proven mechanics from Witcher 3 and Monster Slayer. |
| Architecture | MEDIUM | Relocalization logic is complex; needs a PoC in Phase 1. |
| Pitfalls | HIGH | Common AR UX failures are well-documented and preventable. |

## Gaps to Address
- **Android Persistence:** How to handle anchor sharing/saving on Android without Google Cloud Anchors (for offline support).
- **Battery Impact:** High-fidelity SLAM + 3D rendering will drain battery; needs profiling during Phase 2.

---
## Sources
- ViroReact / ReactVision Documentation
- Witcher 3 UX Analysis
- Google ARCore Design Lab
- Apple ARKit Capabilities Guide
- Project gcr26 Requirements
