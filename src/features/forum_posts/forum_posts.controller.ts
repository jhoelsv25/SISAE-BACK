import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateForumPostDto } from './dto/create-forum_post.dto';
import { UpdateForumPostDto } from './dto/update-forum_post.dto';
import { ForumPostsService } from './forum_posts.service';

@Controller('forum-posts')
export class ForumPostsController {
  constructor(private readonly forumPostsService: ForumPostsService) {}

  @Post()
  create(@Body() dto: CreateForumPostDto) {
    return this.forumPostsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.forumPostsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumPostsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateForumPostDto) {
    return this.forumPostsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumPostsService.remove(id);
  }
}
