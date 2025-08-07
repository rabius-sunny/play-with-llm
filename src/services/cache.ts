import { db, queryCache } from '../db';
import { eq, lt } from 'drizzle-orm';
import { createHash } from 'crypto';

export class CacheService {
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

  async get(query: string): Promise<string | null> {
    try {
      const queryHash = this.hashQuery(query);
      const now = new Date();

      const cached = await db
        .select()
        .from(queryCache)
        .where(eq(queryCache.queryHash, queryHash))
        .limit(1);

      if (cached.length === 0) {
        return null;
      }

      const cacheEntry = cached[0];

      // Check if cache is expired
      if (cacheEntry.expiresAt < now) {
        // Delete expired cache entry
        await db.delete(queryCache).where(eq(queryCache.queryHash, queryHash));
        return null;
      }

      return cacheEntry.cachedResponse;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(query: string, response: string): Promise<void> {
    try {
      const queryHash = this.hashQuery(query);
      const expiresAt = new Date(Date.now() + this.CACHE_DURATION);

      // Use upsert pattern - try to update first, then insert if not exists
      await db.insert(queryCache).values({
        queryHash,
        cachedResponse: response,
        expiresAt
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await db.delete(queryCache);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async clearExpired(): Promise<void> {
    try {
      const now = new Date();
      await db.delete(queryCache).where(lt(queryCache.expiresAt, now));
    } catch (error) {
      console.error('Cache clear expired error:', error);
    }
  }

  private hashQuery(query: string): string {
    return createHash('sha256')
      .update(query.toLowerCase().trim())
      .digest('hex');
  }
}
