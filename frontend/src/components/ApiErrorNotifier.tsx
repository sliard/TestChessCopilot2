/**
 * Composant global qui écoute les événements d'erreur API
 * et affiche une notification toast en cas d'erreur réseau ou serveur.
 */

import { useEffect, useState, useCallback } from 'react';
import type { ApiClientError } from '../services/apiClient';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'warning';
}

let toastId = 0;

export const ApiErrorNotifier: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'error' | 'warning') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleNetworkError = () => {
      addToast('Impossible de contacter le serveur. Vérifiez votre connexion.', 'error');
    };

    const handleApiError = (event: Event) => {
      const detail = (event as CustomEvent<ApiClientError>).detail;
      // Notifier uniquement pour les erreurs serveur (5xx)
      if (detail.status >= 500) {
        addToast('Erreur serveur. Veuillez réessayer plus tard.', 'error');
      }
    };

    window.addEventListener('api:network-error', handleNetworkError);
    window.addEventListener('api:error', handleApiError);

    return () => {
      window.removeEventListener('api:network-error', handleNetworkError);
      window.removeEventListener('api:error', handleApiError);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

