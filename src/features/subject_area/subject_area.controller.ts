import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectAreaService } from './subject_area.service';
import { CreateSubjectAreaDto } from './dto/create-subject_area.dto';
import { UpdateSubjectAreaDto } from './dto/update-subject_area.dto';

@Controller('subject-area')
export class SubjectAreaController {
  constructor(private readonly subjectAreaService: SubjectAreaService) {}

  @Post()
  create(@Body() createSubjectAreaDto: CreateSubjectAreaDto) {
    return this.subjectAreaService.create(createSubjectAreaDto);
  }

  @Get()
  findAll() {
    return this.subjectAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectAreaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectAreaDto: UpdateSubjectAreaDto) {
    return this.subjectAreaService.update(+id, updateSubjectAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectAreaService.remove(+id);
  }
}
