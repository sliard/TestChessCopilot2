import { useState, useEffect } from 'react';
import { validateMoves } from '@/utils/movesValidator';
import type { MovesValidationResult } from '@/types/opening';

interface UseValidateMovesReturn {
  valid: boolean;
  error: string | undefined;
  position: string | undefined;
}

export const useValidateMoves = (moves: string): UseValidateMovesReturn => {
  const [result, setResult] = useState<MovesValidationResult>({ valid: false });

  useEffect(() => {
    if (!moves || !moves.trim()) {
      setResult({ valid: false, error: 'Les coups sont requis' });
      return;
    }

    const timer = setTimeout(() => {
      setResult(validateMoves(moves));
    }, 300);

    return () => clearTimeout(timer);
  }, [moves]);

  return {
    valid: result.valid,
    error: result.error,
    position: result.position,
  };
};
