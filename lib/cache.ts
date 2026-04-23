/**
 * Client-side caching utilities
 *
 * Cache user data, API responses, and expensive computations
 * Uses browser localStorage and in-memory cache
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * In-memory cache (resets on page reload)
 */
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMinutes: number = 5) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

/**
 * LocalStorage cache (persists across page reloads)
 */
class LocalStorageCache {
  private prefix = 'crispy_cache_';

  set<T>(key: string, data: T, ttlMinutes: number = 60) {
    if (typeof window === 'undefined') return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to cache in localStorage:', e);
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);

      if (Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.data;
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
      return null;
    }
  }

  clear(key?: string) {
    if (typeof window === 'undefined') return;

    if (key) {
      localStorage.removeItem(this.prefix + key);
    } else {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(this.prefix)) {
          localStorage.removeItem(k);
        }
      });
    }
  }

  has(key: string): boolean {
    const data = this.get(key);
    return data !== null;
  }
}

/**
 * Cache keys (standardized across app)
 */
export const cacheKeys = {
  // User data
  userProfile: 'user_profile',
  userResources: 'user_resources',
  userAssessments: 'user_assessments',

  // Assessments
  assessmentResults: (type: string) => `assessment_${type}_results`,

  // Resources
  resourceContent: (slug: string) => `resource_${slug}`,
  allResources: 'all_resources',

  // Community
  teamMembers: (teamId: string) => `team_${teamId}_members`,
  peerGroup: (groupId: string) => `peer_${groupId}`,
};

// Export singletons
export const memoryCache = new MemoryCache();
export const localStorageCache = new LocalStorageCache();

/**
 * Convenience function: try memory first, then localStorage
 */
export function getCached<T>(key: string): T | null {
  const memData = memoryCache.get<T>(key);
  if (memData) return memData;

  return localStorageCache.get<T>(key);
}

/**
 * Convenience function: cache in both stores
 */
export function setCached<T>(key: string, data: T, ttlMinutes?: number) {
  memoryCache.set(key, data, 5);
  localStorageCache.set(key, data, ttlMinutes || 60);
}

/**
 * Convenience function: clear from both stores
 */
export function clearCache(key?: string) {
  memoryCache.clear(key);
  localStorageCache.clear(key);
}
