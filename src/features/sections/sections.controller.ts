import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.sectionsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }
}
