import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

@Injectable()
export class CacheService {
  constructor(private readonly redis: RedisService) {}

  async get(key: string): Promise<string | null> {
    return this.redis.getClient().get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = this.redis.getClient();
    if (ttlSeconds != null && ttlSeconds > 0) {
      await client.setex(key, ttlSeconds, value);
    } else {
      await client.set(key, value);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.getClient().del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const client = this.redis.getClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) await client.del(...keys);
  }
}
