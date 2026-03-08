import { useCallback, useEffect, useState } from 'react';
import type { OpeningDetail } from '../types/opening';
import { publicOpeningService } from '../services/publicOpeningService';

interface UsePublicOpeningResult {
  opening: OpeningDetail | null;
  loading: boolean;
  error: string | null;
}

export const usePublicOpening = (id: string): UsePublicOpeningResult => {
  const [opening, setOpening] = useState<OpeningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpening = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await publicOpeningService.getPublicOpening(id);
      setOpening(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpening();
  }, [fetchOpening]);

  return { opening, loading, error };
};
