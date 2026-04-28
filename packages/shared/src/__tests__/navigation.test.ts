import { describe, it, expect } from 'vitest';
import {
  distanceMeters,
  isLocationTriggerMet,
  resolveNextElement,
  buildChain,
  validateChain,
} from '../navigation';
import type { GameElement } from '../types';
import {
  introContent,
  lootboxFluff,
  skillReward,
  quest1,
  celebrationFluff,
  sideQuest,
  mainChain,
  allElements,
  skills,
  compassSkill,
} from './fixtures';

// ─── distanceMeters ──────────────────────────────────────────────────────────

describe('distanceMeters', () => {
  it('returns 0 for the same point', () => {
    const p = { lat: 47.3769, lng: 8.5417 };
    expect(distanceMeters(p, p)).toBe(0);
  });

  it('returns roughly correct distance (Zurich HB ↔ ETH)', () => {
    const hb = { lat: 47.3783, lng: 8.5403 };
    const eth = { lat: 47.3764, lng: 8.5482 };
    const d = distanceMeters(hb, eth);
    // ~600 m in reality
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(900);
  });
});

// ─── isLocationTriggerMet ────────────────────────────────────────────────────

describe('isLocationTriggerMet', () => {
  it('returns true for non-location triggers', () => {
    expect(isLocationTriggerMet({ type: 'sequential' }, { lat: 0, lng: 0 })).toBe(true);
    expect(isLocationTriggerMet({ type: 'manual' }, { lat: 0, lng: 0 })).toBe(true);
  });

  it('returns true when player is inside the radius', () => {
    const trigger = quest1.trigger;
    const nearbyPlayer = { lat: 47.3769, lng: 8.5417 };
    expect(isLocationTriggerMet(trigger, nearbyPlayer)).toBe(true);
  });

  it('returns false when player is outside the radius', () => {
    const trigger = quest1.trigger;
    const farPlayer = { lat: 48.0, lng: 9.0 };
    expect(isLocationTriggerMet(trigger, farPlayer)).toBe(false);
  });

  it('returns false when location trigger is missing location', () => {
    expect(isLocationTriggerMet({ type: 'location' }, { lat: 0, lng: 0 })).toBe(false);
  });
});

// ─── resolveNextElement ──────────────────────────────────────────────────────

describe('resolveNextElement', () => {
  it('returns the first active element when nothing is completed', () => {
    const next = resolveNextElement(mainChain, {
      completedElementIds: [],
      unlockedSkillIds: [],
      playerLocation: null,
    });
    expect(next?.id).toBe('el-intro');
  });

  it('skips completed elements', () => {
    const next = resolveNextElement(mainChain, {
      completedElementIds: ['el-intro', 'el-lootbox'],
      unlockedSkillIds: [],
      playerLocation: null,
    });
    expect(next?.id).toBe('el-skill-reward');
  });

  it('skips inactive elements', () => {
    const modified = mainChain.map(el =>
      el.id === 'el-intro' ? { ...el, isActive: false } : el,
    );
    const next = resolveNextElement(modified, {
      completedElementIds: [],
      unlockedSkillIds: [],
      playerLocation: null,
    });
    expect(next?.id).toBe('el-lootbox');
  });

  it('skips quest when required skill is missing', () => {
    const next = resolveNextElement(mainChain, {
      completedElementIds: ['el-intro', 'el-lootbox', 'el-skill-reward'],
      unlockedSkillIds: [], // compass skill NOT unlocked
      playerLocation: { lat: 47.3769, lng: 8.5417 },
    });
    // quest1 requires skill-compass, so it should be skipped
    expect(next?.id).toBe('el-celebration');
  });

  it('returns quest when required skill is unlocked and player is near', () => {
    const next = resolveNextElement(mainChain, {
      completedElementIds: ['el-intro', 'el-lootbox', 'el-skill-reward'],
      unlockedSkillIds: ['skill-compass'],
      playerLocation: { lat: 47.3769, lng: 8.5417 },
    });
    expect(next?.id).toBe('el-quest-1');
  });

  it('skips location-triggered element when player is far away', () => {
    const next = resolveNextElement(mainChain, {
      completedElementIds: ['el-intro', 'el-lootbox', 'el-skill-reward'],
      unlockedSkillIds: ['skill-compass'],
      playerLocation: { lat: 48.0, lng: 9.0 }, // far away
    });
    // quest1 has location trigger; player is far, so skip to celebration
    expect(next?.id).toBe('el-celebration');
  });

  it('returns null when all elements are completed', () => {
    const allIds = mainChain.map(el => el.id);
    const next = resolveNextElement(mainChain, {
      completedElementIds: allIds,
      unlockedSkillIds: [],
      playerLocation: null,
    });
    expect(next).toBeNull();
  });
});

