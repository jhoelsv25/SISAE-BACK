import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subcriber: Redis;

  onModuleInit() {
    const options = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    };

    this.client = new Redis(options);
    this.subcriber = new Redis(options);
  }

  getClient(): Redis {
    return this.client;
  }

  getSubcriber(): Redis {
    return this.subcriber;
  }

  async onModuleDestroy() {
    const closers: Promise<unknown>[] = [];
    if (this.client) closers.push(this.client.quit());
    if (this.subcriber) closers.push(this.subcriber.quit());
    if (closers.length) {
      await Promise.all(closers);
    }
  }
}
