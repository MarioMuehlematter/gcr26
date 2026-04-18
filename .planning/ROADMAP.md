# Roadmap: Witcher Senses AR Engine

## Phases

- [x] **Phase 1: AR Engine Foundation** - Initialize AR environment and plane detection. (completed 2026-04-17)
- [x] **Phase 2: Spatial Serialization** - Implement local saving and loading of SLAM maps. (completed 2026-04-17)
- [x] **Phase 3: Site Recorder Tool** - Build the GM interface for scanning physical environments. (completed 2026-04-17)
- [x] **Phase 4: Clue Placement Tool** - Create the AR tool for anchoring digital clues. (completed 2026-04-18)
- [ ] **Phase 5: Narrative State Logic** - Connect clue discovery to linear game progression.
- [ ] **Phase 6: Witcher Senses UI & Filter** - Implement the visual "hunting mode" and UI.
- [ ] **Phase 7: Clue Guidance (Pulse/Glow)** - Add visual indicators to guide players to clues.
- [ ] **Phase 8: Footstep Trails** - Implement the grounded narrative pathing system.
- [ ] **Phase 9: Proximity Discovery** - Implement range-based clue reveal and detection.
- [ ] **Phase 10: Evidence Log** - Build the 2D review system for discovered clues.
- [ ] **Phase 11: Offline Preloading** - Enable full functionality for zero-connectivity areas.

## Phase Details

### Phase 1: AR Engine Foundation
**Goal**: Initialize AR capabilities and environment awareness.
**Depends on**: Nothing
**Requirements**: CORE-02
**Success Criteria**:
  1. App opens AR camera view without performance degradation or crashes.
  2. Plane detection markers reliably appear on physical floors and walls.
  3. A digital "origin" marker remains stable in physical space when moving the camera.
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Setup ViroReact and basic navigation.
- [x] 01-02-PLAN.md — Implement AR scene and tracking monitor.
- [x] 01-03-PLAN.md — Implement plane detection and visualization.
**UI hint**: yes

### Phase 2: Spatial Serialization
**Goal**: Enable persistent storage of physical environment maps.
**Depends on**: Phase 1
**Requirements**: CORE-03
**Success Criteria**:
  1. User can export current SLAM map data to a local file.
  2. User can import a previously saved map data file to restore session.
  3. Relocalization succeeds when returning to a previously mapped room within 10 seconds.
**Plans**: 4 plans
- [x] 02-01-PLAN.md — Storage Foundation & Metadata Types.
- [x] 02-02-PLAN.md — Map Service & Binary Utilities.
- [x] 02-03-PLAN.md — Relocalization Logic & Hook Integration.
- [x] 02-04-PLAN.md — Visual Feedback & Loop Verification.

### Phase 3: Site Recorder Tool
**Goal**: Provide a mobile interface for Game Masters to map physical spaces.
**Depends on**: Phase 2
**Requirements**: ADM-01
**Success Criteria**:
  1. GM can see a visual overlay indicating which parts of the room are successfully mapped.
  2. GM receives real-time feedback (e.g. progress bar) during the scanning process.
  3. Completed scan sessions can be named and saved to the central database.
**Plans**: 3 plans
- [x] 03-01-PLAN.md — Admin Access & Foundation.
- [x] 03-02-PLAN.md — Locking Logic & Progress Feedback.
- [x] 03-03-PLAN.md — Cloud Sync & Site Management.
**UI hint**: yes

### Phase 4: Clue Placement Tool
**Goal**: Create an AR interface for anchoring digital objects on physical planes.
**Depends on**: Phase 3
**Requirements**: ADM-02, CORE-01
**Success Criteria**:
  1. GM can select a 3D asset (footprint, bloodstain) from a mobile menu.
  2. GM can "drag and drop" the asset onto a detected plane in AR with < 5cm drift.
  3. Placed assets persist their position and orientation across app restarts.
**Plans**: 3 plans
- [x] 04-01-PLAN.md — Data & Services Foundation.
- [x] 04-02-PLAN.md — Hook & UI Components.
- [x] 04-03-PLAN.md — Placement Screen & Integration.
**UI hint**: yes

