import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Post('queue')
  queue(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.queueSend(dto);
  }

  @Get()
  findAll(@Query() filter: FilterNotificationDto, @Req() req: Request) {
    return this.notificationsService.findAll(filter, req.user as { id?: string } | undefined);
  }

  @Get('cursor')
  findAllCursor(@Query() query: any, @Req() req: Request) {
    return this.notificationsService.findAllCursor(query, req.user as { id?: string } | undefined);
  }

  @Patch('mark-all-read')
  markAllRead(@Req() req: Request) {
    return this.notificationsService.markAllAsRead(req.user as { id?: string } | undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto, @Req() req: Request) {
    return this.notificationsService.update(id, dto, req.user as { id?: string } | undefined);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
