import { Clue } from '@gcr26/shared';

export interface GeneratedFootprint {
  position: [number, number, number];
  rotation: [number, number, number];
  type: 'footprint_left' | 'footprint_right';
}

/**
 * Generates a sequence of footprints between two investigation waypoints.
 * 
 * D-02: Alternating Stride
 * D-04: Stride Frequency (0.6m)
 * D-07: Slight wobble (+/- 0.05m perpendicular)
 */
export function generateFootprints(startClue: Clue, endClue: Clue): GeneratedFootprint[] {
  const startPos = startClue.position;
  const endPos = endClue.position;

  const dx = endPos[0] - startPos[0];
  const dy = endPos[1] - startPos[1];
  const dz = endPos[2] - startPos[2];

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // If waypoints are too close, don't generate footprints
  if (distance < 0.6) {
    return [];
  }

  const dir = [dx / distance, dy / distance, dz / distance];

  // Calculate perpendicular vector for wobble (assuming mostly horizontal movement)
  // On XZ plane, perp to (x, z) is (-z, x)
  const perp = [-dir[2], 0, dir[0]];
  const perpMag = Math.sqrt(perp[0] * perp[0] + perp[2] * perp[2]);
  
  // Normalize perp vector if it's not zero
  if (perpMag > 0) {
    perp[0] /= perpMag;
    perp[2] /= perpMag;
  }

  const footprints: GeneratedFootprint[] = [];
  const strideDistance = 0.6; // D-04
  const footCount = Math.floor(distance / strideDistance);

  // Calculate base rotation to face endClue
  // Viro uses [rx, ry, rz] in degrees. ry is the heading.
  const angleRad = Math.atan2(dx, dz);
  const angleDeg = angleRad * (180 / Math.PI);

  for (let i = 1; i <= footCount; i++) {
    const s = i * strideDistance;
    
    // Base position
    const pos: [number, number, number] = [
      startPos[0] + dir[0] * s,
      startPos[1] + dir[1] * s,
      startPos[2] + dir[2] * s
    ];

    // Add wobble (D-07)
    const wobbleAmount = (Math.random() * 0.1) - 0.05; // +/- 0.05m
    pos[0] += perp[0] * wobbleAmount;
    pos[2] += perp[2] * wobbleAmount;

    // Alternate feet (D-02)
    const type = (i % 2 === 0) ? 'footprint_right' : 'footprint_left';

    footprints.push({
      position: pos,
      rotation: [0, angleDeg, 0],
      type
    });
  }

  return footprints;
}
