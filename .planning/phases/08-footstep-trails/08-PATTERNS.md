# Phase 8: Footstep Trails - Pattern Map

**Mapped:** April 18, 2026
**Files analyzed:** 6
**Analogs found:** 4 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `apps/mobile/src/components/FootstepTrail.tsx` | component | request-response | `apps/mobile/src/screens/ARScreen.tsx` | role-match |
| `apps/mobile/src/components/FootstepBillboard.tsx` | component | rendering | `apps/mobile/src/components/ClueBillboard.tsx` | exact |
| `apps/mobile/src/utils/pathing.ts` | utility | transform | `apps/mobile/src/hooks/useClueGuidance.ts` | partial |
| `packages/shared/src/types.ts` | model | CRUD | `packages/shared/src/types.ts` | exact |
| `apps/mobile/src/hooks/useInvestigation.ts` | hook | request-response | `apps/mobile/src/hooks/useInvestigation.ts` | exact |
| `apps/mobile/src/services/mapService.ts` | service | CRUD | `apps/mobile/src/services/mapService.ts` | exact |

## Pattern Assignments

### `apps/mobile/src/components/FootstepTrail.tsx` (component, request-response)

**Analog:** `apps/mobile/src/screens/ARScreen.tsx` (lines 100-118)

**Collection Rendering pattern**:
```typescript
{/* Narrative Clues (ADM-03) */}
{placedClues.map((clue: any) => {
  // D-02: Visibility Filtering
  const isVisible = !clue.requiredClueId || discoveredClueIds.includes(clue.requiredClueId);
  if (!isVisible) return null;

  return (
    <ClueBillboard
      key={clue.id}
      clue={clue}
      // ... props
    />
  );
})}
```

---

### `apps/mobile/src/components/FootstepBillboard.tsx` (component, rendering)

**Analog:** `apps/mobile/src/components/ClueBillboard.tsx`

**Material and Asset pattern** (lines 12-25):
```typescript
ViroMaterials.createMaterials({
  footprintMaterial: {
    diffuseTexture: require('../../assets/clues/footprint.png'),
  },
  // ...
  witcher_sense_highlight: {
    diffuseColor: 'rgba(255, 100, 0, 0.5)', // Orange glow
    lightingModel: 'Constant',
  },
});
```

**Proximity-based Logic pattern** (lines 105-115):
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

**Grounded Decal pattern** (lines 130-140):
```typescript
<ViroQuad
  rotation={[-90, 0, 0]}
  width={0.2}  // Base size 20cm
  height={0.2} // Base size 20cm
  materials={materials}
  // ...
/>
```

---

### `apps/mobile/src/utils/pathing.ts` (utility, transform)

**Analog:** `apps/mobile/src/hooks/useClueGuidance.ts` (line 53)

**Vector Math pattern**:
```typescript
// Calculate Euclidean distance (3D Vector Distance pattern)
const dx = pos1[0] - pos2[0];
const dy = pos1[1] - pos2[1];
const dz = pos1[2] - pos2[2];
const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
```

---

### `packages/shared/src/types.ts` (model, CRUD)

**Analog:** `packages/shared/src/types.ts` (lines 148-156)

**Clue Schema pattern**:
```typescript
export interface Clue {
  id: string;
  type: ClueType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  metadata: Record<string, any>;
  requiredClueId?: string;
  // NEW for Phase 8:
  pathId?: string;
  pathSequence?: number;
}
```

---

## Shared Patterns

### Witcher Sense Highlighting
**Source:** `apps/mobile/src/components/ClueBillboard.tsx`
**Apply to:** `FootstepBillboard.tsx`
```typescript
  if (witcherSensesActive) {
    materials.push('witcher_sense_highlight');
  }
```

### Team-wide Discovery
**Source:** `apps/mobile/src/hooks/useInvestigation.ts`
**Apply to:** Path segment visibility logic
```typescript
  const discoverClue = async (clueId: string) => {
    // ...
    await mapService.recordClueDiscovery(profile.teamId, clueId);
  };
```

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `apps/mobile/src/utils/pathing.ts` (interpolation) | utility | transform | No existing path interpolation/stride generation logic. |

## Metadata

**Analog search scope:** `apps/mobile/src`, `packages/shared/src`
**Files scanned:** 15
**Pattern extraction date:** April 18, 2026
