/**
 * In-memory cache implementation with TTL support
 * Provides caching for Google Sheets API responses to minimize API calls
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;

  /**
   * Store data in cache with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttlSeconds - Time to live in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    };

    this.cache.set(key, entry);
    console.log(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
  }

  /**
   * Retrieve data from cache if not expired
   * @param {string} key - Cache key
   * @returns {T | null} Cached data or null if expired/missing
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      console.log(`Cache MISS: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      this.missCount++;
      console.log(`Cache EXPIRED: ${key}`);
      return null;
    }

    this.hitCount++;
    console.log(`Cache HIT: ${key}`);
    return entry.data as T;
  }

  /**
   * Remove specific key from cache
   * @param {string} key - Cache key to remove
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    console.log(`Cache CLEARED: ${size} entries removed`);
  }

  /**
   * Get cache statistics
   * @returns {object} Cache hit/miss statistics
   */
  getStats() {
    const total = this.hitCount + this.missCount;
    const hitRate =
      total > 0 ? ((this.hitCount / total) * 100).toFixed(2) : "0.00";

    return {
      hits: this.hitCount,
      misses: this.missCount,
      total,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Get all cache keys
   * @returns {string[]} Array of cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Singleton cache instance
export const cache = new InMemoryCache();

/**
 * Cache key generators for different data types
 */
export const CacheKeys = {
  PLAYERS: "players",
  PLAYER_BY_ID: (id: string) => `player:${id}`,
  SHEET_DATA: (sheetId: string, range: string) => `sheet:${sheetId}:${range}`,
};

/**
 * Cache utility functions
 */
export const CacheUtils = {
  /**
   * Get or set cached data with fallback to fetch function
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to fetch data if not cached
   * @param {number} ttlSeconds - Cache TTL in seconds
   * @returns {Promise<T>} Cached or freshly fetched data
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    try {
      const data = await fetchFn();
      cache.set(key, data, ttlSeconds);
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Invalidate cache entries by pattern
   * @param {string} pattern - Pattern to match keys (supports wildcards)
   */
  invalidatePattern(pattern: string): void {
    const keys = cache.getKeys();
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));

    keys.forEach((key) => {
      if (regex.test(key)) {
        cache.delete(key);
      }
    });
  },
};
