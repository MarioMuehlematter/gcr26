import type {
  GameElement,
  QuestElement,
  ContentElement,
  RewardElement,
  FluffElement,
  ElementType,
  TriggerType,
  FluffStyle,
  RewardKind,
  Skill,
} from './types';

// ─── Schema validation for Firestore documents ──────────────────────────────
// These validators check that a plain object (e.g. from Firestore) conforms
// to the expected shape before it is used in the app. They return a list of
// human-readable error strings (empty = valid).

const ELEMENT_TYPES: ElementType[] = ['quest', 'content', 'reward', 'fluff'];
const TRIGGER_TYPES: TriggerType[] = ['sequential', 'location', 'manual'];
const FLUFF_STYLES: FluffStyle[] = ['lootbox', 'celebration', 'transition'];
const REWARD_KINDS: RewardKind[] = ['score', 'skill', 'item'];

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export function validateTrigger(obj: unknown, path = 'trigger'): string[] {
  const errors: string[] = [];
  if (!isObject(obj)) return [`${path} must be an object`];

  if (!TRIGGER_TYPES.includes(obj.type as TriggerType)) {
    errors.push(`${path}.type must be one of: ${TRIGGER_TYPES.join(', ')}`);
  }

  if (obj.type === 'location') {
    if (!isObject(obj.location)) {
      errors.push(`${path}.location must be a {lat, lng} object`);
    } else {
      if (!isNumber(obj.location.lat)) errors.push(`${path}.location.lat must be a number`);
      if (!isNumber(obj.location.lng)) errors.push(`${path}.location.lng must be a number`);
    }
    if (!isNumber(obj.radius) || (obj.radius as number) <= 0) {
      errors.push(`${path}.radius must be a positive number`);
    }
  }

  return errors;
}

// ─── Base element fields ─────────────────────────────────────────────────────

function validateBase(obj: Record<string, unknown>, path = 'element'): string[] {
  const errors: string[] = [];

  if (!isString(obj.id) || obj.id === '') errors.push(`${path}.id is required`);
  if (!ELEMENT_TYPES.includes(obj.type as ElementType)) {
    errors.push(`${path}.type must be one of: ${ELEMENT_TYPES.join(', ')}`);
  }
  if (!isString(obj.title) || obj.title === '') errors.push(`${path}.title is required`);
  if (!isString(obj.mdxContent)) errors.push(`${path}.mdxContent must be a string`);
  if (!isBoolean(obj.isActive)) errors.push(`${path}.isActive must be a boolean`);
  if (obj.nextElementId !== null && !isString(obj.nextElementId)) {
    errors.push(`${path}.nextElementId must be a string or null`);
  }

  errors.push(...validateTrigger(obj.trigger, `${path}.trigger`));
  return errors;
}

// ─── Per-type validators ─────────────────────────────────────────────────────

function validateQuestFields(obj: Record<string, unknown>, path = 'element'): string[] {
  const errors: string[] = [];
  if (!isString(obj.navigationHint)) errors.push(`${path}.navigationHint must be a string`);
  if (!isNumber(obj.fenceRadius) || (obj.fenceRadius as number) <= 0) {
    errors.push(`${path}.fenceRadius must be a positive number`);
  }
  if (!isObject(obj.location)) {
    errors.push(`${path}.location must be a {lat, lng} object`);
  } else {
    if (!isNumber((obj.location as Record<string, unknown>).lat)) errors.push(`${path}.location.lat must be a number`);
    if (!isNumber((obj.location as Record<string, unknown>).lng)) errors.push(`${path}.location.lng must be a number`);
  }
  if (!Array.isArray(obj.answers) || obj.answers.length === 0) {
    errors.push(`${path}.answers must be a non-empty array`);
  }
  if (!Array.isArray(obj.hints)) {
    errors.push(`${path}.hints must be an array`);
  }
  if (obj.skillId !== null && !isString(obj.skillId)) {
    errors.push(`${path}.skillId must be a string or null`);
  }
  return errors;
}

function validateRewardFields(obj: Record<string, unknown>, path = 'element'): string[] {
  const errors: string[] = [];
  if (!Array.isArray(obj.rewards)) {
    return [`${path}.rewards must be an array`];
  }
  for (let i = 0; i < obj.rewards.length; i++) {
    const r = obj.rewards[i];
    const rp = `${path}.rewards[${i}]`;
    if (!isObject(r)) { errors.push(`${rp} must be an object`); continue; }
    if (!REWARD_KINDS.includes(r.kind as RewardKind)) {
      errors.push(`${rp}.kind must be one of: ${REWARD_KINDS.join(', ')}`);
    }
    if (!isNumber(r.value) || (r.value as number) <= 0) {
      errors.push(`${rp}.value must be a positive number`);
    }
    if (r.kind === 'skill' && !isString(r.skillId)) {
      errors.push(`${rp}.skillId is required for skill rewards`);
    }
    if (r.kind === 'item' && !isString(r.itemType)) {
      errors.push(`${rp}.itemType is required for item rewards`);
    }
  }
  return errors;
}

function validateFluffFields(obj: Record<string, unknown>, path = 'element'): string[] {
  const errors: string[] = [];
  if (!FLUFF_STYLES.includes(obj.fluffStyle as FluffStyle)) {
    errors.push(`${path}.fluffStyle must be one of: ${FLUFF_STYLES.join(', ')}`);
  }
  if (!isNumber(obj.durationMs) || (obj.durationMs as number) <= 0) {
    errors.push(`${path}.durationMs must be a positive number`);
  }
  return errors;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate a plain object as a GameElement.
 * Returns an empty array if the document is valid.
 */
export function validateElement(obj: unknown): string[] {
  if (!isObject(obj)) return ['Element must be an object'];

  const errors = validateBase(obj);
  if (errors.length > 0) return errors; // base must pass first

  switch (obj.type) {
    case 'quest':   errors.push(...validateQuestFields(obj)); break;
    case 'content': break; // no extra fields
    case 'reward':  errors.push(...validateRewardFields(obj)); break;
    case 'fluff':   errors.push(...validateFluffFields(obj)); break;
  }

  return errors;
}

/**
 * Validate a plain object as a Skill document.
 */
export function validateSkill(obj: unknown): string[] {
  if (!isObject(obj)) return ['Skill must be an object'];
  const errors: string[] = [];
  if (!isString(obj.id) || obj.id === '') errors.push('skill.id is required');
  if (!isString(obj.name) || obj.name === '') errors.push('skill.name is required');
  if (!isString(obj.description)) errors.push('skill.description must be a string');
  if (!isString(obj.mdxContent)) errors.push('skill.mdxContent must be a string');
  if (!isString(obj.icon)) errors.push('skill.icon must be a string');
  return errors;
}
