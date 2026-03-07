import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } },
    );

    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('should cancel previous timer on new value', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } },
    );

    rerender({ value: 'second', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'third', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('third');
    vi.useRealTimers();
  });
});
