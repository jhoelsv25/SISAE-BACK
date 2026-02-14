import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter> | null = null;

  constructor(app: INestApplication) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    let redisUrl = process.env.REDIS_URL;
    if (!redisUrl && process.env.REDIS_HOST) {
      const host = process.env.REDIS_HOST;
      const port = process.env.REDIS_PORT || '6379';
      const password = process.env.REDIS_PASSWORD;
      redisUrl = password
        ? `redis://:${encodeURIComponent(password)}@${host}:${port}`
        : `redis://${host}:${port}`;
    }
    if (!redisUrl) {
      this.logger.warn('⚠️ REDIS_URL o REDIS_HOST no configurado. Socket.IO sin adapter Redis.');
      return;
    }

    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    pubClient.on('error', e => this.logger.error(`Redis pub error: ${e.message}`));
    subClient.on('error', e => this.logger.error(`Redis sub error: ${e.message}`));

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient as any, subClient as any);
    this.logger.log('✅ Redis Socket adapter ready');
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }

    return server;
  }
}
