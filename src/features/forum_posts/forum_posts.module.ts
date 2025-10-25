import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPostEntity } from './entities/forum_post.entity';
import { ForumPostsController } from './forum_posts.controller';
import { ForumPostsService } from './forum_posts.service';

@Module({
  controllers: [ForumPostsController],
  providers: [ForumPostsService],
  imports: [TypeOrmModule.forFeature([ForumPostEntity])],
})
export class ForumPostsModule {}
