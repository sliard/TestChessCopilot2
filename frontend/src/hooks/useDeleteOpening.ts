import { useState, useCallback } from 'react';
import { userOpeningService } from '@/services/userOpeningService';

interface UseDeleteOpeningReturn {
  deleteOpening: (id: string) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export const useDeleteOpening = (): UseDeleteOpeningReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteOpening = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await userOpeningService.deleteOpening(id);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete opening'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteOpening, loading, error, success };
};
