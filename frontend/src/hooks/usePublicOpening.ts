import { useCallback, useEffect, useState } from 'react';
import type { OpeningDetail } from '../types/opening';
import { publicOpeningService } from '../services/publicOpeningService';

interface UsePublicOpeningResult {
  opening: OpeningDetail | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePublicOpening = (id: string): UsePublicOpeningResult => {
  const [opening, setOpening] = useState<OpeningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpening = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await publicOpeningService.getPublicOpening(id);
      setOpening(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpening();
  }, [fetchOpening]);

  return {
    opening,
    loading,
    error,
    refetch: fetchOpening,
  };
};
