import { describe, it, expect } from 'vitest';
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
  Team,
  Game,
} from '../types';

// Phase 1: TypeScript compilation tests.
// If these tests compile and run, the type system is correctly defined.
// The runtime assertions confirm the discriminated union narrows properly.

describe('GameElement discriminated union', () => {
  it('narrows quest type correctly', () => {
    const el: GameElement = {
      id: 'q1',
      type: 'quest',
      title: 'Test Quest',
      mdxContent: '# Quest',
      isActive: true,
      trigger: { type: 'sequential' },
      nextElementId: null,
      navigationHint: 'Go north',
      fenceRadius: 50,
      location: { lat: 0, lng: 0 },
      answers: ['answer'],
      hints: ['hint'],
      skillId: null,
    };

    if (el.type === 'quest') {
      // TypeScript narrows to QuestElement here
      expect(el.answers).toEqual(['answer']);
      expect(el.navigationHint).toBe('Go north');
      expect(el.skillId).toBeNull();
    }
  });

  it('narrows content type correctly', () => {
    const el: GameElement = {
      id: 'c1',
      type: 'content',
      title: 'Story',
      mdxContent: '# Story content',
      isActive: true,
      trigger: { type: 'sequential' },
      nextElementId: null,
    };

    if (el.type === 'content') {
      expect(el.mdxContent).toBe('# Story content');
    }
  });

  it('narrows reward type correctly', () => {
    const el: GameElement = {
      id: 'r1',
      type: 'reward',
      title: 'Reward!',
      mdxContent: '# Reward',
      isActive: true,
      trigger: { type: 'sequential' },
      nextElementId: null,
      rewards: [{ kind: 'score', value: 100 }],
    };

    if (el.type === 'reward') {
      expect(el.rewards).toHaveLength(1);
      expect(el.rewards[0].kind).toBe('score');
    }
  });

  it('narrows fluff type correctly', () => {
    const el: GameElement = {
      id: 'f1',
      type: 'fluff',
      title: 'Lootbox!',
      mdxContent: '',
      isActive: true,
      trigger: { type: 'sequential' },
      nextElementId: null,
      fluffStyle: 'lootbox',
      durationMs: 3000,
    };

    if (el.type === 'fluff') {
      expect(el.fluffStyle).toBe('lootbox');
      expect(el.durationMs).toBe(3000);
    }
  });

  it('exhaustive switch handles all types', () => {
    function getLabel(el: GameElement): string {
      switch (el.type) {
        case 'quest':   return `Quest: ${el.navigationHint}`;
        case 'content': return `Content: ${el.title}`;
        case 'reward':  return `Reward: ${el.rewards.length} items`;
        case 'fluff':   return `Fluff: ${el.fluffStyle}`;
      }
    }

    const content: ContentElement = {
      id: 'c2',
      type: 'content',
      title: 'Test',
      mdxContent: '',
      isActive: true,
      trigger: { type: 'sequential' },
      nextElementId: null,
    };

    expect(getLabel(content)).toBe('Content: Test');
  });
});

describe('ElementType string literals', () => {
  it('accepts valid element types', () => {
    const types: ElementType[] = ['quest', 'content', 'reward', 'fluff'];
    expect(types).toHaveLength(4);
  });
});

describe('TriggerType string literals', () => {
  it('accepts valid trigger types', () => {
    const types: TriggerType[] = ['sequential', 'location', 'manual'];
    expect(types).toHaveLength(3);
  });
});

describe('FluffStyle string literals', () => {
  it('accepts valid fluff styles', () => {
    const styles: FluffStyle[] = ['lootbox', 'celebration', 'transition'];
    expect(styles).toHaveLength(3);
  });
});

describe('RewardKind string literals', () => {
  it('accepts valid reward kinds', () => {
    const kinds: RewardKind[] = ['score', 'skill', 'item'];
    expect(kinds).toHaveLength(3);
  });
});

describe('Skill type', () => {
  it('compiles with all required fields', () => {
    const skill: Skill = {
      id: 's1',
      name: 'Map Reading',
      description: 'Navigate using maps',
      mdxContent: '# Map Reading',
      icon: '🗺️',
    };
    expect(skill.id).toBe('s1');
  });
});

describe('Team element-system fields', () => {
  it('accepts team with optional element fields', () => {
    const team: Team = {
      id: 't1',
      name: 'Red Team',
      color: '#ff0000',
      gameId: 'g1',
      memberIds: ['u1'],
      score: 0,
      currentQuestId: null,
      completedQuestIds: [],
      finishedAt: null,
      currentElementId: 'el-intro',
      completedElementIds: [],
      unlockedSkillIds: ['skill-compass'],
    };
    expect(team.currentElementId).toBe('el-intro');
    expect(team.unlockedSkillIds).toEqual(['skill-compass']);
  });

  it('accepts team without element fields (backward compat)', () => {
    const team: Team = {
      id: 't2',
      name: 'Blue Team',
      color: '#0000ff',
      gameId: 'g1',
      memberIds: ['u2'],
      score: 0,
      currentQuestId: null,
      completedQuestIds: [],
      finishedAt: null,
    };
    expect(team.currentElementId).toBeUndefined();
  });
});

describe('Game element-system fields', () => {
  it('accepts game with elementOrder', () => {
    const game: Game = {
      id: 'g1',
      name: 'Test Race',
      startDateTime: Date.now(),
      city: 'Zurich',
      cityCoordinates: { lat: 47.3769, lng: 8.5417 },
      questOrder: [],
      maxTeamSpreadMeters: null,
      pausedAt: null,
      totalPausedMs: 0,
      endedAt: null,
      elementOrder: ['el-intro', 'el-lootbox'],
    };
    expect(game.elementOrder).toHaveLength(2);
  });

  it('accepts game without elementOrder (backward compat)', () => {
    const game: Game = {
      id: 'g2',
      name: 'Legacy Race',
      startDateTime: Date.now(),
      city: 'Bern',
      cityCoordinates: { lat: 46.9480, lng: 7.4474 },
      questOrder: ['q1', 'q2'],
      maxTeamSpreadMeters: null,
      pausedAt: null,
      totalPausedMs: 0,
      endedAt: null,
    };
    expect(game.elementOrder).toBeUndefined();
  });
});
