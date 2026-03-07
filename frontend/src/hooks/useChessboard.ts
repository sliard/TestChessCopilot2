import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

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

const parseMoveString = (moves: string | null | undefined): string[] => {
  if (!moves || moves.trim() === '') {
    return [];
  }
  return moves
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/^\d+\./, ''))
    .filter(Boolean);
};

const computePositionAtMove = (moves: string[], moveIndex: number): string => {
  if (moveIndex <= 0 || moves.length === 0) {
    return STARTING_FEN;
  }

  const chess = new Chess();
  const targetIndex = Math.min(moveIndex, moves.length);

  for (let i = 0; i < targetIndex; i++) {
    try {
      chess.move(moves[i]);
    } catch {
      return chess.fen();
    }
  }

  return chess.fen();
};

export const useChessboard = (moves: string | null | undefined): UseChessboardReturn => {
  const parsedMoves = useMemo(() => parseMoveString(moves), [moves]);
  const totalMoves = parsedMoves.length;

  const [currentMove, setCurrentMove] = useState(0);
  const [position, setPosition] = useState(STARTING_FEN);

  useEffect(() => {
    setCurrentMove(0);
    setPosition(STARTING_FEN);
  }, [moves]);

  const goToMove = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, totalMoves));
      setCurrentMove(clampedIndex);
      setPosition(computePositionAtMove(parsedMoves, clampedIndex));
    },
    [parsedMoves, totalMoves],
  );

  const nextMove = useCallback(() => {
    goToMove(currentMove + 1);
  }, [goToMove, currentMove]);

  const previousMove = useCallback(() => {
    goToMove(currentMove - 1);
  }, [goToMove, currentMove]);

  const firstMove = useCallback(() => {
    goToMove(0);
  }, [goToMove]);

  const lastMove = useCallback(() => {
    goToMove(totalMoves);
  }, [goToMove, totalMoves]);

  const canGoNext = currentMove < totalMoves;
  const canGoPrevious = currentMove > 0;

  return {
    position,
    currentMove,
    totalMoves,
    parsedMoves,
    goToMove,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    canGoNext,
    canGoPrevious,
  };
};
