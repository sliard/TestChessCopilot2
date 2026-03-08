import { Chess } from 'chess.js';
import type { MovesValidationResult } from '@/types/opening';

export const validateMoves = (movesString: string): MovesValidationResult => {
  if (!movesString || !movesString.trim()) {
    return { valid: false, error: 'Les coups sont requis' };
  }

  const chess = new Chess();
  const tokens = movesString.trim().split(/\s+/);

  try {
    for (const token of tokens) {
      // Skip move numbers (1., 2., 12., etc.)
      if (/^\d+\.+$/.test(token)) continue;

      const result = chess.move(token);
      if (!result) {
        return { valid: false, error: `Coup invalide : ${token}` };
      }
    }
    return { valid: true, position: chess.fen() };
  } catch (err) {
    return { valid: false, error: `Erreur de parsing : ${(err as Error).message}` };
  }
};
