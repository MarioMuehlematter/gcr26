# Phase 3 Plan 03: Cloud Sync & Site Management Summary

## Objective
Complete the Site Recorder by enabling GMs to name and persist the recorded world origin to the cloud.

## Substantive Deliverables
- **Firestore Cloud Sync:** Implemented `syncMapToCloud` in `MapService` to persist spatial metadata to the `spatial_maps` collection.
- **Site Naming UI:** Created `SiteNamingModal` component allowing admins to provide human-readable names for recorded sites.
- **Integrated Save Flow:** Finalized `RecorderScreen` with a complete end-to-end flow: landmark detection -> 5s locking -> site naming -> local & cloud persistence -> success feedback.

## Key Decisions
- **Firestore Collection:** Used `spatial_maps` as the central repository for world origins, following the D-03 specification.
- **Metadata Payload:** Included `targetImageId` and `serverTimestamp` (via `cloudSyncAt`) in the Firestore document to support future player relocalization.
- **Mocked Map Data:** Used a placeholder base64 string for spatial map data during development, as actual Viro map export requires specific hardware/session state not available in the current emulator/mock environment.

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
- **Map Data Placeholder:** `RecorderScreen.tsx` uses a hardcoded base64 string `bW9jay1zcGF0aWFsLW1hcC1kYXRh` for the spatial map data. This will be replaced with actual AR session data when hardware testing is performed.

## Threat Flags
| Flag | File | Description |
|------|------|-------------|
| threat_flag: client_write | `apps/mobile/src/services/mapService.ts` | Authenticated client writes to `spatial_maps` collection. Requires Firestore security rules to restrict to admins. |

## Self-Check: PASSED
- [x] `apps/mobile/src/services/mapService.ts` contains `syncMapToCloud`.
- [x] `apps/mobile/src/components/SiteNamingModal.tsx` created.
- [x] `apps/mobile/src/screens/RecorderScreen.tsx` integrates the naming modal and save flow.
- [x] Commits made for each task.
