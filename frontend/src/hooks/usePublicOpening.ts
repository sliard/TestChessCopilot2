import { useState, useEffect, useCallback } from 'react';
import { publicOpeningService } from '../services/publicOpeningService';
import type { OpeningDetail } from '../types/opening';

interface UsePublicOpeningResult {
  opening: OpeningDetail | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePublicOpening = (id: string | undefined): UsePublicOpeningResult => {
  const [opening, setOpening] = useState<OpeningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpening = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await publicOpeningService.getPublicOpening(id);
      setOpening(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch opening'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpening();
  }, [fetchOpening]);

  return { opening, loading, error, refetch: fetchOpening };
};
