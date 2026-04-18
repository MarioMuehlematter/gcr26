import React from 'react';
import {
  ViroNode,
  ViroQuad,
  ViroMaterials,
  ViroAnimations,
} from '@reactvision/react-viro';
import { Clue } from '@gcr26/shared';

/**
 * Define materials for each clue type using the assets from apps/mobile/assets/clues/
 */
ViroMaterials.createMaterials({
  footprintMaterial: {
    diffuseTexture: require('../../assets/clues/footprint.png'),
  },
  bloodstainMaterial: {
    diffuseTexture: require('../../assets/clues/bloodstain.png'),
  },
  scuffMaterial: {
    diffuseTexture: require('../../assets/clues/scuff.png'),
  },
  green_highlight: {
    diffuseColor: 'rgba(0, 255, 0, 0.3)',
    lightingModel: 'Constant',
  },
  witcher_sense_highlight: {
    diffuseColor: 'rgba(255, 100, 0, 0.5)', // Orange glow
    lightingModel: 'Constant',
  },
});

/**
 * Register animations for the clue pulse effect.
 * Sinusoidal feel achieved by chaining In and Out animations.
 */
ViroAnimations.registerAnimations({
  pulse_slow: [
    { properties: { scaleX: 1.2, scaleY: 1.2, scaleZ: 1.2, opacity: 0.4 }, duration: 1000, easing: "EaseIn" },
    { properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0, opacity: 1.0 }, duration: 1000, easing: "EaseOut" },
  ],
  pulse_medium: [
    { properties: { scaleX: 1.25, scaleY: 1.25, scaleZ: 1.25, opacity: 0.5 }, duration: 500, easing: "EaseIn" },
    { properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0, opacity: 1.0 }, duration: 500, easing: "EaseOut" },
  ],
  pulse_fast: [
    { properties: { scaleX: 1.3, scaleY: 1.3, scaleZ: 1.3, opacity: 0.6 }, duration: 375, easing: "EaseIn" },
    { properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0, opacity: 1.0 }, duration: 375, easing: "EaseOut" },
  ],
  pulse_faster: [
    { properties: { scaleX: 1.35, scaleY: 1.35, scaleZ: 1.35, opacity: 0.7 }, duration: 250, easing: "EaseIn" },
    { properties: { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0, opacity: 1.0 }, duration: 250, easing: "EaseOut" },
  ],
});

interface ClueBillboardProps {
  clue: Clue;
  highlighted?: boolean;
  witcherSensesActive?: boolean;
  isNext?: boolean;
  distance?: number;
  onRotate?: (newRotation: [number, number, number]) => void;
  onClick?: () => void;
}

/**
 * A Viro component that renders a clue as a ground-aligned decal.
 * Supports visual highlighting to provide feedback during placement or selection.
 */
export const ClueBillboard: React.FC<ClueBillboardProps> = ({ 
  clue, 
  highlighted = false,
  witcherSensesActive = false,
  isNext = false,
  distance = 100,
  onRotate,
  onClick
}) => {
  // Map clue type to material name defined above
  const materialName = `${clue.type}Material`;

  // Apply the base material, and overlay highlight if active
  const materials = [materialName];
  if (highlighted) {
    materials.push('green_highlight');
  }

  if (witcherSensesActive) {
    materials.push('witcher_sense_highlight');
  }

  const handleRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3 && onRotate) { // 3 is RotateEnd
      const currentY = clue.rotation[1];
      // rotationFactor is in degrees for Viro onRotate
      onRotate([0, currentY - rotationFactor, 0]);
    }
  };

  // Determine pulse animation based on proximity if this is the target clue
  let animationName = undefined;
  let runAnimation = false;

  if (witcherSensesActive && isNext) {
    runAnimation = true;
    if (distance <= 2) {
      animationName = 'pulse_faster';
    } else if (distance <= 5) {
      animationName = 'pulse_fast';
    } else if (distance <= 10) {
      animationName = 'pulse_medium';
    } else {
      animationName = 'pulse_slow';
    }
  }

  return (
    <ViroNode
      position={clue.position}
      rotation={clue.rotation}
      scale={clue.scale}
      onRotate={handleRotate}
      onClick={onClick}
    >
      {/* 
        ViroQuad is used as a decal. 
        -90 degrees on X axis makes it lie flat on a horizontal plane (ground).
      */}
      <ViroQuad
        rotation={[-90, 0, 0]}
        width={0.2}  // Base size 20cm
        height={0.2} // Base size 20cm
        materials={materials}
        onClick={onClick}
        animation={{
          name: animationName,
          run: runAnimation,
          loop: true,
        }}
      />
    </ViroNode>
  );
};
