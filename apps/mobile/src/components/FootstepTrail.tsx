import React, { useMemo } from 'react';
import { Clue } from '@gcr26/shared';
import { generateFootprints } from '../utils/pathing';
import { FootstepBillboard } from './FootstepBillboard';

interface FootstepTrailProps {
  startClue: Clue;
  endClue: Clue;
  witcherSensesActive: boolean;
  cameraPosition: [number, number, number];
}

/**
 * Orchestrates the rendering of a sequence of footprints between two waypoints.
 * 
 * D-08-01: Segmented Footprint Decals
 * T-08-02-01: Use useMemo to prevent recalculating pathing logic on every frame.
 */
export const FootstepTrail: React.FC<FootstepTrailProps> = ({
  startClue,
  endClue,
  witcherSensesActive,
  cameraPosition,
}) => {
  // Memoize path generation to avoid costly recalculation during AR frame updates
  const footprints = useMemo(() => generateFootprints(startClue, endClue), [
    startClue.id,
    startClue.position,
    endClue.id,
    endClue.position
  ]);

  // Optimization: Don't render anything if trail is empty or senses are inactive
  if (!witcherSensesActive || footprints.length === 0) {
    return null;
  }

  return (
    <>
      {footprints.map((footprint, index) => {
        // Calculate distance from player (camera) for proximity-based rendering
        const dx = footprint.position[0] - cameraPosition[0];
        const dy = footprint.position[1] - cameraPosition[1];
        const dz = footprint.position[2] - cameraPosition[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Individual billboards handle their own proximity fade
        return (
          <FootstepBillboard
            key={`${startClue.id}-${endClue.id}-${index}`}
            position={footprint.position}
            rotation={footprint.rotation}
            type={footprint.type}
            distance={distance}
            witcherSensesActive={witcherSensesActive}
          />
        );
      })}
    </>
  );
};
