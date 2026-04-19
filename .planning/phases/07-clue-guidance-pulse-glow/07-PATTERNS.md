# Phase 07: Clue Guidance (Pulse/Glow) - Pattern Map

**Mapped:** April 18, 2026
**Files analyzed:** 3
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/components/ClueBillboard.tsx` | component | request-response | `apps/mobile/src/components/ClueBillboard.tsx` | exact |
| `apps/mobile/src/components/ClueGuidanceHUD.tsx` | component | request-response | `apps/mobile/src/components/WitcherSenseOverlay.tsx` | role-match |
| `apps/mobile/src/hooks/useClueGuidance.ts` | hook | transform | `apps/mobile/src/hooks/useWitcherSenses.ts` | role-match |

## Pattern Assignments

### `apps/mobile/src/components/ClueBillboard.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/ClueBillboard.tsx`

**Material Definition pattern** (lines 10-30):
```typescript
ViroMaterials.createMaterials({
  // ... existing materials
  witcher_sense_highlight: {
    diffuseColor: 'rgba(255, 100, 0, 0.5)', // Orange glow
    lightingModel: 'Constant',
  },
});
```

**Material Application pattern** (lines 60-70):
```typescript
  const materials = [materialName];
  if (highlighted) {
    materials.push('green_highlight');
  }

  if (witcherSensesActive) {
    materials.push('witcher_sense_highlight');
  }
```

**Animation Pattern (Proposed for ViroAnimations):**
Based on Viro documentation (to be added to `ClueBillboard.tsx`):
```typescript
ViroAnimations.registerAnimations({
  pulse: {
    properties: {
      opacity: 0.3,
      scaleX: 1.1,
      scaleY: 1.1,
      scaleZ: 1.1,
    },
    duration: 1000,
    easing: "SineIn",
  },
  reset: {
    properties: {
      opacity: 1.0,
      scaleX: 1.0,
      scaleY: 1.0,
      scaleZ: 1.0,
    },
    duration: 1000,
    easing: "SineOut",
  },
  pulseLoop: [["pulse", "reset"]],
});

// Usage in JSX
<ViroQuad
  animation={{ name: "pulseLoop", run: active, loop: true }}
  // ...
/>
```

---

### `apps/mobile/src/components/ClueGuidanceHUD.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/WitcherSenseOverlay.tsx`

**Animated Overlay pattern** (lines 13-25):
```typescript
export default function WitcherSenseOverlay({ active }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [active, fadeAnim]);
```

**Screen-edge Gradient pattern** (lines 45-75):
```typescript
  vignette: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  vignetteTop: {
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  // ... apply similar logic for Aura gradients on edges
```

---

### `apps/mobile/src/hooks/useClueGuidance.ts` (hook, transform)

**Analog:** `apps/mobile/src/hooks/useWitcherSenses.ts` (Structure) and `apps/mobile/src/screens/GameScreen.tsx` (Distance logic)

**Distance Math pattern** (`GameScreen.tsx` lines 50-60):
```typescript
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  // ... Haversine formula
}
```

**AR Vector Distance (New Pattern):**
```typescript
const calculateDistance = (pos1: number[], pos2: number[]) => {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
};
```

---

## Shared Patterns

### Sinusoidal Pulse Animation
**Source:** `apps/mobile/src/components/MedallionButton.tsx` (Lines 17-36)
**Apply to:** `ClueBillboard.tsx` (as ViroAnimation) and `ClueGuidanceHUD.tsx` (as Animated.Value)
```typescript
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
```

### Proximity Discovery Logic
**Source:** `apps/mobile/src/screens/GameScreen.tsx` (Lines 440-445)
**Apply to:** `useClueGuidance.ts`
```typescript
const distance = coords != null
  ? distanceMeters(coords.lat, coords.lng, quest.location.lat, quest.location.lng)
  : null;
const insideFence = distance !== null && distance <= (quest.fenceRadius ?? 50);
```

## No Analog Found

Files with no close match in the codebase:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/hooks/useClueGuidance.ts` | hook | transform | No existing hook calculates angles between camera and AR objects yet. |

## Metadata

**Analog search scope:** `apps/mobile/src/`
**Files scanned:** 25+
**Pattern extraction date:** April 18, 2026
