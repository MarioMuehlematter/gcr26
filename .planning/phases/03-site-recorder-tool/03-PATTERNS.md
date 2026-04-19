# Phase 3: Site Recorder Tool - Pattern Map

**Mapped:** April 17, 2026
**Files analyzed:** 6
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/screens/RecorderScreen.tsx` | screen | request-response | `apps/mobile/src/screens/ARScreen.tsx` | role-match |
| `apps/mobile/src/navigation/index.tsx` | config | N/A | `apps/mobile/src/navigation/index.tsx` | modification |
| `apps/mobile/src/components/LockingProgressRing.tsx` | component | transform | `apps/mobile/src/components/RelocalizationOverlay.tsx` | exact |
| `apps/mobile/src/components/SiteNamingModal.tsx` | component | CRUD | `apps/mobile/src/components/SignUpModal.tsx` | exact |
| `apps/mobile/src/services/mapService.ts` | service | CRUD | `apps/mobile/src/services/mapService.ts` | modification |
| `apps/mobile/src/hooks/useRecorderSession.ts` | hook | event-driven | `apps/mobile/src/hooks/useARSession.ts` | exact |

## Pattern Assignments

### `apps/mobile/src/navigation/index.tsx` (config)

**Analog:** Existing `apps/mobile/src/navigation/index.tsx`

**Admin Guard Pattern** (lines 13-30):
```typescript
export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AR" component={ARScreen} />
            {profile?.isAdmin && (
              <Stack.Screen name="Recorder" component={RecorderScreen} />
            )}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

### `apps/mobile/src/components/SiteNamingModal.tsx` (component, CRUD)

**Analog:** `apps/mobile/src/components/SignUpModal.tsx`

**Form & Validation Pattern** (lines 25-50):
```typescript
export default function SiteNamingModal({ visible, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      setError('Please provide a name for the site.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }
}
```

**UI Structure Pattern** (lines 65-100):
```typescript
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Save Site Origin</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Site Name (e.g. The Wine Cellar)"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save to Cloud</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
```

---

### `apps/mobile/src/components/LockingProgressRing.tsx` (component, transform)

**Analog:** `apps/mobile/src/components/RelocalizationOverlay.tsx`

**Animation Pattern** (lines 25-50):
```typescript
  useEffect(() => {
    if (visible) {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000, // 5 seconds locking time (D-01)
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) onComplete();
      });
    } else {
      progressAnim.stopAnimation();
    }
  }, [visible]);
```

---

### `apps/mobile/src/services/mapService.ts` (service, CRUD)

**Analog:** `apps/mobile/src/components/SignUpModal.tsx` (for Firestore usage)

**Firestore Sync Pattern** (to be added to `mapService.ts`):
```typescript
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function syncMapToCloud(metadata: SpatialMapMetadata, targetImageId: string) {
  const mapRef = doc(collection(db, 'spatial_maps'));
  await setDoc(mapRef, {
    ...metadata,
    targetImageId,
    cloudSyncAt: serverTimestamp(),
  });
  return mapRef.id;
}
```

---

### `apps/mobile/src/hooks/useRecorderSession.ts` (hook, event-driven)

**Analog:** `apps/mobile/src/hooks/useARSession.ts`

**Detection Loop Pattern** (lines 20-45):
```typescript
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);

  const onImageMarkerFound = useCallback((anchor: any) => {
    if (!locked && !locking) {
      setLocking(true);
      // Logic to start the 5s countdown
    }
  }, [locked, locking]);
```

## Shared Patterns

### Authentication & Authorization
**Source:** `apps/mobile/src/hooks/useAuth.ts` and `apps/mobile/src/hooks/useUser.ts`
**Apply to:** `RecorderScreen.tsx` and `navigation/index.tsx`
Ensure `profile.isAdmin` is checked before rendering sensitive UI or allowing navigation.

### Firestore Persistence
**Source:** `apps/mobile/src/firebase.ts`
**Apply to:** `mapService.ts`
Use the modular Firebase v9+ SDK pattern (`doc`, `setDoc`, `collection`) consistent with the Admin dashboard.

### Viro AR Callbacks
**Source:** `apps/mobile/src/hooks/useARSession.ts`
**Apply to:** `useRecorderSession.ts`
Use `onAnchorFound` (for image markers) and `onTrackingUpdated` to drive UI states.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| None | | | All requested patterns have reasonable analogs in the codebase. |

## Metadata

**Analog search scope:** `apps/mobile/src`, `apps/admin/src`
**Files scanned:** 15
**Pattern extraction date:** April 17, 2026
