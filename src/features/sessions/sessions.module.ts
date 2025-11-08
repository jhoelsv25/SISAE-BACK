import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [TypeOrmModule.forFeature([SessionEntity])],
})
export class SessionsModule {}
