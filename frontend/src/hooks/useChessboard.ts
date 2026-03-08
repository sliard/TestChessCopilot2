import { useCallback, useMemo, useState } from 'react';
import { Chess } from 'chess.js';

interface UseChessboardResult {
  position: string;
  currentMoveIndex: number;
  parsedMoves: string[];
  totalMoves: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextMove: () => void;
  previousMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  goToMove: (index: number) => void;
}

const parseMoveString = (moves: string): string[] => {
  if (!moves || moves.trim() === '') return [];
  return moves
    .replace(/\d+\./g, '')
    .split(/\s+/)
    .filter((m) => m.length > 0);
};

export const useChessboard = (moves: string): UseChessboardResult => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const parsedMoves = useMemo(() => parseMoveString(moves), [moves]);
  const totalMoves = parsedMoves.length;

  const position = useMemo(() => {
    if (currentMoveIndex < 0) {
      return 'start';
    }
    const chess = new Chess();
    for (let i = 0; i <= currentMoveIndex && i < parsedMoves.length; i++) {
      try {
        chess.move(parsedMoves[i]);
      } catch {
        break;
      }
    }
    return chess.fen();
  }, [currentMoveIndex, parsedMoves]);

  const canGoNext = currentMoveIndex < totalMoves - 1;
  const canGoPrevious = currentMoveIndex >= 0;

  const nextMove = useCallback(() => {
    setCurrentMoveIndex((prev) => Math.min(prev + 1, totalMoves - 1));
  }, [totalMoves]);

  const previousMove = useCallback(() => {
    setCurrentMoveIndex((prev) => Math.max(prev - 1, -1));
  }, []);

  const firstMove = useCallback(() => {
    setCurrentMoveIndex(-1);
  }, []);

  const lastMove = useCallback(() => {
    setCurrentMoveIndex(totalMoves - 1);
  }, [totalMoves]);

  const goToMove = useCallback(
    (index: number) => {
      setCurrentMoveIndex(Math.max(-1, Math.min(index, totalMoves - 1)));
    },
    [totalMoves],
  );

  return {
    position,
    currentMoveIndex,
    parsedMoves,
    totalMoves,
    canGoNext,
    canGoPrevious,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    goToMove,
  };
};
