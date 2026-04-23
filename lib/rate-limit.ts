/**
 * Rate limiting utilities
 *
 * Protect API routes from abuse
 * Usage: add to API route handlers
 */

interface RateLimitConfig {
  windowMs: number; // Time window in ms
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.startCleanup();
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.store[key];

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const entry = this.store[key];
    if (!entry || Date.now() > entry.resetTime) {
      return this.config.maxRequests;
    }
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number {
    const entry = this.store[key];
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + this.config.windowMs;
    }
    return entry.resetTime;
  }

  /**
   * Cleanup old entries (runs periodically)
   */
  private startCleanup() {
    setInterval(() => {
      const now = Date.now();
      Object.entries(this.store).forEach(([key, entry]) => {
        if (now > entry.resetTime) {
          delete this.store[key];
        }
      });
    }, this.config.windowMs * 2);
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // General API: 100 requests per minute per IP
  general: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
  }),

  // Auth routes: 5 requests per 15 minutes per IP (prevent brute force)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  }),

  // Resource upload: 10 per hour per user
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
  }),

  // Assessment submit: 5 per hour per user (prevent spam)
  assessment: new RateLimiter({
    windowMs: 60 * 60 * 1000,
    maxRequests: 5,
  }),
};

/**
 * Middleware for API route rate limiting
 *
 * Usage in route.ts:
 * ```
 * import { rateLimiters } from '@/lib/rate-limit';
 *
 * export async function POST(request: Request) {
 *   const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *   if (!rateLimiters.general.isAllowed(ip)) {
 *     return new Response('Too many requests', { status: 429 });
 *   }
 *   // ... rest of handler
 * }
 * ```
 */
export function createRateLimitMiddleware(limiter: RateLimiter, getKey: (req: Request) => string) {
  return (req: Request) => {
    const key = getKey(req);
    if (!limiter.isAllowed(key)) {
      const resetTime = limiter.getResetTime(key);
      return new Response('Too many requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
        },
      });
    }
    return null; // Allow request
  };
}
