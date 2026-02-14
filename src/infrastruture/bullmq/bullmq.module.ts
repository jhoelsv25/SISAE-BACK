import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { bullmqConfig } from './bullmq.config';

@Global()
@Module({
  imports: [BullModule.forRoot(bullmqConfig)],
})
export class AppBullmqModule {}
