# Phase 5: Narrative State Logic - Pattern Map

**Mapped:** April 17, 2026
**Files analyzed:** 6
**Analogs found:** 4 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `packages/shared/src/types.ts` | model | N/A | Existing `types.ts` | exact |
| `apps/mobile/src/hooks/useCluePlacement.ts` | hook | transform | Existing `useCluePlacement.ts` | exact |
| `apps/mobile/src/services/mapService.ts` | service | CRUD/Atomic | `apps/mobile/src/services/mapService.ts` | exact |
| `apps/mobile/src/hooks/useInvestigation.ts` | hook | event-driven | `apps/mobile/src/screens/GameScreen.tsx` | partial (discovery logic) |
| `apps/admin/src/components/PrerequisitePicker.jsx` | component | request-response | `apps/admin/src/components/QuestForm.jsx` | role-match |
| `apps/mobile/src/hooks/useTeamState.ts` | hook | request-response | `apps/mobile/src/screens/GameScreen.tsx` | role-match |

## Pattern Assignments

### `apps/admin/src/components/PrerequisitePicker.jsx` (component, request-response)

**Analog:** `apps/admin/src/components/QuestForm.jsx` (form structure) and `apps/admin/src/pages/TeamsPage.jsx` (list selection)

**Form/Input pattern** (from `QuestForm.jsx` lines 190-210):
```javascript
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisite Clue</label>
  <select
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
    value={form.requiredClueId}
    onChange={e => set('requiredClueId', e.target.value)}
  >
    <option value="">None (Always visible)</option>
    {availableClues.map(clue => (
      <option key={clue.id} value={clue.id}>{clue.type} at {clue.id.substring(0,8)}</option>
    ))}
  </select>
</div>
```

**List/Row pattern** (from `QuestsPage.jsx` lines 18-35):
```javascript
function ClueRow({ clue, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(clue)}
      className={`flex items-center gap-3 bg-white border rounded-lg px-4 py-3 cursor-pointer transition-colors
        ${isSelected ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'}`}
    >
      <span className="flex-1 text-sm font-medium text-gray-900">{clue.type}</span>
      <span className="text-xs text-gray-400">{clue.id}</span>
    </div>
  );
}
```

---

### `apps/mobile/src/services/mapService.ts` (service, CRUD/Atomic)

**Analog:** `apps/mobile/src/screens/GameScreen.tsx` (Firestore atomic update)

**Atomic Update pattern** (from `GameScreen.tsx` lines 558-565):
```typescript
const update: Record<string, unknown> = {
  completedQuestIds: arrayUnion(quest.id),
  currentQuestId: nextQuestId,
};
if (!nextQuestId) update.finishedAt = Date.now();
await updateDoc(doc(db, 'teams', team.id), update);
```

**Proposed Discovery Pattern for `mapService.ts`**:
```typescript
/**
 * Records a clue discovery for a team atomically.
 */
export async function recordClueDiscovery(teamId: string, clueId: string): Promise<void> {
  const teamRef = doc(db, 'teams', teamId);
  await updateDoc(teamRef, {
    discoveredClueIds: arrayUnion(clueId),
    lastDiscoveryAt: serverTimestamp(),
  });
}
```

---

### `apps/mobile/src/hooks/useCluePlacement.ts` (hook, transform)

**Analog:** Existing `useCluePlacement.ts` + `QuestsPage.jsx` (filtering)

**Filtering Pattern** (logic from `QuestsPage.jsx` lines 112-114):
```typescript
const visibleClues = useMemo(() => {
  return placedClues.filter(clue => {
    // D-02: Visibility Filtering
    return !clue.requiredClueId || discoveredClueIds.includes(clue.requiredClueId);
  });
}, [placedClues, discoveredClueIds]);
```

---

### `apps/mobile/src/hooks/useTeamState.ts` (hook, request-response)

**Analog:** `apps/mobile/src/screens/GameScreen.tsx` (onSnapshot sync)

**Sync Pattern** (from `GameScreen.tsx` lines 439-443):
```typescript
useEffect(() => {
  if (!teamId) return;
  return onSnapshot(doc(db, 'teams', teamId), snap => {
    setTeam(snap.exists() ? ({ id: snap.id, ...snap.data() } as Team) : null);
  });
}, [teamId]);
```

## Shared Patterns

### Firestore Array Operations
**Source:** `apps/mobile/src/screens/GameScreen.tsx`
**Apply to:** All team progression updates
```typescript
import { arrayUnion, updateDoc, doc } from 'firebase/firestore';
// Always use arrayUnion for list updates to prevent race conditions in teams
await updateDoc(doc(db, 'teams', id), { field: arrayUnion(value) });
```

### Team Discovery Sync
**Source:** `apps/mobile/src/screens/GameScreen.tsx`
**Apply to:** `useInvestigation` and `useNarrativeProgress`
```typescript
// Shared logic for determining narrative state from Team document
const isDiscovered = (clueId: string) => team?.discoveredClueIds?.includes(clueId);
```

## No Analog Found

Files with no close match in the codebase:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/hooks/useInvestigation.ts` | hook | event-driven | New logic for triggering discovery events based on AR proximity/interaction |

## Metadata

**Analog search scope:** `apps/admin/src`, `apps/mobile/src`, `packages/shared/src`
**Files scanned:** ~50
**Pattern extraction date:** April 17, 2026
