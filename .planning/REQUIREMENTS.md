# Requirements: Witcher Senses AR Engine

## v1 Requirements (MVP)

### AR Core & World Mapping
- [x] **CORE-01**: Precise SLAM Anchoring - Clues stay fixed to physical surfaces with minimal drift.
- [x] **CORE-02**: Plane Detection - Footprints and decals align correctly with detected floors/walls.
- [x] **CORE-03**: Spatial Map Serialization - Save and load physical "site scans" for consistent clue placement.
- [ ] **CORE-04**: Offline Preloading - Pre-cache maps and clue data for zero-connectivity environments.

### Investigation Gameplay
- [ ] **PLAY-01**: "Witcher Sense" Activation - Visual filter/mode for clue hunting.
- [ ] **PLAY-02**: Visual Pulse/Glow - Subtle visual guidance to distant or hidden clues.
- [ ] **PLAY-03**: Footstep Trail System - Narrative pathing between investigation points.
- [ ] **PLAY-04**: Proximity Discovery - Clues reveal details only when player is within range (~2m).
- [ ] **PLAY-05**: Evidence Log - 2D UI for reviewing found clues and narrative facts.

### Admin Authoring
- [x] **ADM-01**: Mobile Site Recorder - Tool for Game Masters to scan and map a physical room.
- [x] **ADM-02**: Clue Placer - AR tool to drop and orient clues onto physical planes.
- [x] **ADM-03**: Narrative Linker - Logic to connect clue discovery to game state (Linear Storyline).

## v2 Requirements (Deferred)
- **CORE-05**: Environmental Occlusion - Hiding clues behind/under real objects (requires LiDAR).
- **CORE-06**: Lighting Estimation - Dynamic lighting for digital clues.
- **PLAY-06**: Multi-Modal Senses - Switching between Visual and Scent modes.
- **PLAY-07**: Perspective Puzzles - Clues that require physical alignment to read.
- **ADM-04**: Remote Map Review - Viewing site scans on the web dashboard.

## Out of Scope
- **Real-time Audio Senses** - Directional audio filters (Visual-first focus).
- **Procedural Clue Placement** - Relative/dynamic placement; focusing on authored arcs.
- **Active Clue Interaction** - Discovery is purely visual for v1 (no "cleaning" or "extracting").

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 4 | Complete |
| CORE-02 | Phase 1 | Complete |
| CORE-03 | Phase 2 | Complete |
| CORE-04 | Phase 11 | Pending |
| PLAY-01 | Phase 6 | Pending |
| PLAY-02 | Phase 7 | Pending |
| PLAY-03 | Phase 8 | Pending |
| PLAY-04 | Phase 9 | Pending |
| PLAY-05 | Phase 10 | Pending |
| ADM-01 | Phase 3 | Complete |
| ADM-02 | Phase 4 | Complete |
| ADM-03 | Phase 5 | Complete |
