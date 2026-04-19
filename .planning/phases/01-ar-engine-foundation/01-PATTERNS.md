# Phase 01: AR Engine Foundation - Pattern Map

**Mapped:** April 17, 2026
**Files analyzed:** 6
**Analogs found:** 5 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/screens/ARScreen.tsx` | screen | streaming | `apps/mobile/src/screens/GameScreen.tsx` | role-match |
| `apps/mobile/src/components/ARPlaneVisualization.tsx` | component | reactive | `apps/mobile/src/components/SignUpModal.tsx` | role-match |
| `apps/mobile/src/hooks/useARSession.ts` | hook | event-driven | `apps/mobile/src/hooks/useAuth.ts` | role-match |
| `apps/mobile/app.json` | config | static | `apps/mobile/app.json` | exact |
| `apps/mobile/src/navigation/index.tsx` | navigation | static | `apps/mobile/src/navigation/index.tsx` | exact |
| `apps/mobile/package.json` | config | static | `apps/mobile/package.json` | exact |

## Pattern Assignments

### `apps/mobile/src/screens/ARScreen.tsx` (screen, streaming)

**Analog:** `apps/mobile/src/screens/GameScreen.tsx`

**Imports pattern** (lines 1-15):
```typescript
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
// Note: ViroReact components will be imported here
```

**Screen Structure pattern** (lines 374-386):
```typescript
export default function ARScreen() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // AR session initialization logic
    setInitializing(false);
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ViroSceneNavigator here */}
    </View>
  );
}
```

**Styles pattern** (lines 600-610):
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // AR views usually have black background during init
  },
});
```

---

### `apps/mobile/src/hooks/useARSession.ts` (hook, event-driven)

**Analog:** `apps/mobile/src/hooks/useAuth.ts`

**Custom Hook pattern** (lines 1-15):
```typescript
import { useState, useEffect } from 'react';

export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState('initializing');

  useEffect(() => {
    // Setup listeners for AR tracking status
    return () => {
      // Cleanup AR session
    };
  }, []);

  return { trackingStatus };
}
```

---

### `apps/mobile/app.json` (config, static)

**Analog:** `apps/mobile/app.json`

**Plugin pattern** (lines 43-52):
```json
"plugins": [
  "expo-notifications",
  [
    "expo-location",
    {
      "isIosBackgroundLocationEnabled": true
    }
  ],
  [
    "@reactvision/react-viro",
    {
      "ios": { "includeARCore": true },
      "sceneSemantics": true,
      "liDAROcclusion": true
    }
  ]
]
```

---

### `apps/mobile/src/navigation/index.tsx` (navigation, static)

**Analog:** `apps/mobile/src/navigation/index.tsx`

**Stack Screen pattern** (lines 24-34):
```typescript
<Stack.Navigator screenOptions={{ headerShown: false }}>
  {user ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AR" component={ARScreen} />
    </>
  ) : (
    <Stack.Screen name="Login" component={LoginScreen} />
  )}
</Stack.Navigator>
```

---

## Shared Patterns

### Initialization & Loading State
**Source:** `apps/mobile/src/screens/GameScreen.tsx`
**Apply to:** `ARScreen.tsx`, `useARSession.ts`
```typescript
if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
```

### Expo Config Plugins
**Source:** `apps/mobile/app.json`
**Apply to:** ViroReact setup
```json
"plugins": [
  ["plugin-name", { "config": "values" }]
]
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/components/ARPlaneVisualization.tsx` | component | reactive | No existing 3D components or AR visualizations. Will follow ViroReact `<ViroARPlaneSelector>` pattern from RESEARCH.md. |

## Metadata

**Analog search scope:** `apps/mobile/src`
**Files scanned:** 15
**Pattern extraction date:** April 17, 2026
