import React from 'react';
import {
  ViroARPlane,
  ViroQuad,
  ViroMaterials,
} from '@reactvision/react-viro';

// Material definition for the plane grid (D-03)
ViroMaterials.createMaterials({
  planeGrid: {
    diffuseColor: 'rgba(0, 255, 255, 0.3)', // Semi-transparent cyan
  },
});

interface ARPlaneVisualizationProps {
  alignment: 'Horizontal' | 'Vertical' | 'HorizontalUpward' | 'HorizontalDownward';
}

/**
 * Component to visualize detected planes in the AR environment.
 * Provides visual feedback to the player about known surfaces (CORE-02).
 */
export const ARPlaneVisualization = ({ alignment }: ARPlaneVisualizationProps) => {
  const [scale, setScale] = React.useState<[number, number, number]>([1, 1, 1]);

  // Horizontal planes need -90 rotation on X to lie flat on the floor
  const isHorizontal = alignment.startsWith('Horizontal');
  const rotation: [number, number, number] = isHorizontal ? [-90, 0, 0] : [0, 0, 0];

  const onAnchorUpdated = (anchor: any) => {
    // anchor.width and anchor.height are in meters
    setScale([anchor.width, anchor.height, 1]);
  };

  return (
    <ViroARPlane
      minHeight={0.5}
      minWidth={0.5}
      alignment={alignment}
      onAnchorUpdated={onAnchorUpdated}
    >
      <ViroQuad
        rotation={rotation}
        scale={scale}
        materials={['planeGrid']}
      />
    </ViroARPlane>
  );
};

export default ARPlaneVisualization;
