<!-- GSD:project-start source:PROJECT.md -->
## Project

**Project: Witcher Senses AR Investigation Engine**

**Core Value:** **Seamless Immersion:** Providing a stable, offline-capable digital layer that feels physically present in the real world, enabling deep narrative investigation in any environment.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9 - Used in `apps/mobile/`, `packages/shared/`, and root configurations.
- JavaScript ES Modules - Used in `apps/admin/` (React/JSX) and `netlify/functions/`.
## Runtime
- Node.js (v20 used in CI/CD)
- Expo SDK 54 - Mobile runtime for iOS and Android.
- NPM (with Workspaces)
- Lockfile: `package-lock.json` present.
## Frameworks
- React 19 - Admin dashboard (`apps/admin/`).
- React Native 0.81 - Mobile application framework (`apps/mobile/`).
- Vite 8.0 - Build tool and dev server for the admin app.
- Tailwind CSS 3.4 - CSS framework for the admin app.
- Not detected - No test frameworks or test scripts found in `package.json` manifests.
- Expo CLI - Mobile development and building.
- EAS (Expo Application Services) - Mobile build and submission pipeline.
- Netlify CLI - Admin deployment and serverless functions.
## Key Dependencies
- `firebase` 11.2 - Backend infrastructure (Firestore, Auth).
- `react-navigation` 7.1 - Navigation in the mobile app.
- `react-router-dom` 7.1 - Routing in the admin app.
- `expo-location` 19.0 - Background location tracking on mobile.
- `expo-notifications` 0.32 - Push notification management.
- `leaflet` 1.9 & `react-leaflet` 5.0 - Interactive maps in the admin dashboard.
- `@dnd-kit/core` 6.3 - Drag and drop functionality for quest ordering.
## Configuration
- `dotenv` pattern - Loaded via Vite (`VITE_*`) or Expo (`EXPO_PUBLIC_*`) environment variables.
- Configured in `.env` files (see `.env.example` in `apps/admin/`, `apps/mobile/`, and root).
- `package.json`: NPM workspaces configuration (`apps/*`, `packages/*`).
- `tsconfig.json`: TypeScript configuration.
- `netlify.toml`: Netlify build and redirect configuration.
- `firebase.json`: Firestore and Firebase Emulator setup.
- `app.json` & `eas.json`: Expo and EAS configuration.
## Platform Requirements
- Node.js 20+
- NPM
- Firebase Local Emulator Suite (for Auth/Firestore local development).
- Admin: Netlify (Hosting & Functions).
- Mobile: Apple App Store (via TestFlight) / Android Play Store.
- Backend: Firebase (Firestore & Auth).
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- PascalCase for React components and pages: `apps/admin/src/pages/LoginPage.jsx`, `apps/mobile/src/screens/HomeScreen.tsx`
- camelCase for hooks and utilities: `apps/admin/src/hooks/useAuth.js`, `apps/admin/src/utils/geocode.js`
- kebab-case for some config/meta files: `package-lock.json`, `tailwind.config.js`
- PascalCase for component functions: `export default function App() { ... }` in `apps/admin/src/App.jsx`
- camelCase for hooks and logic functions: `export async function geocodeCity(city) { ... }` in `apps/admin/src/utils/geocode.js`
- camelCase for regular variables, state, and props: `const { user, loading } = useAuth();`
- UPPER_SNAKE_CASE for constants: `const ADMIN_URL = 'https://gcr26-dev.netlify.app';` in `apps/mobile/src/screens/HomeScreen.tsx`
- PascalCase for interfaces and types: `export interface User { ... }` in `packages/shared/src/types.ts`
- camelCase for interface properties: `id: string;`, `isAdmin: boolean;`
## Code Style
- 2-space indentation (standard for JavaScript/React)
- Semi-colons used for statement termination
- Single quotes for strings: `'react-router-dom'`, `'#fff'`
- ESLint (Flat Config) in `apps/admin/eslint.config.js`
- Standard React/Hooks recommendations: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Custom rule: `no-unused-vars` ignores variables starting with uppercase or underscores: `['error', { varsIgnorePattern: '^[A-Z_]' }]`
## Import Organization
- Monorepo imports use `@gcr26/shared` alias defined in `package.json` workspaces
- No internal path aliases (like `@/`) detected in `tsconfig.json` for apps
## Error Handling
- Use of `async/await` for asynchronous operations
- Conditional returns for early exits on failure or missing data: `if (!data.length) return null;` in `apps/admin/src/utils/geocode.js`
- Loading states for UI handling: `if (loading) return <ActivityIndicator />;`
## Logging
- No formal logging framework or patterns observed. Error reporting to the user is mostly handled via UI state.
## Comments
- Section headers in large files (e.g., `// ─── Users ────────────────────────────────────────────────────────────────────` in `packages/shared/src/types.ts`)
- Explanatory comments for complex logic or reasoning.
- Minimal use of JSDoc. Brief inline comments for interface properties in `packages/shared/src/types.ts`.
## Function Design
- Components and hooks are kept relatively small and focused.
- Business logic is often extracted into hooks or shared utilities.
- Destructured objects for props in components (often implicit in React).
- Direct parameters for utility functions.
- Functional components return JSX/TSX.
- Hooks often return an object with state and methods: `{ profile, loading }`.
## Module Design
- Default exports for primary components and pages: `export default function HomeScreen() { ... }`
- Named exports for hooks, utilities, and types: `export function useAuth() { ... }`, `export interface User { ... }`
- Used in `packages/shared/src/index.ts` to export all types.
- Used in `apps/mobile/src/navigation/index.tsx` for navigation exports.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Firebase-centric:** Utilizes Firebase for authentication (Firebase Auth) and real-time database (Firestore).
- **Monorepo:** Houses multiple applications (admin web, mobile) and shared packages in a single repository.
- **Real-time Synchronization:** Leverages Firestore's real-time listeners (`onSnapshot`) to synchronize state between the admin dashboard and player mobile apps.
- **Schema-less but Typed:** Uses TypeScript interfaces in `packages/shared` to enforce data structures across the monorepo, despite Firestore being schema-less.
## Layers
- Purpose: Provides interfaces for game administrators and players.
- Location: `apps/admin/src/` (Web), `apps/mobile/src/screens/` (Mobile).
- Contains: React and React Native components, pages/screens, and styles.
- Depends on: Application/Hook Layer.
- Used by: End users (Admins and Players).
- Purpose: Manages business logic, authentication state, and data fetching.
- Location: `apps/admin/src/hooks/`, `apps/mobile/src/hooks/`.
- Contains: Custom React hooks like `useAuth`.
- Depends on: Service/Data Layer, Shared Layer.
- Used by: UI Layer.
- Purpose: Direct interaction with external services and data persistence.
- Location: `apps/admin/src/firebase.js`, `apps/mobile/src/firebase.ts`.
- Contains: Firebase initialization and SDK-wrapped calls.
- Depends on: External Firebase SDKs.
- Used by: Application/Hook Layer, UI Layer.
- Purpose: Common definitions and types used across all workspace projects.
- Location: `packages/shared/src/`.
- Contains: TypeScript interfaces and types.
- Depends on: None.
- Used by: All apps in the monorepo (`apps/admin`, `apps/mobile`).
## Data Flow
- Distributed across Firebase (server-side state) and React `useState`/`useContext` (client-side state).
- Authentication state is managed by Firebase Auth and exposed via the `useAuth` hook.
## Key Abstractions
- Purpose: Centralizes authentication state and user profile (including admin status) for both apps.
- Examples: `apps/admin/src/hooks/useAuth.js`, `apps/mobile/src/hooks/useAuth.ts`.
- Pattern: Custom Hook / Observer.
- Purpose: Handles background location updates in the mobile app.
- Examples: `apps/mobile/src/tasks/locationTask.ts`.
- Pattern: Background Task / Worker.
## Entry Points
- Location: `apps/admin/src/main.jsx`
- Triggers: Browser page load.
- Responsibilities: Mounts the React application and initializes routing.
- Location: `apps/mobile/index.ts`
- Triggers: App launch on mobile device.
- Responsibilities: Registers the root component (`App.tsx`) and initializes the Expo environment.
## Error Handling
- Try-catch blocks around asynchronous Firestore/Auth operations.
- Conditional rendering based on loading and error states.
- Basic alerts/notifications for user feedback on failure.
## Cross-Cutting Concerns
- Handled at the database level via Firestore Security Rules (`firestore.rules`).
- Rules enforce Role-Based Access Control (RBAC) using an `isAdmin` flag on user documents.
- Restricts write access for sensitive collections (games, quests, shopItems) to admins only.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
