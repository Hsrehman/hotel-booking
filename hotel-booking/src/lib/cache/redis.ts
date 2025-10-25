import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  async generateSearchHash(searchParams: any): Promise<string> {
    const crypto = await import('crypto');
    const hash = crypto.createHash('md5');
    hash.update(JSON.stringify(searchParams));
    return hash.digest('hex');
  }

  // Cache key generators
  static destinationKey(searchTerm: string): string {
    return `dest:${searchTerm.toLowerCase()}`;
  }

  static hotelStaticKey(hotelCode: string): string {
    return `hotel:static:${hotelCode}`;
  }

  static searchKey(hash: string): string {
    return `search:${hash}`;
  }

  static sessionKey(token: string): string {
    return `session:${token}`;
  }
}

export const cacheService = new CacheService();
