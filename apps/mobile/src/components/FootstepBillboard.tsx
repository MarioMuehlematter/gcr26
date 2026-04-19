import React from 'react';
import {
  ViroQuad,
  ViroMaterials,
} from '@reactvision/react-viro';

/**
 * Define footprint materials.
 * We use the same asset for both for now, but distinct material names allow for
 * future specialized textures (e.g., left/right mirrored).
 */
ViroMaterials.createMaterials({
  footprint_left: {
    diffuseTexture: require('../../assets/clues/footprint.png'),
    lightingModel: 'Constant',
  },
  footprint_right: {
    diffuseTexture: require('../../assets/clues/footprint.png'),
    lightingModel: 'Constant',
  },
});

interface FootstepBillboardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  type: 'footprint_left' | 'footprint_right';
  distance: number;
  witcherSensesActive: boolean;
}

/**
 * Renders an individual footprint as a ground-aligned decal with proximity fade.
 * 
 * D-06: Proximity Fade (3m radius)
 * Align with floor: Rotation [-90, Heading, 0]
 */
export const FootstepBillboard: React.FC<FootstepBillboardProps> = ({
  position,
  rotation,
  type,
  distance,
  witcherSensesActive,
}) => {
  // Task Requirement: Component MUST NOT render if witcherSensesActive is false.
  if (!witcherSensesActive) {
    return null;
  }

  // Implement Proximity Fade (D-06):
  // Opacity = clamp(1 - (distance / 3), 0, 1). Footprints are invisible beyond 3 meters.
  const opacity = Math.max(0, Math.min(1, 1 - (distance / 3)));

  // Optimization: Don't render if invisible
  if (opacity <= 0) {
    return null;
  }

  // Task Requirement: Materials MUST include witcher_sense_highlight overlay.
  const materials = [type, 'witcher_sense_highlight'];

  return (
    <ViroQuad
      position={position}
      // Flat on ground (rotation [-90, 0, 0] relative to upright)
      // rotation[1] is the heading calculated in pathing.ts
      rotation={[-90, rotation[1], 0]}
      width={0.15}  // Slightly smaller than general clues (20cm)
      height={0.15}
      materials={materials}
      opacity={opacity}
    />
  );
};
