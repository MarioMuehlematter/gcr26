# External Integrations

**Analysis Date:** 2025-02-12

## APIs & External Services

**Firebase Services:**
- Auth & Firestore - Primary backend infrastructure.
  - SDK: `firebase` npm package.
  - Auth Config: Admin (`apps/admin/src/firebase.js`), Mobile (`apps/mobile/src/firebase.ts`).

**Push Notifications:**
- Expo Push Notification Service - Used for sending notifications from the backend.
  - Client: `fetch` call in `netlify/functions/send-push.mjs`.
  - Endpoint: `https://exp.host/--/api/v2/push/send`.

**Geocoding:**
- OpenStreetMap Nominatim - Used for translating city names into coordinates.
  - Client: `fetch` call in `apps/admin/src/utils/geocode.js`.
  - Endpoint: `https://nominatim.openstreetmap.org/search`.

## Data Storage

**Databases:**
- Firebase Firestore (Cloud NoSQL)
  - Client: `@firebase/firestore` via `firebase` bundle.
  - Persistence: Managed via Firebase SDK.

**File Storage:**
- None detected - `firebase.storage` is configured in `firebase.js` but not utilized in any active components found.

**Caching / Local Storage:**
- `AsyncStorage` (`@react-native-async-storage/async-storage`) - Used for session and game state persistence in `apps/mobile/`.
- Browser `localStorage` - Default persistence for Firebase Auth in `apps/admin/`.

## Authentication & Identity

**Auth Provider:**
- Firebase Auth
  - Implementation: Email/Password (implied by initialization, though specific UI forms were not deeply audited).
  - Persistence: Mobile uses `getReactNativePersistence` with `AsyncStorage`.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Standard console logging.

## CI/CD & Deployment

**Hosting:**
- Netlify - Hosts the React Admin dashboard and serverless functions (`/api/send-push`).
- Firebase - Hosts the database and authentication services.

**CI Pipeline:**
- GitHub Actions - Configured in `.github/workflows/ci.yml` for pull request build checks.
- EAS Build & Submit - Used for building and deploying mobile apps to TestFlight (`apps/mobile/scripts/ship.sh`).

## Environment Configuration

**Required env vars:**
- `VITE_FIREBASE_*` (Admin): `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`.
- `EXPO_PUBLIC_FIREBASE_*` (Mobile): Same keys as above, prefixed for Expo.

**Secrets location:**
- Netlify Environment Variables (Admin build).
- EAS Secrets or local `.env` (Mobile build via `ship.sh`).
- GitHub Secrets (CI pipeline).

## Webhooks & Callbacks

**Incoming:**
- `/api/send-push` (Netlify Function) - Internal API for triggering push notifications.

**Outgoing:**
- Expo Push Service calls.

---

*Integration audit: 2025-02-12*
