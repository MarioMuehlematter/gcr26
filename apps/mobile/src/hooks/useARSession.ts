import { useState, useCallback, useRef, useEffect } from 'react';
import { ViroTrackingStateConstants, ViroARTrackingTargets } from '@reactvision/react-viro';
import * as mapService from '../services/mapService';

export type RelocalizationStatus = 'NONE' | 'ACTIVE' | 'SUCCESS' | 'FAILED';

/**
 * Hook to manage AR tracking state and initialization.
 * Enhanced with Image Landmark Relocalization for Phase 2 Gap Closure.
 */
export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState<string>('INITIALIZING');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [relocalizing, setRelocalizing] = useState<boolean>(false);
  const [relocalizationStatus, setRelocalizationStatus] = useState<RelocalizationStatus>('NONE');
  const [activeImageTarget, setActiveImageTarget] = useState<string | null>(null);
  
  const relocalizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Called when a ViroARImageMarker is found.
   * This completes the relocalization loop.
   */
  const onImageMarkerFound = useCallback(() => {
    if (relocalizing) {
      setRelocalizationStatus('SUCCESS');
      setRelocalizing(false);
      console.log('Relocalization successful via image marker.');
      if (relocalizationTimeoutRef.current) {
        clearTimeout(relocalizationTimeoutRef.current);
        relocalizationTimeoutRef.current = null;
      }
    }
  }, [relocalizing]);

  /**
   * Saves the current AR world map to the local storage.
   */
  const saveCurrentMap = useCallback(async (name: string) => {
    try {
      // For Image Landmark mode, we save metadata about the image target.
      // v1: We use a placeholder string representing the captured image.
      const placeholderData = "IMAGE_TARGET_REFERENCE_V1"; 
      
      const metadata = await mapService.saveMap(name, placeholderData);
      console.log('Map metadata saved successfully:', metadata.id);
      return metadata;
    } catch (error) {
      console.error('Failed to save map:', error);
      throw error;
    }
  }, []);

  /**
   * Loads a saved map and attempts to relocalize the AR session.
   */
  const loadMapAndRelocalize = useCallback(async (mapId: string) => {
    try {
      const map = await mapService.getMap(mapId);
      if (!map) {
        setRelocalizationStatus('FAILED');
        return;
      }

      setRelocalizing(true);
      setRelocalizationStatus('ACTIVE');

      // Register the tracking target dynamically
      // v1: We use a bundled asset. In future, this would be a dynamic image from disk.
      ViroARTrackingTargets.createTargets({
        [map.metadata.id]: {
          source: require('../assets/marker.png'), // Placeholder asset
          orientation: 'Up',
          physicalWidth: 0.2
        }
      });

      setActiveImageTarget(map.metadata.id);
      console.log('Loading marker for relocalization:', mapId);

      // Start 15-second timer (D-05)
      if (relocalizationTimeoutRef.current) {
        clearTimeout(relocalizationTimeoutRef.current);
      }
      
      relocalizationTimeoutRef.current = setTimeout(() => {
        setRelocalizing(false);
        setRelocalizationStatus('FAILED');
        console.warn('Relocalization timed out after 15 seconds.');
      }, 15000);

    } catch (error) {
      console.error('Failed to load map for relocalization:', error);
      setRelocalizationStatus('FAILED');
      setRelocalizing(false);
    }
  }, []);

  /**
   * Callback for ViroARScene's onTrackingUpdated prop.
   */
  const onTrackingUpdated = useCallback((state: any, _reason: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingStatus('TRACKING');
      setIsInitialized(true);
      
      // In Image Relocalization mode, we don't clear the status on SLAM success;
      // we wait for the Image Marker found event.
    } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
      setTrackingStatus('LIMITED');
    } else {
      setTrackingStatus('INITIALIZING');
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (relocalizationTimeoutRef.current) {
        clearTimeout(relocalizationTimeoutRef.current);
      }
    };
  }, []);

  return {
    trackingStatus,
    isInitialized,
    onTrackingUpdated,
    relocalizing,
    relocalizationStatus,
    activeImageTarget,
    onImageMarkerFound,
    saveCurrentMap,
    loadMapAndRelocalize,
  };
}
