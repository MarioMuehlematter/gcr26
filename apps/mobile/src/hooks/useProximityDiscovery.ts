import { useState, useEffect, useMemo, useRef } from 'react';
import { Clue } from '@gcr26/shared';
import { useClueGuidance } from './useClueGuidance';
import { useInvestigation } from './useInvestigation';

interface CameraTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  forward?: [number, number, number];
}

interface ProximityDiscoveryResult {
  isFocused: boolean;
  discoveryProgress: number;
  focusTargetId: string | null;
}

const DISCOVERY_RANGE = 1.5; // meters
const FOV_THRESHOLD = 15; // degrees
const FOCUS_DURATION = 1000; // ms

/**
 * Hook to manage auto-discovery of clues based on proximity and focus.
 * 
 * @param witcherSensesActive Whether Witcher Senses are currently active.
 * @param placedClues List of all placed clues in the scene.
 * @param discoveredClueIds List of IDs of clues already discovered by the team.
 * @param cameraTransform Current transform of the AR camera.
 * @returns { isFocused, discoveryProgress, focusTargetId }
 */
export function useProximityDiscovery(
  witcherSensesActive: boolean,
  placedClues: Clue[],
  discoveredClueIds: string[],
  cameraTransform: CameraTransform | null
): ProximityDiscoveryResult {
  const { discoverClue } = useInvestigation();
  
  // Calculate distance and angle to the next clue
  const { nextClueId, distance, angle } = useClueGuidance(
    placedClues,
    discoveredClueIds,
    cameraTransform
  );

  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDiscoveredId = useRef<string | null>(null);

  // Thresholds: discoveryRange = 1.5m, fovThreshold = 15 degrees.
  const isFocused = useMemo(() => {
    if (!witcherSensesActive || !nextClueId || distance === null || angle === null) {
      return false;
    }
    
    // Logic: If witcherSensesActive AND distance <= discoveryRange AND Math.abs(angle) <= fovThreshold AND !isDiscovered
    // (isDiscovered check is implicit because nextClueId only returns undiscovered clues)
    return distance <= DISCOVERY_RANGE && Math.abs(angle) <= FOV_THRESHOLD;
  }, [witcherSensesActive, nextClueId, distance, angle]);

  useEffect(() => {
    if (isFocused) {
      // Start/Continue incrementing progress from 0 to 1 over 1000ms.
      if (!intervalRef.current) {
        const updateFrequency = 100; // Update every 100ms
        const step = updateFrequency / FOCUS_DURATION;
        
        intervalRef.current = setInterval(() => {
          setDiscoveryProgress((prev) => {
            if (prev >= 1) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              return 1;
            }
            return Math.min(1, prev + step);
          });
        }, updateFrequency);
      }
    } else {
      // Else: Reset progress to 0.
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDiscoveryProgress(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFocused]);

  // Task 2: Integrate Discovery Trigger
  // When progress reaches 1.0, call discoverClue(focusTargetId)
  useEffect(() => {
    if (discoveryProgress === 1 && nextClueId && nextClueId !== lastDiscoveredId.current) {
      // Ensure the trigger only fires once per clue discovery
      lastDiscoveredId.current = nextClueId;
      discoverClue(nextClueId).catch(err => {
        console.error('Discovery trigger failed:', err);
        // Reset ref so we can try again if it failed
        lastDiscoveredId.current = null;
      });
    }
  }, [discoveryProgress, nextClueId, discoverClue]);

  return {
    isFocused,
    discoveryProgress,
    focusTargetId: nextClueId,
  };
}
