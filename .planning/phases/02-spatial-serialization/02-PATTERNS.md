# Phase 2: Spatial Serialization - Pattern Map

**Mapped:** April 17, 2026
**Files analyzed:** 5
**Analogs found:** 3 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/services/mapService.ts` | service | File-I/O | `apps/mobile/src/tasks/locationTask.ts` | partial |
| `apps/mobile/src/hooks/useARSession.ts` | hook | state-management | `apps/mobile/src/hooks/useARSession.ts` | exact |
| `apps/mobile/src/screens/ARScreen.tsx` | screen | UI logic | `apps/mobile/src/screens/ARScreen.tsx` | exact |
| `apps/mobile/src/components/RelocalizationOverlay.tsx` | component | UI logic | `apps/mobile/src/components/SignUpModal.tsx` | role-match |
| `apps/mobile/src/utils/binaryUtils.ts` | utility | transform | `apps/admin/src/utils/geocode.js` | partial |

## Pattern Assignments

### `apps/mobile/src/services/mapService.ts` (service, File-I/O)

**Analog:** `apps/mobile/src/tasks/locationTask.ts`

**Imports pattern** (from `locationTask.ts` lines 1-6):
```typescript
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
```
*Note: New service will use `react-native-mmkv` and `expo-file-system` instead of `AsyncStorage`.*

**Storage interaction pattern** (from `locationTask.ts` lines 14-16):
```typescript
const [uid, teamId, gameId] = await AsyncStorage.multiGet(['uid', 'teamId', 'gameId'])
  .then(pairs => pairs.map(([, v]) => v));
```

---

### `apps/mobile/src/hooks/useARSession.ts` (hook, state-management)

**Analog:** `apps/mobile/src/hooks/useARSession.ts` (itself)

**Imports pattern** (lines 1-2):
```typescript
import { useState, useCallback } from 'react';
import { ViroTrackingStateConstants } from '@reactvision/react-viro';
```

**State management pattern** (lines 8-10):
```typescript
export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState<string>('INITIALIZING');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
```

**Event handler pattern** (lines 16-25):
```typescript
const onTrackingUpdated = useCallback((state: any, _reason: any) => {
  if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
    setTrackingStatus('TRACKING');
    setIsInitialized(true);
  } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
    setTrackingStatus('LIMITED');
  } else {
    setTrackingStatus('INITIALIZING');
  }
}, []);
```

---

### `apps/mobile/src/screens/ARScreen.tsx` (screen, UI logic)

**Analog:** `apps/mobile/src/screens/ARScreen.tsx` (itself)

**UI Structure pattern** (lines 92-105):
```typescript
  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: MainScene as any,
        }}
        viroAppProps={{ onTrackingUpdated }}
        style={styles.f1}
      />
      
      {/* Tracking Status HUD */}
      <HUD status={trackingStatus} />
```

---

### `apps/mobile/src/components/RelocalizationOverlay.tsx` (component, UI logic)

**Analog:** `apps/mobile/src/components/SignUpModal.tsx`

**Props and State pattern** (lines 19-32):
```typescript
interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SignUpModal({ visible, onClose }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
```

**Overlay structure pattern** (lines 72-78):
```typescript
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
```

---

## Shared Patterns

### Error Handling
**Source:** `apps/mobile/src/hooks/useAuth.ts`
**Apply to:** All services and hooks.
```typescript
try {
  // async operation
} catch (e: any) {
  setError(e.message);
  setLoading(false);
}
```

### AsyncStorage/Persistence (Transitioning to MMKV)
**Source:** `apps/mobile/src/firebase.ts`
**Apply to:** All persistence-related code.
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
// Follow this pattern but substitute with MMKV for performance as per D-02
```

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/utils/binaryUtils.ts` | utility | transform | No binary manipulation utilities exist yet. |

## Metadata

**Analog search scope:** `apps/mobile/src`, `apps/admin/src`, `packages/shared/src`
**Files scanned:** ~15
**Pattern extraction date:** April 17, 2026
