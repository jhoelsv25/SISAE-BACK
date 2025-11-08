import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.schedulesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.schedulesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
