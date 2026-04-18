import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Team } from '@gcr26/shared';

/**
 * Hook for real-time team state synchronization.
 * Listens to the specific team document and provides discovery progress.
 */
export function useTeamState(teamId: string | null) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, 'teams', teamId), (snap) => {
      if (snap.exists()) {
        setTeam({ id: snap.id, ...snap.data() } as Team);
      } else {
        setTeam(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to team state:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  return {
    team,
    discoveredClueIds: team?.discoveredClueIds || [],
    loading,
  };
}
