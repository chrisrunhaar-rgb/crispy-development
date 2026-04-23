import { useState, useCallback } from 'react';
import { ToastType } from '@/components/Toast';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const MAX_TOASTS = 3;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = generateId();

      setToasts((prev) => {
        const updated = [...prev, { id, type, message, duration }];
        // Keep only the last MAX_TOASTS
        if (updated.length > MAX_TOASTS) {
          return updated.slice(-MAX_TOASTS);
        }
        return updated;
      });

      return id;
    },
    [generateId]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'success', duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'error', duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'warning', duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'info', duration);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };
};
