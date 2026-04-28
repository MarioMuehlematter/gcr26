import { describe, it, expect } from 'vitest';
import { validateElement, validateSkill, validateTrigger } from '../validation';
import {
  introContent,
  lootboxFluff,
  skillReward,
  quest1,
  compassSkill,
} from './fixtures';

// ─── validateTrigger ─────────────────────────────────────────────────────────

describe('validateTrigger', () => {
  it('accepts a valid sequential trigger', () => {
    expect(validateTrigger({ type: 'sequential' })).toEqual([]);
  });

  it('accepts a valid manual trigger', () => {
    expect(validateTrigger({ type: 'manual' })).toEqual([]);
  });

  it('accepts a valid location trigger', () => {
    expect(validateTrigger({
      type: 'location',
      location: { lat: 47.3769, lng: 8.5417 },
      radius: 100,
    })).toEqual([]);
  });

  it('rejects non-object', () => {
    expect(validateTrigger('bad')).toHaveLength(1);
  });

  it('rejects unknown trigger type', () => {
    const errors = validateTrigger({ type: 'unknown' });
    expect(errors.some(e => e.includes('type'))).toBe(true);
  });

  it('rejects location trigger without location', () => {
    const errors = validateTrigger({ type: 'location', radius: 50 });
    expect(errors.some(e => e.includes('location'))).toBe(true);
  });

  it('rejects location trigger without radius', () => {
    const errors = validateTrigger({
      type: 'location',
      location: { lat: 0, lng: 0 },
    });
    expect(errors.some(e => e.includes('radius'))).toBe(true);
  });

  it('rejects location trigger with zero radius', () => {
    const errors = validateTrigger({
      type: 'location',
      location: { lat: 0, lng: 0 },
      radius: 0,
    });
    expect(errors.some(e => e.includes('radius'))).toBe(true);
  });
});

// ─── validateElement — content ───────────────────────────────────────────────

describe('validateElement — content', () => {
  it('accepts a valid content element', () => {
    expect(validateElement(introContent)).toEqual([]);
  });

  it('rejects non-object', () => {
    expect(validateElement(null)).toHaveLength(1);
    expect(validateElement(42)).toHaveLength(1);
  });

  it('rejects missing id', () => {
    const bad = { ...introContent, id: '' };
    expect(validateElement(bad).some(e => e.includes('id'))).toBe(true);
  });

  it('rejects missing title', () => {
    const bad = { ...introContent, title: '' };
    expect(validateElement(bad).some(e => e.includes('title'))).toBe(true);
  });

  it('rejects bad type', () => {
    const bad = { ...introContent, type: 'unknown' };
    expect(validateElement(bad).some(e => e.includes('type'))).toBe(true);
  });

  it('rejects non-boolean isActive', () => {
    const bad = { ...introContent, isActive: 'yes' };
    expect(validateElement(bad).some(e => e.includes('isActive'))).toBe(true);
  });

  it('rejects non-string nextElementId (number)', () => {
    const bad = { ...introContent, nextElementId: 123 };
    expect(validateElement(bad).some(e => e.includes('nextElementId'))).toBe(true);
  });

  it('accepts null nextElementId', () => {
    const ok = { ...introContent, nextElementId: null };
    expect(validateElement(ok)).toEqual([]);
  });
});

// ─── validateElement — quest ─────────────────────────────────────────────────

