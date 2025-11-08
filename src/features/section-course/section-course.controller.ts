import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSectionCourseDto } from './dto/create-section-course.dto';
import { UpdateSectionCourseDto } from './dto/update-section-course.dto';
import { SectionCourseService } from './section-course.service';

@Controller('section-course')
export class SectionCourseController {
  constructor(private readonly sectionCourseService: SectionCourseService) {}

  @Post()
  create(@Body() dto: CreateSectionCourseDto) {
    return this.sectionCourseService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.sectionCourseService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionCourseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectionCourseDto) {
    return this.sectionCourseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionCourseService.remove(id);
  }
}
