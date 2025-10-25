import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLogsController } from './email_logs.controller';
import { EmailLogsService } from './email_logs.service';
import { EmailLogEntity } from './entities/email_log.entity';

@Module({
  controllers: [EmailLogsController],
  providers: [EmailLogsService],
  imports: [TypeOrmModule.forFeature([EmailLogEntity])],
})
export class EmailLogsModule {}
