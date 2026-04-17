# Phase 2: Spatial Serialization - Discussion Log

**Date:** April 17, 2026
**Phase:** 02-Spatial Serialization
**Areas discussed:** Map Serialization Format, Local Storage Strategy, Relocalization Logic, Offline Sync Pattern

---

## Map Serialization Format
[auto] Selected recommended: Binary blobs (ARWorldMap/ARCore anchors).

## Local Storage Strategy
[auto] Selected recommended: MMKV + Expo FileSystem.

## Relocalization Logic
[auto] Selected recommended: Dedicated RELOCALIZING state in session hook.

## Offline Sync Pattern
[auto] Selected recommended: Versioned Mission Bundles.

---

## Claude's Discretion
- Specific binary file extension and naming convention for map blobs.

## Deferred Ideas
- Firestore sync for maps (Phase 3).
