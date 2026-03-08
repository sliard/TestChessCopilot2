import { useState, useCallback } from 'react';
import { userOpeningService } from '@/services/userOpeningService';
import type { CreateOpeningRequest, UserOpening } from '@/types/opening';

interface UseCreateOpeningReturn {
  createOpening: (data: CreateOpeningRequest) => Promise<UserOpening | null>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useCreateOpening = (): UseCreateOpeningReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const createOpening = useCallback(async (data: CreateOpeningRequest): Promise<UserOpening | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await userOpeningService.createOpening(data);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create opening'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOpening, loading, error, success };
};
