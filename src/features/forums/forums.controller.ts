import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumsService } from './forums.service';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  create(@Body() dto: CreateForumDto) {
    return this.forumsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.forumsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateForumDto) {
    return this.forumsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumsService.remove(id);
  }
}
