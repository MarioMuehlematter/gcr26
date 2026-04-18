import { useUser } from './useUser';
import * as mapService from '../services/mapService';

export function useInvestigation() {
  const { profile } = useUser();

  const discoverClue = async (clueId: string) => {
    if (!profile?.teamId) {
      console.warn('Cannot discover clue: No teamId found in user profile');
      return;
    }

    try {
      await mapService.recordClueDiscovery(profile.teamId, clueId);
    } catch (error) {
      console.error('Failed to record clue discovery:', error);
      throw error;
    }
  };

  return {
    discoverClue,
  };
}
