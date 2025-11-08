import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';

@Controller('competencies')
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  @Post()
  create(@Body() dto: CreateCompetencyDto) {
    return this.competenciesService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.competenciesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competenciesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompetencyDto) {
    return this.competenciesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competenciesService.remove(id);
  }
}
