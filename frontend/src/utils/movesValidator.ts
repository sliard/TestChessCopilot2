import { Chess } from 'chess.js';
import type { MovesValidationResult } from '../types/opening';

export const validateMoves = (movesString: string): MovesValidationResult => {
  if (!movesString.trim()) {
    return { valid: false, error: 'Moves are required' };
  }

  const chess = new Chess();
  const tokens = movesString.trim().split(/\s+/);

  try {
    for (const token of tokens) {
      if (/^\d+\.+$/.test(token)) continue;
      const result = chess.move(token);
      if (!result) {
        return { valid: false, error: `Invalid move: ${token}` };
      }
    }
    return { valid: true, position: chess.fen() };
  } catch (err) {
    return { valid: false, error: `Parse error: ${(err as Error).message}` };
  }
};
