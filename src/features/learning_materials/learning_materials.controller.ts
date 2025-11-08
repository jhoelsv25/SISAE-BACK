import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateLearningMaterialDto } from './dto/create-learning_material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning_material.dto';
import { LearningMaterialsService } from './learning_materials.service';

@Controller('learning-materials')
export class LearningMaterialsController {
  constructor(private readonly learningMaterialsService: LearningMaterialsService) {}

  @Post()
  async create(@Body() dto: CreateLearningMaterialDto) {
    return this.learningMaterialsService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.learningMaterialsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningMaterialsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLearningMaterialDto) {
    return this.learningMaterialsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningMaterialsService.remove(id);
  }
}
