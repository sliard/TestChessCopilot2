import { renderHook, waitFor } from '@testing-library/react';
import { useValidateMoves } from '../useValidateMoves';

describe('useValidateMoves', () => {
  it('should return invalid with error for empty string', () => {
    const { result } = renderHook(() => useValidateMoves(''));

    expect(result.current.valid).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it('should return invalid for whitespace-only string', () => {
    const { result } = renderHook(() => useValidateMoves('   '));

    expect(result.current.valid).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it('should return valid for a single legal move after debounce', async () => {
    const { result } = renderHook(() => useValidateMoves('1. e4'));

    await waitFor(() => {
      expect(result.current.valid).toBe(true);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.position).toBeDefined();
  });

  it('should return valid for a Ruy Lopez sequence', async () => {
    const { result } = renderHook(() => useValidateMoves('1. e4 e5 2. Nf3 Nc6 3. Bb5'));

    await waitFor(() => {
      expect(result.current.valid).toBe(true);
    });

    expect(result.current.position).toBeDefined();
  });

  it('should return FEN with black to move after 1. e4', async () => {
    const { result } = renderHook(() => useValidateMoves('1. e4'));

    await waitFor(() => {
      expect(result.current.valid).toBe(true);
    });

    // After 1. e4 it is black's turn — FEN contains ' b '
    expect(result.current.position).toContain(' b ');
  });

  it('should return invalid for an illegal move', async () => {
    // Bg2 is impossible — g2 is occupied by white's own pawn
    const { result } = renderHook(() => useValidateMoves('1. e4 e5 2. Bg2'));

    await waitFor(() => {
      expect(result.current.valid).toBe(false);
      expect(result.current.error).toBeDefined();
    });
  });

  it('should debounce validation (not validate immediately)', async () => {
    const { result, rerender } = renderHook(
      ({ moves }) => useValidateMoves(moves),
      { initialProps: { moves: '1. e4' } },
    );

    // Immediately after render, validation hasn't fired yet — initial state is invalid
    expect(result.current.valid).toBe(false);

    // After the 300ms debounce, validation runs
    await waitFor(() => {
      expect(result.current.valid).toBe(true);
    });

    // Change the input — triggers debounce reset
    rerender({ moves: '1. e4 e5' });

    await waitFor(() => {
      expect(result.current.valid).toBe(true);
      expect(result.current.position).toContain(' w '); // White to move after 1...e5
    });
  });

  it('should handle moves without move numbers', async () => {
    const { result } = renderHook(() => useValidateMoves('e4 e5 Nf3 Nc6'));

    await waitFor(() => {
      expect(result.current.valid).toBe(true);
    });
  });

  it('should return undefined position for invalid moves', async () => {
    const { result } = renderHook(() => useValidateMoves('1. e4 e5 2. Bg2'));

    await waitFor(() => {
      expect(result.current.valid).toBe(false);
    });

    expect(result.current.position).toBeUndefined();
  });
});
