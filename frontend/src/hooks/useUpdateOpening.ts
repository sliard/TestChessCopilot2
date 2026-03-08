import { useState, useCallback } from 'react';
import { userOpeningService } from '@/services/userOpeningService';
import type { UpdateOpeningRequest, UserOpening } from '@/types/opening';

interface UseUpdateOpeningReturn {
  updateOpening: (id: string, data: UpdateOpeningRequest) => Promise<UserOpening | null>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useUpdateOpening = (): UseUpdateOpeningReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateOpening = useCallback(async (id: string, data: UpdateOpeningRequest): Promise<UserOpening | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await userOpeningService.updateOpening(id, data);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update opening'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateOpening, loading, error, success };
};
