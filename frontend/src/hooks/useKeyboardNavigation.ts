import { useEffect } from 'react';

interface KeyboardNavigationCallbacks {
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
}

export const useKeyboardNavigation = (
  callbacks: KeyboardNavigationCallbacks,
  enabled = true,
): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          callbacks.onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          callbacks.onPrevious();
          break;
        case 'Home':
          e.preventDefault();
          callbacks.onFirst();
          break;
        case 'End':
          e.preventDefault();
          callbacks.onLast();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks.onNext, callbacks.onPrevious, callbacks.onFirst, callbacks.onLast, enabled]);
};
