import { Module } from '@nestjs/common';
import { AppBullmqModule } from './bullmq/bullmq.module';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { EventsModule } from './events/events.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { SocketModule } from './sockets/socket.module';

@Module({
  imports: [RedisModule, CacheModule, AppBullmqModule, EventsModule, SocketModule],
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService],
})
export class InfrastructureModule {}
