'use client';

import { useEffect } from 'react';
import { setupGlobalErrorHandler } from '@/lib/error-tracking';

/**
 * Setup global error handlers on mount
 * Catches unhandled JS errors and promise rejections
 */
export default function GlobalErrorSetup() {
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return null;
}