describe('validateElement — quest', () => {
  it('accepts a valid quest element', () => {
    expect(validateElement(quest1)).toEqual([]);
  });

  it('rejects quest with empty answers', () => {
    const bad = { ...quest1, answers: [] };
    expect(validateElement(bad).some(e => e.includes('answers'))).toBe(true);
  });

  it('rejects quest with non-array hints', () => {
    const bad = { ...quest1, hints: 'not-array' };
    expect(validateElement(bad).some(e => e.includes('hints'))).toBe(true);
  });

  it('rejects quest with bad fenceRadius', () => {
    const bad = { ...quest1, fenceRadius: -5 };
    expect(validateElement(bad).some(e => e.includes('fenceRadius'))).toBe(true);
  });

  it('rejects quest with missing location', () => {
    const bad = { ...quest1, location: null };
    expect(validateElement(bad).some(e => e.includes('location'))).toBe(true);
  });

  it('rejects quest with non-string skillId', () => {
    const bad = { ...quest1, skillId: 123 };
    expect(validateElement(bad).some(e => e.includes('skillId'))).toBe(true);
  });

  it('accepts quest with null skillId', () => {
    const ok = { ...quest1, skillId: null };
    expect(validateElement(ok)).toEqual([]);
  });
});

// ─── validateElement — reward ────────────────────────────────────────────────

describe('validateElement — reward', () => {
  it('accepts a valid reward element', () => {
    expect(validateElement(skillReward)).toEqual([]);
  });

  it('rejects non-array rewards', () => {
    const bad = { ...skillReward, rewards: 'not-array' };
    expect(validateElement(bad).some(e => e.includes('rewards'))).toBe(true);
  });

  it('rejects reward with bad kind', () => {
    const bad = {
      ...skillReward,
      rewards: [{ kind: 'gold', value: 10 }],
    };
    expect(validateElement(bad).some(e => e.includes('kind'))).toBe(true);
  });

  it('rejects reward with non-positive value', () => {
    const bad = {
      ...skillReward,
      rewards: [{ kind: 'score', value: 0 }],
    };
    expect(validateElement(bad).some(e => e.includes('value'))).toBe(true);
  });

  it('rejects skill reward without skillId', () => {
    const bad = {
      ...skillReward,
      rewards: [{ kind: 'skill', value: 1 }],
    };
    expect(validateElement(bad).some(e => e.includes('skillId'))).toBe(true);
  });

  it('rejects item reward without itemType', () => {
    const bad = {
      ...skillReward,
      rewards: [{ kind: 'item', value: 1 }],
    };
    expect(validateElement(bad).some(e => e.includes('itemType'))).toBe(true);
  });
});

// ─── validateElement — fluff ─────────────────────────────────────────────────

describe('validateElement — fluff', () => {
  it('accepts a valid fluff element', () => {
    expect(validateElement(lootboxFluff)).toEqual([]);
  });

  it('rejects unknown fluffStyle', () => {
    const bad = { ...lootboxFluff, fluffStyle: 'sparkles' };
    expect(validateElement(bad).some(e => e.includes('fluffStyle'))).toBe(true);
  });

  it('rejects non-positive durationMs', () => {
    const bad = { ...lootboxFluff, durationMs: 0 };
    expect(validateElement(bad).some(e => e.includes('durationMs'))).toBe(true);
  });
});

// ─── validateSkill ───────────────────────────────────────────────────────────

describe('validateSkill', () => {
  it('accepts a valid skill', () => {
    expect(validateSkill(compassSkill)).toEqual([]);
  });

  it('rejects non-object', () => {
    expect(validateSkill(null)).toHaveLength(1);
  });

  it('rejects missing id', () => {
    expect(validateSkill({ ...compassSkill, id: '' }).some(e => e.includes('id'))).toBe(true);
  });

  it('rejects missing name', () => {
    expect(validateSkill({ ...compassSkill, name: '' }).some(e => e.includes('name'))).toBe(true);
  });

  it('rejects non-string description', () => {
    expect(validateSkill({ ...compassSkill, description: 42 }).some(e => e.includes('description'))).toBe(true);
  });

  it('rejects non-string mdxContent', () => {
    expect(validateSkill({ ...compassSkill, mdxContent: null }).some(e => e.includes('mdxContent'))).toBe(true);
  });

  it('rejects non-string icon', () => {
    expect(validateSkill({ ...compassSkill, icon: 123 }).some(e => e.includes('icon'))).toBe(true);
  });
});
