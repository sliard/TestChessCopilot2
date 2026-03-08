import { renderHook, act } from '@testing-library/react';
import { useChessboard } from '../useChessboard';

describe('useChessboard', () => {
  const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  it('should start at position 0 with starting FEN', () => {
    const { result } = renderHook(() => useChessboard('1. e4 e5'));

    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(startingFen);
    expect(result.current.totalMoves).toBe(2);
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(false);
  });

  it('should advance to next move', () => {
    const { result } = renderHook(() => useChessboard('1. e4 e5'));

    act(() => {
      result.current.nextMove();
    });

    expect(result.current.currentMove).toBe(1);
    expect(result.current.position).toContain('/4P3/'); // e4 pawn on e4
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(true);
  });

  it('should go to last move', () => {
    const { result } = renderHook(() => useChessboard('1. e4 e5'));

    act(() => {
      result.current.lastMove();
    });

    expect(result.current.currentMove).toBe(2);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(true);
  });

  it('should go back to first move', () => {
    const { result } = renderHook(() => useChessboard('1. e4 e5'));

    act(() => {
      result.current.lastMove();
    });
    act(() => {
      result.current.firstMove();
    });

    expect(result.current.currentMove).toBe(0);
    expect(result.current.position).toBe(startingFen);
  });

  it('should navigate to a specific move', () => {
    const { result } = renderHook(() => useChessboard('1. e4 e5 2. Nf3 Nc6 3. Bb5'));

    act(() => {
      result.current.goToMove(3);
    });

    expect(result.current.currentMove).toBe(3);
    expect(result.current.parsedMoves).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
  });

  it('should not go beyond boundaries', () => {
    const { result } = renderHook(() => useChessboard('1. e4 c5'));

    act(() => {
      result.current.previousMove();
    });
    expect(result.current.currentMove).toBe(0);

    act(() => {
      result.current.goToMove(100);
    });
    expect(result.current.currentMove).toBe(2);
  });

  it('should handle empty moves string', () => {
    const { result } = renderHook(() => useChessboard(''));

    expect(result.current.totalMoves).toBe(0);
    expect(result.current.position).toBe(startingFen);
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
  });
});
