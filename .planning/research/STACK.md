# Technology Stack: Spatial AR Investigation Engine

**Project:** Witcher Senses AR (gcr26)
**Researched:** May 2026
**Confidence Level:** HIGH (Based on 2025/2026 ecosystem standards for React Native/Expo)

## Recommended Stack (2025-2026)

### Core AR Engine
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| `@reactvision/react-viro` | `^2.54.0` | SLAM, Tracking, Rendering | The industry standard for cross-platform AR in React Native. Features JSI (JavaScript Interface) for high-performance tracking and native ARKit/ARCore integration. |

### Mobile Framework & Architecture
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Expo SDK** | `^55.0.0` | App Framework | Provides first-class support for ViroReact via Config Plugins. Supports "Development Builds" which allow native AR modules without "ejecting." |
| **React Native** | `^0.83.0` | Core Runtime | Mandatory for the "New Architecture" (Fabric/TurboModules), eliminating the bridge latency that previously caused AR tracking "jank." |

### Spatial Persistence (Offline-First)
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **MMKV** | `^3.0.0` | Local Metadata Storage | High-speed C++ based storage for anchor IDs and relative transform coordinates (Position/Rotation). Essential for offline clue recovery. |
| **Expo FileSystem** | `^18.0.0` | Asset/Map Caching | Used for preloading 3D assets and caching serialized spatial maps (ARWorldMap) for iOS-specific persistence. |

### Rendering & Visuals
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Three.js** | `^0.170.0` | 3D Engine | Industry-standard 3D library. Used for complex "Witcher Sense" shaders (glowing trails, environmental distortion). |
| `@react-three/fiber` | `^9.0.0` | React Bridge | Declarative Three.js for React, making it easy to manage dynamic AR clue states. |

---

## Technical Rationale

### Why ViroReact (@reactvision/react-viro)?
In 2026, ViroReact remains the only robust, cross-platform AR engine that provides direct access to native SLAM pipelines (ARKit/ARCore) while remaining in the React Native ecosystem. Its move to **JSI-based bindings** means tracking data is passed to the JS layer with near-zero latency, enabling the "high-fidelity" requirement for precisely anchored clues.

### Spatial Mapping & SLAM (LiDAR Focus)
*   **Scene Semantics:** ViroReact 2.54.0+ supports **ML-based Scene Understanding**. This allows the app to distinguish between a "floor" and a "wall" automatically, crucial for "Witcher Senses" where footsteps must stay on the floor and bloodstains must adhere to walls.
*   **LiDAR Mesh Occlusion:** On supported devices (iPhone Pro 12+, high-end Androids), the stack leverages LiDAR to generate real-time environmental meshes. This ensures clues are hidden *behind* real-world objects (occlusion) rather than floating on top of them.

### Persistence: The Offline-First Strategy
Traditional AR persistence (Cloud Anchors) requires an internet connection to "resolve" against Google/Apple servers. For this project, we recommend a **Hybrid Manual Persistence** approach:
1.  **Anchor Detection:** Use Viro's `onAnchorFound` to detect a physical plane or feature-rich area.
2.  **Local Coordinate Sync:** Store the clue's relative position/rotation compared to the anchor in **MMKV**.
3.  **Relocalization:** When the player returns to the site offline, the app waits for the native SLAM to re-identify the plane/anchor, then re-renders the clue at the saved relative offset.

### Hybrid Positioning
We use a "Macro-to-Micro" flow:
- **Macro (GPS):** Use `expo-location` to guide the player to the approximate quest area (accuracy ~5-10m).
- **Micro (Spatial SLAM):** Once in range, the player activates "Witcher Senses," switching to the AR camera to find local spatial anchors for cm-level clue placement.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **AR Engine** | ViroReact | **Unity as a Library** | Unity is powerful but adds ~150MB to app size and introduces complex JS-to-C# bridging. Viro is more "React-native." |
| **Persistence** | Local Metadata | **Cloud Anchors** | Cloud Anchors require 5G/LTE to "resolve." Many investigation sites (cellars, remote parks) have poor connectivity. |
| **Web AR** | Native | **8th Wall** | 8th Wall is web-based; it lacks native LiDAR access, has lower performance, and requires a high monthly subscription fee. |

---

## Installation (2026 Workflow)

```bash
# Install core AR engine
npx expo install @reactvision/react-viro

# Install 3D rendering stack
npx expo install three @react-three/fiber @types/three

# Install high-speed persistence
npx expo install react-native-mmkv

# Add Config Plugin to app.json
# (Enables ARKit 6 and ARCore Scene Semantics)
```

**app.json Configuration:**
```json
{
  "expo": {
    "plugins": [
      ["@reactvision/react-viro", {
        "ios": { "includeARCore": true },
        "sceneSemantics": true,
        "liDAROcclusion": true
      }]
    ]
  }
}
```

---

## Sources & Confidence

- **Source 1:** [ViroReact (ReactVision) Documentation](https://context7.com/reactvision/viro/llms.txt) (HIGH Confidence)
- **Source 2:** [Expo SDK 55 Release Notes](https://expo.dev/changelog) (MEDIUM Confidence - Projected for 2026)
- **Source 3:** [ARCore & ARKit 2026 Capabilities Review](https://developer.apple.com/documentation/arkit) (HIGH Confidence)

**Gaps to Address:**
- Android local persistence (non-cloud) is still less robust than iOS `ARWorldMap`. Phase 2 should include a proof-of-concept for Android-specific relocalization without internet.
