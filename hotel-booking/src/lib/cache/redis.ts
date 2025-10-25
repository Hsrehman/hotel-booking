import Redis from 'ioredis';

class CacheService {
  private redis: Redis;
  private isConnected: boolean = false;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('connect', () => {
      console.log('[Redis] Connected to Redis');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      console.error('[Redis] Connection error:', error);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      console.log('[Redis] Connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Get cached value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) {
        console.warn('[Redis] Not connected, skipping cache get');
        return null;
      }

      const value = await this.redis.get(key);
      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('[Redis] Error getting cache:', error);
      return null;
    }
  }

  /**
   * Set cached value with TTL
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        console.warn('[Redis] Not connected, skipping cache set');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }

      return true;
    } catch (error) {
      console.error('[Redis] Error setting cache:', error);
      return false;
    }
  }

  /**
   * Delete cached value by key
   */
  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        console.warn('[Redis] Not connected, skipping cache delete');
        return false;
      }

      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('[Redis] Error deleting cache:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected) {
        console.warn('[Redis] Not connected, skipping cache pattern delete');
        return 0;
      }

      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      return await this.redis.del(...keys);
    } catch (error) {
      console.error('[Redis] Error deleting cache pattern:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('[Redis] Error checking cache existence:', error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return -1;
      }

      return await this.redis.ttl(key);
    } catch (error) {
      console.error('[Redis] Error getting TTL:', error);
      return -1;
    }
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string): Promise<number> {
    try {
      if (!this.isConnected) {
        return 0;
      }

      return await this.redis.incr(key);
    } catch (error) {
      console.error('[Redis] Error incrementing cache:', error);
      return 0;
    }
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.redis.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      console.error('[Redis] Error setting expiration:', error);
      return false;
    }
  }

  /**
   * Generate cache key for destination search
   */
  generateDestinationKey(searchTerm: string): string {
    return `dest:${searchTerm.toLowerCase().trim()}`;
  }

  /**
   * Generate cache key for hotel static data
   */
  generateHotelStaticKey(hotelCode: string): string {
    return `hotel:static:${hotelCode}`;
  }

  /**
   * Generate cache key for search results
   */
  generateSearchKey(searchHash: string): string {
    return `search:${searchHash}`;
  }

  /**
   * Generate cache key for session data
   */
  generateSessionKey(token: string): string {
    return `session:${token}`;
  }

  /**
   * Generate search hash from search parameters
   */
  generateSearchHash(searchParams: any): string {
    const sortedParams = JSON.stringify(searchParams, Object.keys(searchParams).sort());
    return Buffer.from(sortedParams).toString('base64').replace(/[+/=]/g, '');
  }

  /**
   * Cache destination search results
   */
  async cacheDestinationSearch(searchTerm: string, results: any[], ttlSeconds: number = 7 * 24 * 60 * 60): Promise<void> {
    const key = this.generateDestinationKey(searchTerm);
    await this.set(key, results, ttlSeconds);
  }

  /**
   * Get cached destination search results
   */
  async getCachedDestinationSearch(searchTerm: string): Promise<any[] | null> {
    const key = this.generateDestinationKey(searchTerm);
    return await this.get<any[]>(key);
  }

  /**
   * Cache hotel static data
   */
  async cacheHotelStatic(hotelCode: string, hotelData: any, ttlSeconds: number = 24 * 60 * 60): Promise<void> {
    const key = this.generateHotelStaticKey(hotelCode);
    await this.set(key, hotelData, ttlSeconds);
  }

  /**
   * Get cached hotel static data
   */
  async getCachedHotelStatic(hotelCode: string): Promise<any | null> {
    const key = this.generateHotelStaticKey(hotelCode);
    return await this.get<any>(key);
  }

  /**
   * Cache search results
   */
  async cacheSearchResults(searchHash: string, results: any, ttlSeconds: number = 60): Promise<void> {
    const key = this.generateSearchKey(searchHash);
    await this.set(key, results, ttlSeconds);
  }

  /**
   * Get cached search results
   */
  async getCachedSearchResults(searchHash: string): Promise<any | null> {
    const key = this.generateSearchKey(searchHash);
    return await this.get<any>(key);
  }

  /**
   * Cache session data
   */
  async cacheSessionData(token: string, sessionData: any, ttlSeconds?: number): Promise<void> {
    const key = this.generateSessionKey(token);
    await this.set(key, sessionData, ttlSeconds);
  }

  /**
   * Get cached session data
   */
  async getCachedSessionData(token: string): Promise<any | null> {
    const key = this.generateSessionKey(token);
    return await this.get<any>(key);
  }

  /**
   * Invalidate session cache
   */
  async invalidateSession(token: string): Promise<void> {
    const key = this.generateSessionKey(token);
    await this.del(key);
  }

  /**
   * Clear all cache (use with caution)
   */
  async clearAll(): Promise<void> {
    try {
      if (!this.isConnected) {
        console.warn('[Redis] Not connected, skipping cache clear');
        return;
      }

      await this.redis.flushall();
      console.log('[Redis] All cache cleared');
    } catch (error) {
      console.error('[Redis] Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      if (!this.isConnected) {
        return null;
      }

      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: info,
        keyspace: keyspace,
      };
    } catch (error) {
      console.error('[Redis] Error getting stats:', error);
      return null;
    }
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('[Redis] Connection closed gracefully');
    } catch (error) {
      console.error('[Redis] Error closing connection:', error);
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();
