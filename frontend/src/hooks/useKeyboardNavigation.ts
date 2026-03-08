import { useEffect } from 'react';

interface KeyboardCallbacks {
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
}

export const useKeyboardNavigation = ({ onNext, onPrevious, onFirst, onLast }: KeyboardCallbacks) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevious();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        onFirst();
      }
      if (e.key === 'End') {
        e.preventDefault();
        onLast();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onFirst, onLast]);
};
