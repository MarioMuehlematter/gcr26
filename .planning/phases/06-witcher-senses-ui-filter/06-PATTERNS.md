# Phase 6: Witcher Senses UI & Filter - Pattern Map

**Mapped:** October 26, 2023
**Files analyzed:** 7
**Analogs found:** 5 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/hooks/useWitcherSenses.ts` | hook | event-driven | `apps/mobile/src/hooks/useARSession.ts` | exact |
| `apps/mobile/src/components/WitcherSenseOverlay.tsx` | component | request-response | `apps/mobile/src/components/RelocalizationOverlay.tsx` | exact |
| `apps/mobile/src/components/MedallionButton.tsx` | component | event-driven | `apps/mobile/src/components/LockingProgressRing.tsx` | role-match |
| `apps/mobile/src/components/ClueBillboard.tsx` | component | request-response | (self) | exact |
| `apps/mobile/src/components/HuntingHUD.tsx` | component | request-response | `apps/mobile/src/screens/ARScreen.tsx` (HUD) | role-match |
| `apps/mobile/src/components/DiscoveryNotification.tsx` | component | event-driven | `apps/mobile/src/components/RelocalizationOverlay.tsx` | role-match |
| `apps/mobile/src/screens/ARScreen.tsx` | screen | event-driven | (self) | exact |

## Pattern Assignments

### `apps/mobile/src/hooks/useWitcherSenses.ts` (hook, event-driven)

**Analog:** `apps/mobile/src/hooks/useARSession.ts`

**State and Callback pattern** (lines 11-25):
```typescript
export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState<string>('INITIALIZING');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [relocalizing, setRelocalizing] = useState<boolean>(false);
  // ...
  const onImageMarkerFound = useCallback(() => {
    if (relocalizing) {
      setRelocalizationStatus('SUCCESS');
      setRelocalizing(false);
      // ...
    }
  }, [relocalizing]);
```

### `apps/mobile/src/components/WitcherSenseOverlay.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/RelocalizationOverlay.tsx`

**Overlay/Modal pattern** (lines 62-70):
```typescript
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* ... content ... */}
        </View>
      </View>
    </Modal>
  );
```

**Fade Animation pattern** (lines 24-34):
```typescript
    if (visible) {
      // Start progress bar animation
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
```

### `apps/mobile/src/components/ClueBillboard.tsx` (component, request-response)

**Analog:** `apps/mobile/src/components/ClueBillboard.tsx`

**Material Swap pattern** (lines 39-44):
```typescript
  // Map clue type to material name defined above
  const materialName = `${clue.type}Material`;

  // Apply the base material, and overlay highlight if active
  const materials = [materialName];
  if (highlighted) {
    materials.push('green_highlight');
  }
```

**Viro Material definition** (lines 12-23):
```typescript
ViroMaterials.createMaterials({
  // ...
  green_highlight: {
    diffuseColor: 'rgba(0, 255, 0, 0.3)',
    lightingModel: 'Constant',
  },
});
```

### `apps/mobile/src/components/MedallionButton.tsx` (component, event-driven)

**Analog:** `apps/mobile/src/components/LockingProgressRing.tsx`

**SVG Animation pattern** (lines 53-73):
```typescript
      <View style={styles.ringWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Background Circle */}
          <Circle ... />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="#4A90E2"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
```

## Shared Patterns

### Animations
**Source:** `apps/mobile/src/components/RelocalizationOverlay.tsx`
**Apply to:** All animated UI components
```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, {
      toValue: 1.2,
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
```

### HUD Styling
**Source:** `apps/mobile/src/screens/ARScreen.tsx`
**Apply to:** `HuntingHUD.tsx` and `DiscoveryNotification.tsx`
```typescript
  hud: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
```

## No Analog Found

Files with no close match in the codebase:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/hooks/useWitcherSenses.ts` | hook | haptics | No haptics implementation exists yet in the codebase. |

## Metadata

**Analog search scope:** `apps/mobile/src/`
**Files scanned:** 15
**Pattern extraction date:** October 26, 2023
