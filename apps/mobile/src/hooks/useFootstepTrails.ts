import { useMemo } from 'react';
import { Clue } from '@gcr26/shared';

export interface TrailSegment {
  startClue: Clue;
  endClue: Clue;
}

/**
 * Hook to manage footstep trail segments based on clue discovery.
 * 
 * Logic:
 * 1. Filter clues that have pathId and pathSequence.
 * 2. Group clues by pathId.
 * 3. Sort each group by pathSequence.
 * 4. Construct segments: pairs of consecutive clues (clue[i], clue[i+1]).
 * 5. Filter segments: A segment is active only if clue[i].id is discovered.
 */
export function useFootstepTrails(placedClues: Clue[], discoveredClueIds: string[]) {
  const activeSegments = useMemo(() => {
    // 1. Filter clues that have pathId and pathSequence
    const pathClues = placedClues.filter(c => c.pathId !== undefined && c.pathSequence !== undefined);

    // 2. Group clues by pathId
    const groups: Record<string, Clue[]> = {};
    pathClues.forEach(clue => {
      const pId = clue.pathId as string;
      if (!groups[pId]) {
        groups[pId] = [];
      }
      groups[pId].push(clue);
    });

    const segments: TrailSegment[] = [];

    // 3. Process each group
    Object.values(groups).forEach(group => {
      // Sort by pathSequence
      const sortedGroup = [...group].sort((a, b) => (a.pathSequence || 0) - (b.pathSequence || 0));

      // 4. Construct segments
      for (let i = 0; i < sortedGroup.length - 1; i++) {
        const startClue = sortedGroup[i];
        const endClue = sortedGroup[i + 1];

        // 5. Filter segments: Active if startClue is discovered
        // T-08-03-01: Information Disclosure mitigation - Enforce segment visibility rule
        if (discoveredClueIds.includes(startClue.id)) {
          segments.push({
            startClue,
            endClue
          });
        }
      }
    });

    return segments;
  }, [placedClues, discoveredClueIds]);

  return { activeSegments };
}
