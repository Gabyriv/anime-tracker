import { useState, useEffect } from 'react';
import { getUserList, addToList, updateStatus, removeFromList, saveDb, updateEpisodeProgress, updatePersonalRating, updatePersonalNotes } from '../lib/db';
import { AnimeStatus, AnimeFromApi } from '../types/anime';

interface UseAnimeListResult {
  list: any[];
  loading: boolean;
  error: string | null;
  addToList: (anime: AnimeFromApi, status: AnimeStatus) => Promise<boolean>;
  updateStatus: (entryId: number, status: AnimeStatus) => Promise<void>;
  removeFromList: (entryId: number) => Promise<void>;
  updateEpisodeProgress: (entryId: number, episodes: number) => Promise<void>;
  updatePersonalRating: (entryId: number, rating: number | null) => Promise<void>;
  updatePersonalNotes: (entryId: number, notes: string | null) => Promise<void>;
  refresh: () => void;
}

export function useAnimeList(): UseAnimeListResult {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    loadList();
  }, [refreshTrigger]);

  async function loadList() {
    try {
      setLoading(true);
      const data = await getUserList();
      setList(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load list');
    } finally {
      setLoading(false);
    }
  }

  async function add(anime: AnimeFromApi, status: AnimeStatus): Promise<boolean> {
    try {
      await addToList(anime, status);
      refresh();
      return true;
    } catch (err) {
      if (err instanceof Error && err.message === 'Already in list') {
        setError('Already in list');
        return false;
      }
      setError(err instanceof Error ? err.message : 'Failed to add');
      return false;
    }
  }

  async function update(entryId: number, status: AnimeStatus): Promise<void> {
    try {
      await updateStatus(entryId, status);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function remove(entryId: number): Promise<void> {
    try {
      await removeFromList(entryId);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove');
    }
  }

  async function updateEpisodes(entryId: number, episodes: number): Promise<void> {
    try {
      await updateEpisodeProgress(entryId, episodes);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update episodes');
    }
  }

  async function updateRating(entryId: number, rating: number | null): Promise<void> {
    try {
      await updatePersonalRating(entryId, rating);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rating');
    }
  }

  async function updateNotes(entryId: number, notes: string | null): Promise<void> {
    try {
      await updatePersonalNotes(entryId, notes);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notes');
    }
  }

  return { 
    list, 
    loading, 
    error, 
    addToList: add, 
    updateStatus: update, 
    removeFromList: remove,
    updateEpisodeProgress: updateEpisodes,
    updatePersonalRating: updateRating,
    updatePersonalNotes: updateNotes,
    refresh 
  };
}