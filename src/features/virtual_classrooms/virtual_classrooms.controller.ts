import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirtualClassroomsService } from './virtual_classrooms.service';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';

@Controller('virtual-classrooms')
export class VirtualClassroomsController {
  constructor(private readonly virtualClassroomsService: VirtualClassroomsService) {}

  @Post()
  create(@Body() createVirtualClassroomDto: CreateVirtualClassroomDto) {
    return this.virtualClassroomsService.create(createVirtualClassroomDto);
  }

  @Get()
  findAll() {
    return this.virtualClassroomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualClassroomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirtualClassroomDto: UpdateVirtualClassroomDto) {
    return this.virtualClassroomsService.update(+id, updateVirtualClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.virtualClassroomsService.remove(+id);
  }
}
