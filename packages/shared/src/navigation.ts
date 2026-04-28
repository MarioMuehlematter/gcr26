import type {
  GameElement,
  ElementTrigger,
  GeoPoint,
  Skill,
} from './types';

// ─── Navigation helpers ──────────────────────────────────────────────────────

/** Haversine distance in metres between two geo-points. */
export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const R = 6_371_000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Check whether a location trigger is satisfied. */
export function isLocationTriggerMet(
  trigger: ElementTrigger,
  playerLocation: GeoPoint,
): boolean {
  if (trigger.type !== 'location') return true;
  if (!trigger.location || !trigger.radius) return false;
  return distanceMeters(trigger.location, playerLocation) <= trigger.radius;
}

// ─── Element chain resolution ────────────────────────────────────────────────

export interface ChainContext {
  completedElementIds: string[];
  unlockedSkillIds: string[];
  playerLocation: GeoPoint | null;
}

/**
 * Given the ordered element list and the team's progress, resolve the next
 * element the team should see. Returns `null` when the chain is finished.
 */
export function resolveNextElement(
  elements: GameElement[],
  ctx: ChainContext,
): GameElement | null {
  for (const el of elements) {
    if (!el.isActive) continue;
    if (ctx.completedElementIds.includes(el.id)) continue;

    // Check trigger constraints
    if (el.trigger.type === 'location' && ctx.playerLocation) {
      if (!isLocationTriggerMet(el.trigger, ctx.playerLocation)) continue;
    }

    // Check skill prerequisite for quest elements
    if (el.type === 'quest' && el.skillId) {
      if (!ctx.unlockedSkillIds.includes(el.skillId)) continue;
    }

    return el;
  }
  return null;
}

/**
 * Build the full ordered chain starting from a root element, following
 * `nextElementId` links. Returns an array of element IDs in traversal order.
 * Detects cycles and stops.
 */
export function buildChain(
  elementsById: Map<string, GameElement>,
  startId: string,
): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();
  let currentId: string | null = startId;

  while (currentId && !visited.has(currentId)) {
    const el = elementsById.get(currentId);
    if (!el) break;
    visited.add(currentId);
    chain.push(currentId);
    currentId = el.nextElementId;
  }

  return chain;
}

// ─── Chain validation ────────────────────────────────────────────────────────

export interface ChainValidationError {
  elementId: string;
  message: string;
}

/**
 * Validate an element chain for structural issues:
 * - Dangling nextElementId references
 * - Cycles
 * - Reward elements referencing non-existent skills
 * - Quest elements referencing non-existent skills
 */
export function validateChain(
  elements: GameElement[],
  skills: Skill[],
): ChainValidationError[] {
  const errors: ChainValidationError[] = [];
  const elementIds = new Set(elements.map(e => e.id));
  const skillIds = new Set(skills.map(s => s.id));

  for (const el of elements) {
    // Dangling next link
    if (el.nextElementId && !elementIds.has(el.nextElementId)) {
      errors.push({
        elementId: el.id,
        message: `nextElementId "${el.nextElementId}" does not exist`,
      });
    }

    // Location trigger validation
    if (el.trigger.type === 'location') {
      if (!el.trigger.location) {
        errors.push({
          elementId: el.id,
          message: 'Location trigger is missing a location',
        });
      }
      if (!el.trigger.radius || el.trigger.radius <= 0) {
        errors.push({
          elementId: el.id,
          message: 'Location trigger requires a positive radius',
        });
      }
    }

    // Quest-specific checks
    if (el.type === 'quest') {
      if (el.skillId && !skillIds.has(el.skillId)) {
        errors.push({
          elementId: el.id,
          message: `skillId "${el.skillId}" does not exist`,
        });
      }
      if (el.answers.length === 0) {
        errors.push({
          elementId: el.id,
          message: 'Quest must have at least one answer',
        });
      }
    }

    // Reward-specific checks
    if (el.type === 'reward') {
      for (const r of el.rewards) {
        if (r.kind === 'skill' && r.skillId && !skillIds.has(r.skillId)) {
          errors.push({
            elementId: el.id,
            message: `Reward references non-existent skill "${r.skillId}"`,
          });
        }
        if (r.value <= 0) {
          errors.push({
            elementId: el.id,
            message: 'Reward value must be positive',
          });
        }
      }
    }

    // Fluff-specific checks
    if (el.type === 'fluff') {
      if (el.durationMs <= 0) {
        errors.push({
          elementId: el.id,
          message: 'Fluff durationMs must be positive',
        });
      }
    }
  }

  // Cycle detection: walk each element's chain
  for (const el of elements) {
    const visited = new Set<string>();
    let cur: string | null = el.id;
    while (cur) {
      if (visited.has(cur)) {
        errors.push({
          elementId: el.id,
          message: `Cycle detected involving element "${cur}"`,
        });
        break;
      }
      visited.add(cur);
      const next = elements.find(e => e.id === cur);
      cur = next?.nextElementId ?? null;
    }
  }

  return errors;
}
