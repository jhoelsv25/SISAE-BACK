import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumThreadEntity } from './entities/forum_thread.entity';
import { ForumThreadsController } from './forum_threads.controller';
import { ForumThreadsService } from './forum_threads.service';

@Module({
  controllers: [ForumThreadsController],
  providers: [ForumThreadsService],
  imports: [TypeOrmModule.forFeature([ForumThreadEntity])],
})
export class ForumThreadsModule {}
