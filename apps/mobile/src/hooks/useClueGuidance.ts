import { useMemo } from 'react';
import { Clue } from '@gcr26/shared';

interface CameraTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  forward?: [number, number, number];
}

interface GuidanceResult {
  nextClueId: string | null;
  distance: number | null;
  angle: number | null;
  isVisible: boolean;
}

/**
 * Hook to identify the next clue in the investigation sequence
 * and calculate relative distance and angle for guidance visuals.
 */
export function useClueGuidance(
  placedClues: Clue[],
  discoveredClueIds: string[],
  cameraTransform: CameraTransform | null
): GuidanceResult {
  return useMemo(() => {
    if (!cameraTransform || placedClues.length === 0) {
      return { nextClueId: null, distance: null, angle: null, isVisible: false };
    }

    // 1. Find the next undiscovered clue that has its prerequisites met
    const nextClue = placedClues.find(clue => {
      const isDiscovered = discoveredClueIds.includes(clue.id);
      if (isDiscovered) return false;

      // Check prerequisites (Phase 5 D-05)
      if (clue.requiredClueId && !discoveredClueIds.includes(clue.requiredClueId)) {
        return false;
      }

      return true;
    });

    if (!nextClue) {
      return { nextClueId: null, distance: null, angle: null, isVisible: false };
    }

    // 2. Calculate Euclidean distance (3D Vector Distance pattern)
    const dx = nextClue.position[0] - cameraTransform.position[0];
    const dy = nextClue.position[1] - cameraTransform.position[1];
    const dz = nextClue.position[2] - cameraTransform.position[2];
    
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // 3. Calculate horizontal angle relative to camera
    // targetAngle: Angle of the vector from camera to clue on the XZ plane
    const targetAngleRad = Math.atan2(dx, dz);
    const targetAngleDeg = (targetAngleRad * 180) / Math.PI;

    // Camera rotation[1] is the rotation around Y axis in degrees.
    // In Viro, 0 is typically looking towards -Z. 
    // We want the difference between the camera's facing direction and the target.
    let angle = targetAngleDeg - cameraTransform.rotation[1];

    // Normalize angle to [-180, 180]
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;

    return {
      nextClueId: nextClue.id,
      distance,
      angle,
      isVisible: distance <= 15, // D-03: Distance-based Pulse
    };
  }, [placedClues, discoveredClueIds, cameraTransform]);
}
