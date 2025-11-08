import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSubjectAreaDto } from './dto/create-subject_area.dto';
import { UpdateSubjectAreaDto } from './dto/update-subject_area.dto';
import { SubjectAreaService } from './subject_area.service';

@Controller('subject-area')
export class SubjectAreaController {
  constructor(private readonly subjectAreaService: SubjectAreaService) {}

  @Post()
  create(@Body() dto: CreateSubjectAreaDto) {
    return this.subjectAreaService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.subjectAreaService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectAreaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubjectAreaDto) {
    return this.subjectAreaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectAreaService.remove(id);
  }
}
