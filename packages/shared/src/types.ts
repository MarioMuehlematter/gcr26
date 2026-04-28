// ─── Users ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;           // Firebase Auth UID
  name: string;
  email: string;
  isAdmin: boolean;
  teamId: string | null;
  pushToken: string | null;   // Expo push token for notifications
  createdAt: number;          // Unix timestamp
  lastLocation: { lat: number; lng: number; updatedAt: number } | null;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  color: string;             // hex color chosen by admin, used on map
  gameId: string;
  memberIds: string[];
  score: number;
  currentQuestId: string | null;
  completedQuestIds: string[];
  finishedAt: number | null;
  // ── Element-system fields (optional for backward compat) ──
  currentElementId?: string | null;
  completedElementIds?: string[];
  unlockedSkillIds?: string[];
}

// ─── Quests (legacy — preserved for backward compatibility) ───────────────────

export interface Quest {
  id: string;
  title: string;
  description: string;
  navigationHint: string; // shown to players outside the fence to guide them to the location
  fenceRadius: number;    // meters; player must be within this radius to see the quest
  location: GeoPoint;
  answers: string[];      // trimmed; multiple valid answers allowed
  hints: string[];
  isActive: boolean;      // admin can hide without deleting
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ─── Game Elements ────────────────────────────────────────────────────────────
// The element system generalises quests into a chain of typed nodes.
// Each element is stored as MDX and rendered by the mobile client.

export type ElementType = 'quest' | 'content' | 'reward' | 'fluff';

// How an element becomes available to a team.
export type TriggerType = 'sequential' | 'location' | 'manual';

export interface ElementTrigger {
  type: TriggerType;
  /** For location triggers: geo-fence centre. */
  location?: GeoPoint;
  /** For location triggers: radius in metres. */
  radius?: number;
}

/** Fields shared by every element. */
interface BaseElement {
  id: string;
  type: ElementType;
  title: string;
  /** MDX source rendered by the client (story text, images, animations). */
  mdxContent: string;
  isActive: boolean;
  trigger: ElementTrigger;
  /** Default next element in the chain (null = end of story). */
  nextElementId: string | null;
}

/** Asks the player for a text answer. Optionally requires a skill. */
export interface QuestElement extends BaseElement {
  type: 'quest';
  navigationHint: string;
  fenceRadius: number;
  location: GeoPoint;
  answers: string[];
  hints: string[];
  /** Skill the player must have unlocked to attempt this quest. */
  skillId: string | null;
}

/** Story / information screen — no response required. */
export interface ContentElement extends BaseElement {
  type: 'content';
}

/** Reward types that can be granted to a team. */
export type RewardKind = 'score' | 'skill' | 'item';

export interface ElementReward {
  kind: RewardKind;
  /** Score points to add, or 1 for skill/item unlock. */
  value: number;
  /** For skill rewards — ID of the skill to unlock. */
  skillId?: string;
  /** For item rewards — type of shop item to grant. */
  itemType?: ItemType;
}

/** Shows a reward screen and updates team resources in the backend. */
export interface RewardElement extends BaseElement {
  type: 'reward';
  rewards: ElementReward[];
}

export type FluffStyle = 'lootbox' | 'celebration' | 'transition';

/** Pure UI fluff — haptic feedback, animations, no game-state change. */
export interface FluffElement extends BaseElement {
  type: 'fluff';
  fluffStyle: FluffStyle;
  /** How long the animation plays before auto-advancing (ms). */
  durationMs: number;
}

/** Discriminated union of all element types. */
export type GameElement = QuestElement | ContentElement | RewardElement | FluffElement;

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  description: string;
  /** MDX tutorial content shown when the skill is first unlocked. */
  mdxContent: string;
  /** Emoji or icon name for UI display. */
  icon: string;
}

// ─── Items / Shop ─────────────────────────────────────────────────────────────

export type ItemType = 'compass' | 'curse' | 'immunity' | 'robbery';

export interface ShopItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;   // admin can toggle
}

export interface InventoryItem {
  type: ItemType;
  acquiredAt: number;
}

export interface ActiveCurse {
  fromTeamId: string;
  appliedAt: number;
  durationSeconds: number;
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

export type MessageChannel = 'global' | 'team';

export interface Message {
  id: string;
  channel: MessageChannel;
  teamId: string | null;    // null for global
  authorId: string;
  authorName: string;
  text: string;
  sentAt: number;
}

// ─── Broadcast Notifications (admin → all teams) ──────────────────────────────

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  sentAt: number;
}

// ─── Games ────────────────────────────────────────────────────────────────────

export interface Game {
  id: string;
  name: string;
  startDateTime: number;    // Unix timestamp
  city: string;
  cityCoordinates: GeoPoint;
  questOrder: string[];     // ordered list of quest IDs (subcollection) — legacy
  maxTeamSize?: number;     // optional soft limit shown in admin UI
  maxTeamSpreadMeters: number | null; // null = unlimited; blocks answer submission if exceeded
  pausedAt: number | null;  // timestamp when game was paused; null = not paused
  totalPausedMs: number;    // accumulated pause duration in ms (updated on resume)
  endedAt: number | null;   // timestamp when admin ended the game; null = not ended
  // ── Element-system fields (optional for backward compat) ──
  elementOrder?: string[];  // ordered list of element IDs (subcollection)
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface GameSettings {
  signUpOpen: boolean;
  hotlineNumber: string;
}

// ─── Event Registration ───────────────────────────────────────────────────────

export interface Registration {
  id: string;
  name: string;
  email: string;
  registeredAt: number;
  approved: boolean;
}
