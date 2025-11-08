import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.announcementsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