// ─── buildChain ──────────────────────────────────────────────────────────────

describe('buildChain', () => {
  it('follows nextElementId links to build the full chain', () => {
    const map = new Map(allElements.map(el => [el.id, el]));
    const chain = buildChain(map, 'el-intro');
    expect(chain).toEqual([
      'el-intro',
      'el-lootbox',
      'el-skill-reward',
      'el-quest-1',
      'el-celebration',
    ]);
  });

  it('stops at null nextElementId', () => {
    const map = new Map(allElements.map(el => [el.id, el]));
    const chain = buildChain(map, 'el-celebration');
    expect(chain).toEqual(['el-celebration']);
  });

  it('stops at a dangling reference', () => {
    const map = new Map(allElements.map(el => [el.id, el]));
    const broken: GameElement = {
      ...introContent,
      id: 'el-broken',
      nextElementId: 'nonexistent',
    };
    map.set('el-broken', broken);
    const chain = buildChain(map, 'el-broken');
    expect(chain).toEqual(['el-broken']);
  });

  it('detects cycles and stops', () => {
    const cycleA: GameElement = {
      ...introContent,
      id: 'cycle-a',
      nextElementId: 'cycle-b',
    };
    const cycleB: GameElement = {
      ...introContent,
      id: 'cycle-b',
      nextElementId: 'cycle-a',
    };
    const map = new Map<string, GameElement>([
      ['cycle-a', cycleA],
      ['cycle-b', cycleB],
    ]);
    const chain = buildChain(map, 'cycle-a');
    expect(chain).toEqual(['cycle-a', 'cycle-b']);
  });
});

// ─── validateChain ───────────────────────────────────────────────────────────

describe('validateChain', () => {
  it('returns no errors for a valid chain', () => {
    const errors = validateChain(mainChain, skills);
    expect(errors).toEqual([]);
  });

  it('detects dangling nextElementId', () => {
    const broken: GameElement[] = [
      { ...introContent, nextElementId: 'nonexistent' },
    ];
    const errors = validateChain(broken, []);
    expect(errors.some(e => e.message.includes('nonexistent'))).toBe(true);
  });

  it('detects quest with no answers', () => {
    const noAnswers: GameElement[] = [
      { ...quest1, answers: [], nextElementId: null },
    ];
    const errors = validateChain(noAnswers, skills);
    expect(errors.some(e => e.message.includes('at least one answer'))).toBe(true);
  });

  it('detects quest referencing non-existent skill', () => {
    const badSkill: GameElement[] = [
      { ...quest1, skillId: 'skill-nonexistent', nextElementId: null },
    ];
    const errors = validateChain(badSkill, skills);
    expect(errors.some(e => e.message.includes('skill-nonexistent'))).toBe(true);
  });

  it('detects reward referencing non-existent skill', () => {
    const badReward: GameElement[] = [
      {
        ...skillReward,
        nextElementId: null,
        rewards: [{ kind: 'skill', value: 1, skillId: 'skill-nope' }],
      },
    ];
    const errors = validateChain(badReward, skills);
    expect(errors.some(e => e.message.includes('skill-nope'))).toBe(true);
  });

  it('detects negative reward value', () => {
    const negReward: GameElement[] = [
      {
        ...skillReward,
        nextElementId: null,
        rewards: [{ kind: 'score', value: -10 }],
      },
    ];
    const errors = validateChain(negReward, []);
    expect(errors.some(e => e.message.includes('positive'))).toBe(true);
  });

  it('detects fluff with non-positive duration', () => {
    const badFluff: GameElement[] = [
      { ...lootboxFluff, durationMs: 0, nextElementId: null },
    ];
    const errors = validateChain(badFluff, []);
    expect(errors.some(e => e.message.includes('durationMs'))).toBe(true);
  });

  it('detects location trigger missing location', () => {
    const badTrigger: GameElement[] = [
      {
        ...quest1,
        trigger: { type: 'location' },
        nextElementId: null,
      },
    ];
    const errors = validateChain(badTrigger, skills);
    expect(errors.some(e => e.message.includes('missing a location'))).toBe(true);
  });

  it('detects cycles', () => {
    const cycleA: GameElement = { ...introContent, id: 'c-a', nextElementId: 'c-b' };
    const cycleB: GameElement = { ...lootboxFluff, id: 'c-b', nextElementId: 'c-a' };
    const errors = validateChain([cycleA, cycleB], []);
    expect(errors.some(e => e.message.includes('Cycle'))).toBe(true);
  });
});
