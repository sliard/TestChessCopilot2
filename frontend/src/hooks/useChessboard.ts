import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';

interface UseChessboardReturn {
  position: string; // FEN
  currentMove: number;
  totalMoves: number;
  parsedMoves: string[];
  goToMove: (index: number) => void;
  nextMove: () => void;
  previousMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const parseMoves = (movesString: string): string[] => {
  if (!movesString || !movesString.trim()) return [];
  return movesString
    .trim()
    .split(/\s+/)
    .filter(token => !/^\d+\.+$/.test(token))
    .filter(Boolean);
};

export const useChessboard = (moves: string): UseChessboardReturn => {
  const parsedMoves = useMemo(() => parseMoves(moves), [moves]);
  const [currentMove, setCurrentMove] = useState(0);

  const position = useMemo(() => {
    const chess = new Chess();
    for (let i = 0; i < currentMove; i++) {
      try {
        chess.move(parsedMoves[i]);
      } catch {
        break;
      }
    }
    return chess.fen();
  }, [parsedMoves, currentMove]);

  const goToMove = useCallback((index: number) => {
    setCurrentMove(Math.max(0, Math.min(index, parsedMoves.length)));
  }, [parsedMoves.length]);

  const nextMove = useCallback(() => {
    setCurrentMove(prev => Math.min(prev + 1, parsedMoves.length));
  }, [parsedMoves.length]);

  const previousMove = useCallback(() => {
    setCurrentMove(prev => Math.max(prev - 1, 0));
  }, []);

  const firstMove = useCallback(() => {
    setCurrentMove(0);
  }, []);

  const lastMove = useCallback(() => {
    setCurrentMove(parsedMoves.length);
  }, [parsedMoves.length]);

  return {
    position,
    currentMove,
    totalMoves: parsedMoves.length,
    parsedMoves,
    goToMove,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    canGoNext: currentMove < parsedMoves.length,
    canGoPrevious: currentMove > 0,
  };
};
