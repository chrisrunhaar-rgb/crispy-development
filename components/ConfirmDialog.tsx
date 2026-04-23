'use client';

import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Accessible confirmation dialog with keyboard support (Esc to cancel, Tab to navigate)
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus cancel button when dialog opens
    cancelButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          maxWidth: '420px',
          width: '90vw',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <h2
          id="confirm-title"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'oklch(22% 0.005 260)',
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h2>

        <p
          id="confirm-message"
          style={{
            fontSize: '0.95rem',
            color: 'oklch(52% 0.008 260)',
            marginBottom: '1.75rem',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
          }}
        >
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.375rem',
              border: '1px solid oklch(84% 0.008 80)',
              background: 'white',
              color: 'oklch(52% 0.008 260)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background =
                  'oklch(97% 0.005 80)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.background = 'white';
              }
            }}
          >
            {cancelText}
          </button>

          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.375rem',
              border: isDangerous ? '1px solid oklch(55% 0.25 25)' : '1px solid oklch(55% 0.20 250)',
              background: isDangerous ? 'oklch(55% 0.25 25)' : 'oklch(55% 0.20 250)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(-1px)';
                btn.style.boxShadow =
                  isDangerous
                    ? '0 4px 12px rgba(200, 50, 50, 0.25)'
                    : '0 4px 12px rgba(100, 100, 200, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
