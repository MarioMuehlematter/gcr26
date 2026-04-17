# Codebase Structure

**Analysis Date:** 2025-02-14

## Directory Layout

```
gcr26/
├── apps/
│   ├── admin/          # Admin web application (React + Vite)
│   └── mobile/         # Player mobile application (React Native + Expo)
├── packages/
│   └── shared/         # Shared logic and types
├── netlify/
│   └── functions/      # Serverless functions (Push notifications)
├── local/              # Utility scripts and test data
├── firebase.json       # Firebase configuration
└── firestore.rules     # Firestore security rules
```

## Directory Purposes

**`apps/admin`:**
- Purpose: Web-based dashboard for game administrators to manage games, teams, and quests.
- Contains: React components, hooks, and pages.
- Key files: `apps/admin/src/main.jsx`, `apps/admin/src/App.jsx`.

**`apps/mobile`:**
- Purpose: Cross-platform mobile app for players to participate in the game.
- Contains: React Native components, screens, and background tasks.
- Key files: `apps/mobile/App.tsx`, `apps/mobile/src/navigation/index.tsx`, `apps/mobile/src/tasks/locationTask.ts`.

**`packages/shared`:**
- Purpose: Shared resources used by both the admin and mobile applications.
- Contains: TypeScript type definitions and interfaces.
- Key files: `packages/shared/src/types.ts`.

**`netlify/functions`:**
- Purpose: Backend logic that cannot or should not run on the client.
- Contains: Node.js/MJS functions.
- Key files: `netlify/functions/send-push.mjs`.

## Key File Locations

**Entry Points:**
- `apps/admin/src/main.jsx`: Admin web app entry point.
- `apps/mobile/index.ts`: Mobile app entry point.

**Configuration:**
- `firebase.json`: Root Firebase configuration.
- `apps/admin/vite.config.js`: Vite configuration for the admin app.
- `apps/mobile/app.json`: Expo configuration for the mobile app.

**Core Logic:**
- `apps/admin/src/hooks/useAuth.js`: Authentication logic (Admin).
- `apps/mobile/src/hooks/useAuth.ts`: Authentication logic (Mobile).
- `apps/mobile/src/tasks/locationTask.ts`: Background location tracking logic.

**Testing:**
- `local/test-players.md`: Documentation for test player accounts.

## Naming Conventions

**Files:**
- React Components/Pages: PascalCase (e.g., `QuestForm.jsx`, `QuestsPage.jsx`).
- Hooks: camelCase starting with `use` (e.g., `useAuth.js`).
- Scripts/Functions: kebab-case or camelCase (e.g., `send-push.mjs`, `seed-players.mjs`).

**Directories:**
- Feature-based grouping: `components/`, `pages/`, `hooks/`, `screens/`.

## Where to Add New Code

**New Feature (Admin):**
- Primary code: `apps/admin/src/pages/`
- Shared components: `apps/admin/src/components/`

**New Feature (Mobile):**
- Primary code: `apps/mobile/src/screens/`
- Shared components: `apps/mobile/src/components/`

**New Shared Type:**
- Implementation: `packages/shared/src/types.ts`

**Utilities:**
- Shared helpers (Web): `apps/admin/src/utils/`
- Shared helpers (Mobile): `apps/mobile/src/utils/`

## Special Directories

**`local/`:**
- Purpose: Contains scripts for database seeding and testing documentation.
- Generated: No
- Committed: Yes

**`netlify/`:**
- Purpose: Contains serverless functions deployed to Netlify.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2025-02-14*
