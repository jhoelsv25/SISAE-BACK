import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @Get()
  findAll(@Query() query: FilterTeacherDto) {
    return this.teachersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
