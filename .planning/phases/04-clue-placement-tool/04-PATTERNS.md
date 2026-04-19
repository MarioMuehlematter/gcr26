# Phase 4: Clue Placement Tool - Pattern Map

**Mapped:** October 26, 2023 (Updated: April 17, 2026 context)
**Files analyzed:** 6
**Analogs found:** 5 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/screens/PlacementScreen.tsx` | controller | request-response | `apps/mobile/src/screens/RecorderScreen.tsx` | exact |
| `apps/mobile/src/components/ClueTray.tsx` | component | request-response | `apps/admin/src/pages/QuestsPage.jsx` | partial (UI logic) |
| `apps/mobile/src/components/ClueBillboard.tsx` | component | request-response | `apps/mobile/src/components/ARPlaneVisualization.tsx` | role-match |
| `apps/mobile/src/hooks/useCluePlacement.ts` | hook | transform | `apps/mobile/src/hooks/useRecorderSession.ts` | role-match |
| `apps/mobile/src/services/mapService.ts` | service | CRUD | `apps/mobile/src/services/mapService.ts` | exact |
| `packages/shared/src/types.ts` | model | transform | `packages/shared/src/types.ts` | exact |

## Pattern Assignments

### `apps/mobile/src/screens/PlacementScreen.tsx` (controller, request-response)

**Analog:** `apps/mobile/src/screens/RecorderScreen.tsx`

**AR Scene Wrapper pattern** (lines 48-73):
```tsx
const RecorderScene = (props: any) => {
  const { onTrackingUpdated, onImageMarkerFound, locked } = props.arSceneNavigator.viroAppProps;
  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ViroARImageMarker target="default_marker" onAnchorFound={onImageMarkerFound}>
        {/* Child components here are relative to marker */}
      </ViroARImageMarker>
      <ARPlaneVisualization alignment="Horizontal" />
    </ViroARScene>
  );
};
```

**Relative Transform Calculation** (lines 53-62):
```tsx
<ViroARImageMarker target="default_marker" onAnchorFound={onImageMarkerFound}>
  <ViroBox
    position={[0, 0, 0]} // [0,0,0] is the center of the image marker
    scale={[0.1, 0.01, 0.1]}
    materials={[locked ? 'lockedMaterial' : 'originMaterial']}
  />
</ViroARImageMarker>
```

---

### `apps/mobile/src/components/ClueTray.tsx` (component, request-response)

**Analog:** `apps/admin/src/pages/QuestsPage.jsx` (for the list/selection pattern)

**Selection Logic Pattern** (lines 185-195):
```jsx
{orderedQuests.map((quest, i) => (
  <QuestRow
    key={quest.id}
    quest={quest}
    isSelected={selected && selected.id === quest.id}
    onClick={handleRowClick}
  />
))}
```

---

### `apps/mobile/src/hooks/useCluePlacement.ts` (hook, transform)

**Analog:** `apps/mobile/src/hooks/useRecorderSession.ts`

**Session State Pattern** (lines 6-15):
```typescript
export function useRecorderSession() {
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [targetImageId, setTargetImageId] = useState<string | null>(null);
  
  // ... callbacks to update state
}
```

---

### `apps/mobile/src/services/mapService.ts` (service, CRUD)

**Analog:** `apps/admin/src/pages/QuestsPage.jsx` (for Firestore subcollections)

**Firestore Subcollection Sync Pattern** (lines 115-121):
```javascript
useEffect(() => {
  return onSnapshot(collection(db, 'games', gameId, 'quests'), snap => {
    const map = {};
    snap.forEach(d => { map[d.id] = { id: d.id, ...d.data() }; });
    setQuests(map);
  });
}, [gameId]);
```

---

## Shared Patterns

### Hit-Testing (Viro)
**Source:** `apps/mobile/src/components/ARPlaneVisualization.tsx` (implied pattern)
**Apply to:** `PlacementScreen.tsx`
To perform hit-testing on a plane, use the `onClick` prop on `ViroARPlane` or `ViroQuad`.
```tsx
<ViroARPlane alignment="Horizontal" onClick={(position, source) => {
  // position is the 3D coordinate of the hit test
  handlePlaceClue(position);
}}>
```

### Viro Material Creation
**Source:** `apps/mobile/src/screens/RecorderScreen.tsx`
**Apply to:** `PlacementScreen.tsx` or `ClueBillboard.tsx`
```tsx
ViroMaterials.createMaterials({
  footprintMaterial: {
    diffuseTexture: require('../../assets/clues/footprint.png'),
  },
});
```

### Firestore Write with Merging
**Source:** `apps/admin/src/pages/QuestsPage.jsx`
**Apply to:** `mapService.ts`
```javascript
await updateDoc(doc(db, 'games', gameId, 'quests', selected.id), data);
// OR for the main map doc:
await setDoc(gameDoc, { questOrder: newOrder }, { merge: true });
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/components/ClueBillboard.tsx` | component | request-response | No billboard (always face camera) components exist yet in mobile. |

## Metadata

**Analog search scope:** `apps/mobile/src`, `apps/admin/src`
**Files scanned:** 36
**Pattern extraction date:** April 17, 2026
