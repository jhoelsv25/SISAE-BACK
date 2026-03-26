import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';
import { VirtualClassroomsService } from './virtual_classrooms.service';

@UseGuards(JwtAuthGuard)
@Controller('virtual-classrooms')
export class VirtualClassroomsController {
  constructor(private readonly virtualClassroomsService: VirtualClassroomsService) {}

  @Post()
  async create(@Body() dto: CreateVirtualClassroomDto) {
    return this.virtualClassroomsService.create(dto);
  }

  @Get()
  async findAll(@Query() filters: FilterBaseDto, @Req() req: any) {
    return this.virtualClassroomsService.findAll(filters, req.user?.id);
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
