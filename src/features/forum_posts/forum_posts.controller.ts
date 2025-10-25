import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForumPostsService } from './forum_posts.service';
import { CreateForumPostDto } from './dto/create-forum_post.dto';
import { UpdateForumPostDto } from './dto/update-forum_post.dto';

@Controller('forum-posts')
export class ForumPostsController {
  constructor(private readonly forumPostsService: ForumPostsService) {}

  @Post()
  create(@Body() createForumPostDto: CreateForumPostDto) {
    return this.forumPostsService.create(createForumPostDto);
  }

  @Get()
  findAll() {
    return this.forumPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumPostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumPostDto: UpdateForumPostDto) {
    return this.forumPostsService.update(+id, updateForumPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumPostsService.remove(+id);
  }
}
