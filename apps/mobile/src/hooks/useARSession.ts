import { useState, useCallback, useRef, useEffect } from 'react';
import { ViroTrackingStateConstants } from '@reactvision/react-viro';
import * as mapService from '../services/mapService';

export type RelocalizationStatus = 'NONE' | 'ACTIVE' | 'SUCCESS' | 'FAILED';

/**
 * Hook to manage AR tracking state and initialization.
 * Follows the pattern established in useAuth.ts.
 */
export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState<string>('INITIALIZING');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [relocalizing, setRelocalizing] = useState<boolean>(false);
  const [relocalizationStatus, setRelocalizationStatus] = useState<RelocalizationStatus>('NONE');
  
  const relocalizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Saves the current AR world map to the local storage.
   */
  const saveCurrentMap = useCallback(async (name: string) => {
    try {
      // NOTE: Trigger map serialization from AR engine if supported.
      // Currently Viro might require a ref to the Navigator or Scene.
      // Placeholder data for now until engine support is confirmed.
      const placeholderData = "BASE64_PLACEHOLDER_DATA"; 
      
      const metadata = await mapService.saveMap(name, placeholderData);
      console.log('Map saved successfully:', metadata.id);
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

      // TODO: Pass map.data to the AR Scene via viroAppProps or a direct ref call
      console.log('Loading map for relocalization:', mapId);

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
   * Maps ViroTrackingStateConstants to human-readable strings.
   */
  const onTrackingUpdated = useCallback((state: any, _reason: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingStatus('TRACKING');
      setIsInitialized(true);

      // If we were relocalizing, mark as success
      if (relocalizing) {
        setRelocalizing(false);
        setRelocalizationStatus('SUCCESS');
        if (relocalizationTimeoutRef.current) {
          clearTimeout(relocalizationTimeoutRef.current);
          relocalizationTimeoutRef.current = null;
        }
      }
    } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
      setTrackingStatus('LIMITED');
    } else {
      setTrackingStatus('INITIALIZING');
    }
  }, [relocalizing]);

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
    saveCurrentMap,
    loadMapAndRelocalize,
  };
}
