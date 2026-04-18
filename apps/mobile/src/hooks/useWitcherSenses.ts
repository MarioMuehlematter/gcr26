import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * Hook to manage Witcher Senses state and haptic feedback.
 */
export function useWitcherSenses() {
  const [active, setActive] = useState<boolean>(false);

  /**
   * Enables or disables Witcher Senses.
   * Triggers a medium haptic impact when activated.
   */
  const setEnabled = useCallback(async (enabled: boolean) => {
    if (enabled && !active) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setActive(enabled);
  }, [active]);

  /**
   * Triggers a detection haptic impact.
   * Useful when a clue is discovered or enters field of view while senses are active.
   */
  const triggerDetectionHaptic = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return {
    active,
    setEnabled,
    triggerDetectionHaptic,
  };
}
