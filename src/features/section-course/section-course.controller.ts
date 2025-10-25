import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionCourseService } from './section-course.service';
import { CreateSectionCourseDto } from './dto/create-section-course.dto';
import { UpdateSectionCourseDto } from './dto/update-section-course.dto';

@Controller('section-course')
export class SectionCourseController {
  constructor(private readonly sectionCourseService: SectionCourseService) {}

  @Post()
  create(@Body() createSectionCourseDto: CreateSectionCourseDto) {
    return this.sectionCourseService.create(createSectionCourseDto);
  }

  @Get()
  findAll() {
    return this.sectionCourseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionCourseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionCourseDto: UpdateSectionCourseDto) {
    return this.sectionCourseService.update(+id, updateSectionCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionCourseService.remove(+id);
  }
}
