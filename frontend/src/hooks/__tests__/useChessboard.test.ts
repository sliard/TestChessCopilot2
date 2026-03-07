import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChessboard } from '../useChessboard';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('useChessboard', () => {
  it('should return starting position for empty moves', () => {
    const { result } = renderHook(() => useChessboard(''));

    expect(result.current.position).toBe(STARTING_FEN);
    expect(result.current.parsedMoves).toEqual([]);
    expect(result.current.totalMoves).toBe(0);
  });

  it('should return starting position for null moves', () => {
    const { result } = renderHook(() => useChessboard(null));

    expect(result.current.position).toBe(STARTING_FEN);
    expect(result.current.parsedMoves).toEqual([]);
    expect(result.current.totalMoves).toBe(0);
  });

  it('should parse moves correctly', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5 2.Nf3 Nc6'));

    expect(result.current.parsedMoves).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
    expect(result.current.totalMoves).toBe(4);
  });

  it('should start at move 0 with starting FEN', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5'));

    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(STARTING_FEN);
  });

  it('should advance to next move and update FEN', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5'));

    act(() => {
      result.current.nextMove();
    });

    expect(result.current.currentMove).toBe(1);
    expect(result.current.position).not.toBe(STARTING_FEN);
    // After 1.e4: pawn on e4 (4th rank)
    expect(result.current.position).toContain('4P3');
  });

  it('should go to previous move', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5'));

    act(() => {
      result.current.nextMove();
    });
    expect(result.current.currentMove).toBe(1);

    act(() => {
      result.current.previousMove();
    });
    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(STARTING_FEN);
  });

  it('should go to first move (position 0)', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5 2.Nf3 Nc6'));

    act(() => {
      result.current.lastMove();
    });
    expect(result.current.currentMove).toBe(4);

    act(() => {
      result.current.firstMove();
    });
    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(STARTING_FEN);
  });

  it('should go to last move', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5 2.Nf3 Nc6'));

    act(() => {
      result.current.lastMove();
    });

    expect(result.current.currentMove).toBe(4);
    expect(result.current.position).not.toBe(STARTING_FEN);
  });

  it('should clamp goToMove to valid range', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5'));

    // Negative index should clamp to 0
    act(() => {
      result.current.goToMove(-5);
    });
    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(STARTING_FEN);

    // Index beyond totalMoves should clamp to totalMoves
    act(() => {
      result.current.goToMove(100);
    });
    expect(result.current.currentMove).toBe(2);
  });

  it('should return correct canGoNext/canGoPrevious states', () => {
    const { result } = renderHook(() => useChessboard('1.e4 e5'));

    // At position 0: can go next, cannot go previous
    expect(result.current.canGoPrevious).toBe(false);
    expect(result.current.canGoNext).toBe(true);

    // At position 1: can go both ways
    act(() => {
      result.current.nextMove();
    });
    expect(result.current.canGoPrevious).toBe(true);
    expect(result.current.canGoNext).toBe(true);

    // At last position: can go previous, cannot go next
    act(() => {
      result.current.lastMove();
    });
    expect(result.current.canGoPrevious).toBe(true);
    expect(result.current.canGoNext).toBe(false);
  });

  it('should reset when moves prop changes', () => {
    const { result, rerender } = renderHook(
      ({ moves }) => useChessboard(moves),
      { initialProps: { moves: '1.e4 e5' } },
    );

    act(() => {
      result.current.nextMove();
    });
    expect(result.current.currentMove).toBe(1);

    rerender({ moves: '1.d4 d5' });

    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(STARTING_FEN);
    expect(result.current.parsedMoves).toEqual(['d4', 'd5']);
  });

  it('should handle invalid move gracefully', () => {
    const { result } = renderHook(() => useChessboard('1.e4 invalid'));

    expect(result.current.parsedMoves).toEqual(['e4', 'invalid']);
    expect(result.current.totalMoves).toBe(2);

    // Navigate to last move — should stop at last valid position
    act(() => {
      result.current.lastMove();
    });

    expect(result.current.currentMove).toBe(2);
    // Position should reflect last valid move (e4), not crash
    expect(result.current.position).toContain('4P3');
    expect(result.current.position).not.toBe(STARTING_FEN);
  });
});
