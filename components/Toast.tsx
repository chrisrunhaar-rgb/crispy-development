'use client';

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onDismiss,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const getStyles = (type: ToastType) => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      borderRadius: '0.5rem',
      fontFamily: 'var(--font-montserrat)',
      fontSize: '0.875rem',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideInRight 0.3s ease-out',
      maxWidth: '420px',
      wordBreak: 'break-word',
    };

    const typeStyles: Record<ToastType, React.CSSProperties> = {
      success: {
        ...baseStyles,
        background: 'oklch(87% 0.15 145)',
        color: 'oklch(35% 0.10 145)',
        borderLeft: '4px solid oklch(50% 0.18 145)',
      },
      error: {
        ...baseStyles,
        background: 'oklch(87% 0.18 25)',
        color: 'oklch(40% 0.18 25)',
        borderLeft: '4px solid oklch(55% 0.25 25)',
      },
      warning: {
        ...baseStyles,
        background: 'oklch(92% 0.12 73)',
        color: 'oklch(45% 0.15 73)',
        borderLeft: '4px solid oklch(65% 0.18 73)',
      },
      info: {
        ...baseStyles,
        background: 'oklch(87% 0.15 250)',
        color: 'oklch(35% 0.12 250)',
        borderLeft: '4px solid oklch(55% 0.20 250)',
      },
    };

    return typeStyles[type];
  };

  const iconMap: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ⓘ',
  };

  return (
    <div style={getStyles(type)}>
      <span style={{ fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
        {iconMap[type]}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => onDismiss(id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          opacity: 0.6,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '0.6';
        }}
      >
        ✕
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{ pointerEvents: 'auto' }}
        >
          <Toast
            {...toast}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
