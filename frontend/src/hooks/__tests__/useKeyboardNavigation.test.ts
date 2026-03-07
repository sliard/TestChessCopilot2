import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNavigation } from '../useKeyboardNavigation';

const createCallbacks = () => ({
  onNext: vi.fn(),
  onPrevious: vi.fn(),
  onFirst: vi.fn(),
  onLast: vi.fn(),
});

describe('useKeyboardNavigation', () => {
  it('should call onNext when ArrowRight is pressed', () => {
    const callbacks = createCallbacks();
    renderHook(() => useKeyboardNavigation(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(callbacks.onNext).toHaveBeenCalledOnce();
  });

  it('should call onPrevious when ArrowLeft is pressed', () => {
    const callbacks = createCallbacks();
    renderHook(() => useKeyboardNavigation(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(callbacks.onPrevious).toHaveBeenCalledOnce();
  });

  it('should call onFirst when Home is pressed', () => {
    const callbacks = createCallbacks();
    renderHook(() => useKeyboardNavigation(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(callbacks.onFirst).toHaveBeenCalledOnce();
  });

  it('should call onLast when End is pressed', () => {
    const callbacks = createCallbacks();
    renderHook(() => useKeyboardNavigation(callbacks));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(callbacks.onLast).toHaveBeenCalledOnce();
  });

  it('should not call callbacks when enabled is false', () => {
    const callbacks = createCallbacks();
    renderHook(() => useKeyboardNavigation(callbacks, false));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(callbacks.onNext).not.toHaveBeenCalled();
    expect(callbacks.onPrevious).not.toHaveBeenCalled();
    expect(callbacks.onFirst).not.toHaveBeenCalled();
    expect(callbacks.onLast).not.toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const callbacks = createCallbacks();
    const { unmount } = renderHook(() => useKeyboardNavigation(callbacks));

    unmount();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(callbacks.onNext).not.toHaveBeenCalled();
  });
});
