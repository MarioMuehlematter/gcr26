import type {
  QuestElement,
  ContentElement,
  RewardElement,
  FluffElement,
  Skill,
} from '../types';

// ─── Skills ──────────────────────────────────────────────────────────────────

export const compassSkill: Skill = {
  id: 'skill-compass',
  name: 'Compass Reading',
  description: 'Read a compass to find bearings',
  mdxContent: '# Compass Reading\nUse the red needle…',
  icon: '🧭',
};

export const cipherSkill: Skill = {
  id: 'skill-cipher',
  name: 'Caesar Cipher',
  description: 'Decode simple substitution ciphers',
  mdxContent: '# Caesar Cipher\nShift each letter…',
  icon: '🔐',
};

export const skills: Skill[] = [compassSkill, cipherSkill];

// ─── Elements ────────────────────────────────────────────────────────────────

export const introContent: ContentElement = {
  id: 'el-intro',
  type: 'content',
  title: 'Welcome to the Race!',
  mdxContent: '# Welcome\nYour adventure begins here…',
  isActive: true,
  trigger: { type: 'sequential' },
  nextElementId: 'el-lootbox',
};

export const lootboxFluff: FluffElement = {
  id: 'el-lootbox',
  type: 'fluff',
  title: 'Mystery Box',
  mdxContent: '',
  isActive: true,
  trigger: { type: 'sequential' },
  nextElementId: 'el-skill-reward',
  fluffStyle: 'lootbox',
  durationMs: 3000,
};

export const skillReward: RewardElement = {
  id: 'el-skill-reward',
  type: 'reward',
  title: 'You learned Compass Reading!',
  mdxContent: '# New Skill\nYou can now read a compass.',
  isActive: true,
  trigger: { type: 'sequential' },
  nextElementId: 'el-quest-1',
  rewards: [
    { kind: 'skill', value: 1, skillId: 'skill-compass' },
    { kind: 'score', value: 50 },
  ],
};

export const quest1: QuestElement = {
  id: 'el-quest-1',
  type: 'quest',
  title: 'Find the Tower',
  mdxContent: '# Find the Tower\nUse your compass…',
  isActive: true,
  trigger: { type: 'location', location: { lat: 47.3769, lng: 8.5417 }, radius: 100 },
  nextElementId: 'el-celebration',
  navigationHint: 'Head north from the fountain',
  fenceRadius: 50,
  location: { lat: 47.3769, lng: 8.5417 },
  answers: ['grossmünster', 'grossmunster'],
  hints: ['It has two towers'],
  skillId: 'skill-compass',
};

export const celebrationFluff: FluffElement = {
  id: 'el-celebration',
  type: 'fluff',
  title: 'Well Done!',
  mdxContent: '',
  isActive: true,
  trigger: { type: 'sequential' },
  nextElementId: null,
  fluffStyle: 'celebration',
  durationMs: 2000,
};

export const sideQuest: QuestElement = {
  id: 'el-side-quest',
  type: 'quest',
  title: 'Hidden Gem',
  mdxContent: '# Hidden Gem\nYou found a secret!',
  isActive: true,
  trigger: { type: 'location', location: { lat: 47.3750, lng: 8.5400 }, radius: 30 },
  nextElementId: null,
  navigationHint: 'Look under the bridge',
  fenceRadius: 30,
  location: { lat: 47.3750, lng: 8.5400 },
  answers: ['bridge'],
  hints: ['Water flows beneath'],
  skillId: null,
};

/** Full ordered chain: intro → lootbox → reward → quest → celebration */
export const mainChain = [introContent, lootboxFluff, skillReward, quest1, celebrationFluff];

/** All elements including the optional side quest */
export const allElements = [...mainChain, sideQuest];
