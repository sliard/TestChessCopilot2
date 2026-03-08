import { useState, useEffect } from 'react';
import { publicOpeningService } from '@/services/publicOpeningService';
import type { OpeningDetail } from '@/types/opening';

interface UsePublicOpeningReturn {
  opening: OpeningDetail | null;
  loading: boolean;
  error: Error | null;
}

export const usePublicOpening = (id: string): UsePublicOpeningReturn => {
  const [opening, setOpening] = useState<OpeningDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOpening = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await publicOpeningService.getPublicOpening(id);
        setOpening(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch opening'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpening();
  }, [id]);

  return { opening, loading, error };
};
