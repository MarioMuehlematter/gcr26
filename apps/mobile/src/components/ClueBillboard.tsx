import React from 'react';
import {
  ViroNode,
  ViroQuad,
  ViroMaterials,
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

interface ClueBillboardProps {
  clue: Clue;
  highlighted?: boolean;
  witcherSensesActive?: boolean;
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
      />
    </ViroNode>
  );
};
