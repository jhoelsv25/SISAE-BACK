import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumEntity } from './entities/forum.entity';
import { ForumsController } from './forums.controller';
import { ForumsService } from './forums.service';

@Module({
  controllers: [ForumsController],
  providers: [ForumsService],
  imports: [TypeOrmModule.forFeature([ForumEntity])],
})
export class ForumsModule {}
