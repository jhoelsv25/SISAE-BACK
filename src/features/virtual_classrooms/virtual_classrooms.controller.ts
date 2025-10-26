import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';
import { VirtualClassroomsService } from './virtual_classrooms.service';

@Controller('virtual-classrooms')
export class VirtualClassroomsController {
  constructor(private readonly virtualClassroomsService: VirtualClassroomsService) {}

  @Post()
  async create(@Body() dto: CreateVirtualClassroomDto) {
    return this.virtualClassroomsService.create(dto);
  }

  @Get()
  async findAll(@Query() filters: FilterBaseDto) {
    return this.virtualClassroomsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.virtualClassroomsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVirtualClassroomDto) {
    return this.virtualClassroomsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.virtualClassroomsService.remove(id);
  }
}
