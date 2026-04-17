import { useState, useCallback } from 'react';
import { ViroTrackingStateConstants } from '@reactvision/react-viro';

/**
 * Hook to manage AR tracking state and initialization.
 * Follows the pattern established in useAuth.ts.
 */
export function useARSession() {
  const [trackingStatus, setTrackingStatus] = useState<string>('INITIALIZING');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /**
   * Callback for ViroARScene's onTrackingUpdated prop.
   * Maps ViroTrackingStateConstants to human-readable strings.
   */
  const onTrackingUpdated = useCallback((state: any, _reason: any) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingStatus('TRACKING');
      setIsInitialized(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
      setTrackingStatus('LIMITED');
    } else {
      setTrackingStatus('INITIALIZING');
    }
  }, []);

  return {
    trackingStatus,
    isInitialized,
    onTrackingUpdated,
  };
}
