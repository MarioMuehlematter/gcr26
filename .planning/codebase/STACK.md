# Technology Stack

**Analysis Date:** 2025-02-12

## Languages

**Primary:**
- TypeScript 5.9 - Used in `apps/mobile/`, `packages/shared/`, and root configurations.
- JavaScript ES Modules - Used in `apps/admin/` (React/JSX) and `netlify/functions/`.

## Runtime

**Environment:**
- Node.js (v20 used in CI/CD)
- Expo SDK 54 - Mobile runtime for iOS and Android.

**Package Manager:**
- NPM (with Workspaces)
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- React 19 - Admin dashboard (`apps/admin/`).
- React Native 0.81 - Mobile application framework (`apps/mobile/`).
- Vite 8.0 - Build tool and dev server for the admin app.
- Tailwind CSS 3.4 - CSS framework for the admin app.

**Testing:**
- Not detected - No test frameworks or test scripts found in `package.json` manifests.

**Build/Dev:**
- Expo CLI - Mobile development and building.
- EAS (Expo Application Services) - Mobile build and submission pipeline.
- Netlify CLI - Admin deployment and serverless functions.

## Key Dependencies

**Critical:**
- `firebase` 11.2 - Backend infrastructure (Firestore, Auth).
- `react-navigation` 7.1 - Navigation in the mobile app.
- `react-router-dom` 7.1 - Routing in the admin app.

**Infrastructure:**
- `expo-location` 19.0 - Background location tracking on mobile.
- `expo-notifications` 0.32 - Push notification management.
- `leaflet` 1.9 & `react-leaflet` 5.0 - Interactive maps in the admin dashboard.
- `@dnd-kit/core` 6.3 - Drag and drop functionality for quest ordering.

## Configuration

**Environment:**
- `dotenv` pattern - Loaded via Vite (`VITE_*`) or Expo (`EXPO_PUBLIC_*`) environment variables.
- Configured in `.env` files (see `.env.example` in `apps/admin/`, `apps/mobile/`, and root).

**Build:**
- `package.json`: NPM workspaces configuration (`apps/*`, `packages/*`).
- `tsconfig.json`: TypeScript configuration.
- `netlify.toml`: Netlify build and redirect configuration.
- `firebase.json`: Firestore and Firebase Emulator setup.
- `app.json` & `eas.json`: Expo and EAS configuration.

## Platform Requirements

**Development:**
- Node.js 20+
- NPM
- Firebase Local Emulator Suite (for Auth/Firestore local development).

**Production:**
- Admin: Netlify (Hosting & Functions).
- Mobile: Apple App Store (via TestFlight) / Android Play Store.
- Backend: Firebase (Firestore & Auth).

---

*Stack analysis: 2025-02-12*
