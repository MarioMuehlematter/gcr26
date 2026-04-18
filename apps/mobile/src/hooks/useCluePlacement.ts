import { useState, useCallback } from 'react';
import { Clue, ClueType } from '@gcr26/shared';
import * as mapService from '../services/mapService';

/**
 * Hook to manage clue placement state and Firestore synchronization.
 */
export function useCluePlacement() {
  const [placedClues, setPlacedClues] = useState<Clue[]>([]);
  const [selectedClueType, setSelectedClueType] = useState<ClueType | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches existing clues for a given mapId from Firestore.
   */
  const loadClues = useCallback(async (mapId: string) => {
    setLoading(true);
    try {
      const clues = await mapService.getClues(mapId);
      setPlacedClues(clues);
    } catch (error) {
      console.error('Failed to load clues from cloud:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a new clue at the given position using the currently selected type.
   */
  const addClue = useCallback((position: [number, number, number]) => {
    if (!selectedClueType) {
      console.warn('Cannot add clue: No clue type selected.');
      return null;
    }

    const newClue: Clue = {
      id: `clue_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: selectedClueType,
      position,
      rotation: [0, 0, 0],
      scale: [1, 1, 1], // Default scale for the billboard/decal
      metadata: {},
    };

    setPlacedClues(prev => {
      // T-04-02: Limit maximum number of clues per session
      if (prev.length >= 50) {
        console.warn('Clue limit reached (50). Cannot add more.');
        return prev;
      }
      return [...prev, newClue];
    });

    return newClue;
  }, [selectedClueType]);

  /**
   * Removes a clue from the local state.
   */
  const removeClue = useCallback((id: string) => {
    setPlacedClues(prev => prev.filter(c => c.id !== id));
  }, []);

  /**
   * Updates the rotation of a specific clue.
   */
  const updateClueRotation = useCallback((id: string, rotation: [number, number, number]) => {
    setPlacedClues(prev => prev.map(c => 
      c.id === id ? { ...c, rotation } : c
    ));
  }, []);

  return {
    placedClues,
    selectedClueType,
    setSelectedClueType,
    loading,
    loadClues,
    addClue,
    removeClue,
    updateClueRotation,
  };
}
