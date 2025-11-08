import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  create(@Body() dto: CreateGradeDto) {
    return this.gradesService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.gradesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGradeDto) {
    return this.gradesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradesService.remove(id);
  }
}
