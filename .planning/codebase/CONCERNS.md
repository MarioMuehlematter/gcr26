# Codebase Concerns

**Analysis Date:** 2025-02-13

## Tech Debt

**Shared Logic Duplication:**
- Issue: Critical utility functions and types are duplicated across the mobile and admin apps instead of being centralized in the shared package.
- Files:
  - `distanceMeters`: `apps/mobile/src/screens/GameScreen.tsx`, `apps/admin/src/pages/LiveMapPage.jsx`, `apps/admin/src/pages/LeaderboardPage.jsx`
  - `formatDuration`: `apps/mobile/src/screens/GameScreen.tsx`, `apps/admin/src/pages/GamePage.jsx`, `apps/admin/src/pages/LeaderboardPage.jsx`
  - Types (`Team`, `Game`, `Quest`): `packages/shared/src/types.ts` and `apps/mobile/src/screens/GameScreen.tsx`
- Impact: Increased maintenance burden, risk of inconsistent behavior between apps, and harder refactoring.
- Fix approach: Move shared utilities and ensure all apps use types from `packages/shared`.

**Monolithic Components:**
- Issue: Key screens and pages are implemented as massive, single-file components containing all sub-views, helpers, and complex state logic.
- Files:
  - `apps/mobile/src/screens/GameScreen.tsx` (986 lines)
  - `apps/admin/src/pages/TeamsPage.jsx` (469 lines)
  - `apps/admin/src/pages/LiveMapPage.jsx` (306 lines)
- Impact: Very difficult to test, reason about, and modify without introducing regressions. High cognitive load for developers.
- Fix approach: Break down large components into smaller, focused sub-components and custom hooks for logic.

**Prop Drilling and State Management:**
- Issue: Deeply nested sub-views within monolithic files often rely on manual prop drilling.
- Files: `apps/mobile/src/screens/GameScreen.tsx`, `apps/admin/src/pages/TeamsPage.jsx`
- Impact: Changes to state shape require updating multiple intermediate components.
- Fix approach: Implement a state management solution (e.g., Context API or dedicated store) for complex screens.

## Security Considerations

**Unprotected Push Notification API:**
- Issue: The Netlify function used to send Expo push notifications has no authorization check.
- Files: `netlify/functions/send-push.mjs`
- Risk: Malicious actors could discover the endpoint and broadcast arbitrary notifications to players if they obtain device tokens.
- Current mitigation: None.
- Recommendations: Implement a shared secret or verify Firebase Auth ID tokens in the Netlify function.

**Public Registration Endpoint:**
- Issue: The registration endpoint allows anyone to create documents.
- Files: `firestore.rules` (match `/registrations/{id}`)
- Risk: Potential for spam/DoS attacks on the Firestore database.
- Current mitigation: Only admins can read/update/delete.
- Recommendations: Implement rate limiting or recaptcha for registrations.

## Performance Bottlenecks

**Frequent Firestore Writes/Reads:**
- Issue: Real-time location tracking updates `users` and `trail` collections frequently.
- Files: `apps/mobile/src/screens/GameScreen.tsx`, `apps/mobile/src/tasks/locationTask.ts`
- Problem: Throttling is implemented (10m or 30s), but with many players, this could lead to significant Firestore costs and potential write limits if not carefully managed.
- Cause: Constant updates to `lastLocation` and `trail`.
- Improvement path: Optimize update frequency based on game state (e.g., slow down when game is paused or player is stationary).

**Unscoped User Listeners:**
- Issue: Admin pages listen to the entire `users` collection.
- Files: `apps/admin/src/pages/LeaderboardPage.jsx`
- Problem: As the number of total users in the system grows, this listener will become extremely heavy and expensive.
- Cause: `onSnapshot(collection(db, 'users'), ...)`
- Improvement path: Scope user queries to only include players in the specific game.

**O(N^2) Complexity in Spread Check:**
- Issue: Team spread calculation checks distance between every pair of team members.
- Files: `apps/mobile/src/screens/GameScreen.tsx` (`spreadTooLarge` useMemo)
- Problem: Fine for small teams, but if team sizes increase, this calculation becomes inefficient.
- Cause: Nested loops for distance calculation.

## Fragile Areas

**Location Tracking State:**
- Files: `apps/mobile/src/screens/GameScreen.tsx`, `apps/mobile/src/tasks/locationTask.ts`
- Why fragile: Logic for foreground vs. background tracking is complex and relies on manual synchronization via `AsyncStorage`.
- Safe modification: Encapsulate location logic into a dedicated service or provider.
- Test coverage: Zero.

**Game Progress Logic:**
- Files: `apps/mobile/src/screens/GameScreen.tsx` (`submitAnswer` function)
- Why fragile: Critical game logic (checking answers, advancing quests, finishing games) is handled directly in a UI component.
- Safe modification: Move game progression logic to a shared service or backend function (Firebase Functions) to ensure consistency and security.

## Missing Critical Features

**Automated Tests:**
- Problem: The codebase has no unit, integration, or E2E tests.
- Blocks: Confidence in refactoring and ensuring complex features (like location-based triggers) work as expected.

## Test Coverage Gaps

**Untested Core Logic:**
- What's not tested: Answer validation, distance calculations, game state transitions, location tracking.
- Files: `apps/mobile/src/screens/GameScreen.tsx`, `apps/admin/src/pages/GamePage.jsx`, `packages/shared/src/types.ts`
- Risk: Regressions in core gameplay or scoring could go unnoticed until a live event.
- Priority: High

---

*Concerns audit: 2025-02-13*
