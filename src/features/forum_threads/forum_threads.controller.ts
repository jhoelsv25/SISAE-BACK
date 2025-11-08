import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateForumThreadDto } from './dto/create-forum_thread.dto';
import { UpdateForumThreadDto } from './dto/update-forum_thread.dto';
import { ForumThreadsService } from './forum_threads.service';

@Controller('forum-threads')
export class ForumThreadsController {
  constructor(private readonly forumThreadsService: ForumThreadsService) {}

  @Post()
  async create(@Body() dto: CreateForumThreadDto) {
    return this.forumThreadsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.forumThreadsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumThreadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateForumThreadDto) {
    return this.forumThreadsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumThreadsService.remove(id);
  }
}
