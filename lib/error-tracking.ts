/**
 * Error tracking and logging
 *
 * Centralized error handling for client and server
 * Integration ready for Sentry, DataDog, or similar
 */

export interface ErrorLog {
  message: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  context?: Record<string, any>;
  timestamp: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

/**
 * Log error to console and external service
 */
export async function logError(
  message: string,
  context?: Record<string, any>,
  level: 'info' | 'warning' | 'error' | 'critical' = 'error'
) {
  const errorLog: ErrorLog = {
    message,
    level,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };

  // Log to console in development
  if (typeof window !== 'undefined') {
    const consoleMethod = level === 'critical' || level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, context);
  }

  // Send to external service (Sentry, DataDog, etc.)
  // TODO: Implement integration when service is chosen
  // await sendToExternalService(errorLog);

  return errorLog;
}

/**
 * Error boundary logger
 */
export function logComponentError(
  componentName: string,
  error: Error,
  errorInfo?: React.ErrorInfo
) {
  return logError(
    `Component error in ${componentName}: ${error.message}`,
    {
      component: componentName,
      stack: error.stack,
      errorInfo: errorInfo?.componentStack,
    },
    'critical'
  );
}

/**
 * API error logger
 */
export function logApiError(
  endpoint: string,
  status: number,
  error?: any
) {
  return logError(
    `API error on ${endpoint}: ${status}`,
    {
      endpoint,
      status,
      error: error?.message || error,
    },
    status >= 500 ? 'critical' : 'error'
  );
}

/**
 * Auth error logger
 */
export function logAuthError(operation: string, error: any) {
  return logError(
    `Auth error during ${operation}`,
    {
      operation,
      error: error?.message || error,
    },
    'critical'
  );
}

/**
 * Performance warning logger
 */
export function logPerformanceIssue(metric: string, value: number, threshold: number) {
  return logError(
    `Performance issue: ${metric} exceeded threshold`,
    {
      metric,
      value,
      threshold,
      exceeded: value - threshold,
    },
    'warning'
  );
}

/**
 * Track JavaScript errors globally
 */
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    logError(
      `Uncaught JavaScript error: ${event.message}`,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      },
      'critical'
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(
      `Unhandled promise rejection: ${event.reason}`,
      {
        reason: event.reason,
      },
      'critical'
    );
  });
}
