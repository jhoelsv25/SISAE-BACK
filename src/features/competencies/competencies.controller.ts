import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';

@Controller('competencies')
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  @Post()
  create(@Body() createCompetencyDto: CreateCompetencyDto) {
    return this.competenciesService.create(createCompetencyDto);
  }

  @Get()
  findAll() {
    return this.competenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competenciesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetencyDto: UpdateCompetencyDto) {
    return this.competenciesService.update(+id, updateCompetencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competenciesService.remove(+id);
  }
}
