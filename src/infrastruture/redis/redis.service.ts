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
    await Promise.all([this.client.quit(), this.subcriber.quit()]);
  }
}
