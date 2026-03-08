import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { parseMoves } from '@/utils/movesParser';

interface UseChessboardReturn {
  position: string;
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

export const useChessboard = (moves: string): UseChessboardReturn => {
  const parsedMoves = useMemo(() => parseMoves(moves), [moves]);
  const [currentMove, setCurrentMove] = useState(0);

  const getPosition = useCallback(
    (moveIndex: number): string => {
      const chess = new Chess();
      for (let i = 0; i < moveIndex && i < parsedMoves.length; i++) {
        try {
          chess.move(parsedMoves[i]);
        } catch {
          break;
        }
      }
      return chess.fen();
    },
    [parsedMoves],
  );

  const position = useMemo(() => getPosition(currentMove), [currentMove, getPosition]);

  const goToMove = useCallback(
    (index: number) => {
      setCurrentMove(Math.max(0, Math.min(index, parsedMoves.length)));
    },
    [parsedMoves.length],
  );

  const nextMove = useCallback(() => {
    setCurrentMove((prev) => Math.min(prev + 1, parsedMoves.length));
  }, [parsedMoves.length]);

  const previousMove = useCallback(() => {
    setCurrentMove((prev) => Math.max(prev - 1, 0));
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
