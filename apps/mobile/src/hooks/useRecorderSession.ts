import { useState, useCallback, useRef } from 'react';

/**
 * Hook to manage the site recording session.
 * Handles the 5-second locking logic for establishing world origin.
 */
export function useRecorderSession() {
  const [locking, setLocking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [targetImageId, setTargetImageId] = useState<string | null>(null);

  /**
   * Called when a ViroARImageMarker is found.
   * Triggers the locking process if not already locked.
   */
  const onImageMarkerFound = useCallback((anchor: any) => {
    // anchor object from Viro contains anchorId, trackingMethod, etc.
    // For now, we use a fixed target or the anchor's ID if provided by Viro.
    const imageId = anchor.anchorId || 'default_marker';

    if (!locked && !locking) {
      console.log('Landmark detected. Starting locking process for:', imageId);
      setTargetImageId(imageId);
      setLocking(true);
    }
  }, [locked, locking]);

  /**
   * Resets the session state, allowing for a re-scan.
   */
  const reset = useCallback(() => {
    setLocking(false);
    setLocked(false);
    setTargetImageId(null);
  }, []);

  /**
   * Confirms the lock is complete.
   * This is typically called by the UI component (LockingProgressRing)
   * after its animation finishes.
   */
  const completeLock = useCallback(() => {
    if (locking) {
      setLocking(false);
      setLocked(true);
      console.log('World origin locked successfully.');
    }
  }, [locking]);

  /**
   * Cancels the locking process (e.g., if user moves away).
   */
  const cancelLock = useCallback(() => {
    if (locking) {
      setLocking(false);
      setTargetImageId(null);
      console.log('Locking process cancelled.');
    }
  }, [locking]);

  return {
    locking,
    locked,
    targetImageId,
    onImageMarkerFound,
    completeLock,
    cancelLock,
    reset,
  };
}