### Phase 5: Narrative State Logic
**Goal**: Connect clue discovery to linear game progression.
**Depends on**: Phase 4
**Requirements**: ADM-03
**Success Criteria**:
  1. GM can define a "discovery sequence" for clues in a mission via a management UI.
  2. Clues assigned to "Step 2" are invisible to players until "Step 1" is discovered.
  3. Game state updates in Firestore automatically when a clue is flagged as discovered.
**Plans**: 3 plans
- [x] 05-01-PLAN.md — Data Model & Team State.
- [ ] 05-02-PLAN.md — Player Investigation Loop.
- [ ] 05-03-PLAN.md — GM Narrative Sequencing.

### Phase 6: Witcher Senses UI & Filter
**Goal**: Implement the visual "hunting mode" for players.
**Depends on**: Phase 1
**Requirements**: PLAY-01
**Success Criteria**:
  1. Player can toggle a high-contrast AR post-processing filter.
  2. HUD elements (compass, status indicators) adapt visually to "Witcher Sense" mode.
  3. Ambient world sounds are muffled/distorted while the sense is active.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Clue Guidance (Pulse/Glow)
**Goal**: Add visual indicators for distant or hidden clues.
**Depends on**: Phase 4, Phase 6
**Requirements**: PLAY-02
**Success Criteria**:
  1. Distant clues emit a "pulse" visible through walls in Witcher Sense mode.
  2. A "glow" effect appears on clues when they enter the player's field of view.
  3. Pulse frequency increases as the player gets closer to the clue (visual sonar).
**Plans**: TBD

### Phase 8: Footstep Trails
**Goal**: Create narrative paths between investigation points.
**Depends on**: Phase 4, Phase 7
**Requirements**: PLAY-03
**Success Criteria**:
  1. A series of footprint decals are rendered between two anchor points.
  2. Footprints align correctly with the floor surface without "floating".
  3. The trail direction correctly points from the source clue to the destination clue.
**Plans**: TBD

### Phase 9: Proximity Discovery
**Goal**: Implement interactive range-based clue reveal.
**Depends on**: Phase 7
**Requirements**: PLAY-04
**Success Criteria**:
  1. Clues remain "hidden" (low opacity or placeholder) until player is within 5 meters.
  2. Full clue detail (narrative text, high-res model) triggers at < 2 meters.
  3. "Discovery" event fires only when player looks directly at the clue within range.
**Plans**: TBD

### Phase 10: Evidence Log
**Goal**: Build a review system for collected narrative facts.
**Depends on**: Phase 5, Phase 9
**Requirements**: PLAY-05
**Success Criteria**:
  1. Player can access a dedicated UI screen listing all discovered clues.
  2. Each entry shows a thumbnail, timestamp, and the clue's narrative description.
  3. New entries are visually highlighted until viewed by the player.
**Plans**: TBD
**UI hint**: yes

### Phase 11: Offline Preloading
**Goal**: Ensure functionality for zero-connectivity environments.
**Depends on**: Phase 2, Phase 10
**Requirements**: CORE-04
**Success Criteria**:
  1. App can download all maps and assets for a mission to local storage (MMKV/Filesystem).
  2. Player can start and complete an investigation while in Airplane Mode.
  3. Discovery events are queued locally and synced once connectivity is restored.
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. AR Engine Foundation | 3/3 | Complete    | 2026-04-17 |
| 2. Spatial Serialization | 4/4 | Complete    | 2026-04-17 |
| 3. Site Recorder Tool | 3/3 | Complete    | 2026-04-17 |
| 4. Clue Placement Tool | 3/3 | Complete    | 2026-04-18 |
| 5. Narrative State Logic | 1/3 | In Progress|  |
| 6. Witcher Senses UI & Filter | 0/0 | Not started | - |
| 7. Clue Guidance (Pulse/Glow) | 0/0 | Not started | - |
| 8. Footstep Trails | 0/0 | Not started | - |
| 9. Proximity Discovery | 0/0 | Not started | - |
| 10. Evidence Log | 0/0 | Not started | - |
| 11. Offline Preloading | 0/0 | Not started | - |
