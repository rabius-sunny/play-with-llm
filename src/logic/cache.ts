import { Context } from 'hono';
import { CacheService } from '../services/cache';

const cacheService = new CacheService();

export const clearCache = async (c: Context) => {
  await cacheService.clear();
  return c.json({}, 200);
};
