# Phase 09: Proximity Discovery - Pattern Map

**Mapped:** April 19, 2026
**Files analyzed:** 4
**Analogs found:** 4 / 4

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/hooks/useProximityDiscovery.ts` | hook | request-response | `apps/mobile/src/hooks/useClueGuidance.ts` | role-match |
| `apps/mobile/src/components/ClueBillboard.tsx` | component | request-response | (self) | exact |
| `apps/mobile/src/components/ScanningProgress.tsx` | component | request-response | `apps/mobile/src/components/LockingProgressRing.tsx` | exact |
| `apps/mobile/src/components/HuntingHUD.tsx` | component | request-response | (self) | exact |

## Pattern Assignments

### `apps/mobile/src/hooks/useProximityDiscovery.ts` (hook, request-response)

**Analog:** `apps/mobile/src/hooks/useClueGuidance.ts`

**Distance and Angle Logic** (lines 53-73):
```typescript
// 2. Calculate Euclidean distance (3D Vector Distance pattern)
const dx = nextClue.position[0] - cameraTransform.position[0];
const dy = nextClue.position[1] - cameraTransform.position[1];
const dz = nextClue.position[2] - cameraTransform.position[2];

const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

// 3. Calculate horizontal angle relative to camera
// targetAngle: Angle of the vector from camera to clue on the XZ plane
const targetAngleRad = Math.atan2(dx, dz);
const targetAngleDeg = (targetAngleRad * 180) / Math.PI;

// Camera rotation[1] is the rotation around Y axis in degrees.
let angle = targetAngleDeg - cameraTransform.rotation[1];

// Normalize angle to [-180, 180]
while (angle > 180) angle -= 360;
while (angle < -180) angle += 360;
```

**Implementation Note:** Combine this with a `useEffect` and `setTimeout` (or a state-based timer) to implement the 1.0 second FOV focus requirement (D-02, D-06).

---

### `apps/mobile/src/components/ClueBillboard.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/ClueBillboard.tsx`

**Distance-based Animation Pattern** (lines 100-112):
```typescript
  if (witcherSensesActive && isNext) {
    runAnimation = true;
    if (distance <= 2) {
      animationName = 'pulse_faster';
    } else if (distance <= 5) {
      animationName = 'pulse_fast';
    } else if (distance <= 10) {
      animationName = 'pulse_medium';
    } else {
      animationName = 'pulse_slow';
    }
  }
```

**ViroText usage for Hover Labels** (from `apps/mobile/src/screens/RecorderScreen.tsx` lines 70-76):
```typescript
<ViroText
  text={locked ? "ORIGIN LOCKED" : "LOCKING..."}
  scale={[0.1, 0.1, 0.1]}
  position={[0, 0.05, 0]}
  style={styles.originTextStyle}
/>
```

---

### `apps/mobile/src/components/ScanningProgress.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/LockingProgressRing.tsx`

**Animated SVG Progress Pattern** (lines 33-47):
```typescript
useEffect(() => {
  if (visible) {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000, // Reduced to 1s for Discovery
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onComplete();
      }
    });
  } else {
    progressAnim.stopAnimation();
  }
}, [visible, onComplete]);
```

---

### `apps/mobile/src/components/HuntingHUD.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/HuntingHUD.tsx`

**HUD Overlay Structure** (lines 13-21):
```typescript
export const HuntingHUD = ({ active }: HuntingHUDProps) => {
  if (!active) return null;

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.text}>Witcher Senses Active</Text>
      </View>
      {/* ADD ScanningProgress HERE */}
    </View>
  );
};
```

## Shared Patterns

### Discovery Sync
**Source:** `apps/mobile/src/hooks/useInvestigation.ts`
**Apply to:** `useProximityDiscovery`
```typescript
const discoverClue = async (clueId: string) => {
  if (!profile?.teamId) {
    console.warn('Cannot discover clue: No teamId found in user profile');
    return;
  }
  await mapService.recordClueDiscovery(profile.teamId, clueId);
};
```

### Witcher Senses Gating
**Source:** `apps/mobile/src/hooks/useWitcherSenses.ts`
**Apply to:** `useProximityDiscovery` logic
```typescript
const { active: witcherSensesActive } = useWitcherSenses();
// ... inside proximity check ...
if (witcherSensesActive && distance <= 1.5 && Math.abs(angle) <= 15) {
  // Start timer
}
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| N/A | | | All patterns have strong analogs in the existing AR codebase. |

## Metadata

**Analog search scope:** `apps/mobile/src/`
**Files scanned:** 39
**Pattern extraction date:** April 19, 2026
