import { useEffect } from 'react';

interface KeyboardCallbacks {
  onNext?: () => void;
  onPrevious?: () => void;
  onFirst?: () => void;
  onLast?: () => void;
}

export const useKeyboardNavigation = (callbacks: KeyboardCallbacks): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          callbacks.onNext?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          callbacks.onPrevious?.();
          break;
        case 'Home':
          event.preventDefault();
          callbacks.onFirst?.();
          break;
        case 'End':
          event.preventDefault();
          callbacks.onLast?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};
