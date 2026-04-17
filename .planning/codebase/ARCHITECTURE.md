# Architecture

**Analysis Date:** 2025-02-14

## Pattern Overview

**Overall:** Client-Server / BaaS (Backend as a Service)

**Key Characteristics:**
- **Firebase-centric:** Utilizes Firebase for authentication (Firebase Auth) and real-time database (Firestore).
- **Monorepo:** Houses multiple applications (admin web, mobile) and shared packages in a single repository.
- **Real-time Synchronization:** Leverages Firestore's real-time listeners (`onSnapshot`) to synchronize state between the admin dashboard and player mobile apps.
- **Schema-less but Typed:** Uses TypeScript interfaces in `packages/shared` to enforce data structures across the monorepo, despite Firestore being schema-less.

## Layers

**UI Layer:**
- Purpose: Provides interfaces for game administrators and players.
- Location: `apps/admin/src/` (Web), `apps/mobile/src/screens/` (Mobile).
- Contains: React and React Native components, pages/screens, and styles.
- Depends on: Application/Hook Layer.
- Used by: End users (Admins and Players).

**Application/Hook Layer:**
- Purpose: Manages business logic, authentication state, and data fetching.
- Location: `apps/admin/src/hooks/`, `apps/mobile/src/hooks/`.
- Contains: Custom React hooks like `useAuth`.
- Depends on: Service/Data Layer, Shared Layer.
- Used by: UI Layer.

**Service/Data Layer:**
- Purpose: Direct interaction with external services and data persistence.
- Location: `apps/admin/src/firebase.js`, `apps/mobile/src/firebase.ts`.
- Contains: Firebase initialization and SDK-wrapped calls.
- Depends on: External Firebase SDKs.
- Used by: Application/Hook Layer, UI Layer.

**Shared Layer:**
- Purpose: Common definitions and types used across all workspace projects.
- Location: `packages/shared/src/`.
- Contains: TypeScript interfaces and types.
- Depends on: None.
- Used by: All apps in the monorepo (`apps/admin`, `apps/mobile`).

## Data Flow

**Game Configuration Flow:**

1. Admin creates or updates games/quests/teams in `apps/admin`.
2. Data is persisted to Firestore.
3. Firestore triggers real-time updates to all connected mobile clients.

**Player Interaction Flow:**

1. Player performs an action (e.g., submits a quest answer) in `apps/mobile`.
2. Action is validated and persisted to Firestore.
3. Admin dashboard (`apps/admin`) receives the update via Firestore listeners.

**Location Tracking Flow:**

1. Mobile app runs a background task (`apps/mobile/src/tasks/locationTask.ts`).
2. Location updates are sent to Firestore (`users` collection and `trail` collection).
3. Admin views live player locations on the map (`apps/admin/src/pages/LiveMapPage.jsx`).

**State Management:**
- Distributed across Firebase (server-side state) and React `useState`/`useContext` (client-side state).
- Authentication state is managed by Firebase Auth and exposed via the `useAuth` hook.

## Key Abstractions

**`useAuth` Hook:**
- Purpose: Centralizes authentication state and user profile (including admin status) for both apps.
- Examples: `apps/admin/src/hooks/useAuth.js`, `apps/mobile/src/hooks/useAuth.ts`.
- Pattern: Custom Hook / Observer.

**`LocationTask`:**
- Purpose: Handles background location updates in the mobile app.
- Examples: `apps/mobile/src/tasks/locationTask.ts`.
- Pattern: Background Task / Worker.

## Entry Points

**Admin Web App:**
- Location: `apps/admin/src/main.jsx`
- Triggers: Browser page load.
- Responsibilities: Mounts the React application and initializes routing.

**Mobile App:**
- Location: `apps/mobile/index.ts`
- Triggers: App launch on mobile device.
- Responsibilities: Registers the root component (`App.tsx`) and initializes the Expo environment.

## Error Handling

**Strategy:** Pragmatic client-side handling.

**Patterns:**
- Try-catch blocks around asynchronous Firestore/Auth operations.
- Conditional rendering based on loading and error states.
- Basic alerts/notifications for user feedback on failure.

## Cross-Cutting Concerns

**Security:**
- Handled at the database level via Firestore Security Rules (`firestore.rules`).
- Rules enforce Role-Based Access Control (RBAC) using an `isAdmin` flag on user documents.
- Restricts write access for sensitive collections (games, quests, shopItems) to admins only.

**Logging:** Console-based logging for development; no dedicated production logging framework detected.
**Validation:** Form-level validation in both apps (e.g., `apps/admin/src/components/QuestForm.jsx`).
**Authentication:** Handled by Firebase Auth with custom user profile integration in Firestore.

---

*Architecture analysis: 2025-02-14*
