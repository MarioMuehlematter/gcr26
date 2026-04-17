# Phase 2: Spatial Serialization - Context

**Gathered:** April 17, 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase enables the persistent storage and retrieval of physical environment maps (CORE-03). It focuses on serializing the SLAM data established in Phase 1, storing it locally on the device, and implementing the logic to "relocalize" against a previously saved map.

</domain>

<decisions>
## Implementation Decisions

### Data Persistence
- **D-01: Binary Map Blobs** - Store the raw spatial map data as binary blobs (e.g., ARWorldMap on iOS) to ensure 100% fidelity for relocalization.
- **D-02: Hybrid Storage** - Use **MMKV** for lightweight metadata (map names, coordinates, IDs) and **Expo FileSystem** for the large map binary files.
- **D-03: Versioned Maps** - Include a schema version in the map metadata to handle future engine updates.

### Relocalization
- **D-04: Relocalization State** - Add a `RELOCALIZING` state to `useARSession.ts`. The UI will display a specific "Aligning with environment..." overlay during this phase.
- **D-05: Relocalization Timeout** - Implement a 15-second timeout for relocalization; if it fails, prompt the user to scan the room again or move to a more distinct feature area.

### Offline Preparation
- **D-06: Pre-caching Pattern** - Structure the storage logic to support "Mission Bundles" where maps and clue data are downloaded together for offline play.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AR Persistence
- `.planning/research/STACK.md` - MMKV and FileSystem recommendations.
- `.planning/research/SUMMARY.md` - Executive summary of offline-first mapping.

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` - CORE-03 requirement details.
- `.planning/ROADMAP.md` - Phase 2 goals and success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/mobile/src/hooks/useARSession.ts` - Will be extended with relocalization logic.
- `apps/mobile/src/screens/ARScreen.tsx` - Will handle the "Relocalizing" overlay.

### Established Patterns
- **Async Storage** - MMKV usage should follow the pattern in `@react-native-async-storage/async-storage` if any, but MMKV is preferred for speed.

### Integration Points
- **Map Repository** - A new service or utility in `apps/mobile/src/services/mapService.ts` for disk I/O.

</code_context>

<specifics>
## Specific Ideas
- Saving a map should be a "silent" background task after the Game Master finishes a scan in future phases.

</specifics>

<deferred>
## Deferred Ideas
- **Cloud Sync** - Syncing these local maps to Firestore/Firebase Storage is deferred to Phase 3/4.
- **Multi-Map Management** - UI for listing and deleting maps is deferred.

</deferred>

---
*Phase: 02-spatial-serialization*
*Context gathered: April 17, 2026*
