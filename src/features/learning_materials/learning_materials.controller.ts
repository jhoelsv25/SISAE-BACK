import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningMaterialsService } from './learning_materials.service';
import { CreateLearningMaterialDto } from './dto/create-learning_material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning_material.dto';

@Controller('learning-materials')
export class LearningMaterialsController {
  constructor(private readonly learningMaterialsService: LearningMaterialsService) {}

  @Post()
  create(@Body() createLearningMaterialDto: CreateLearningMaterialDto) {
    return this.learningMaterialsService.create(createLearningMaterialDto);
  }

  @Get()
  findAll() {
    return this.learningMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningMaterialsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningMaterialDto: UpdateLearningMaterialDto) {
    return this.learningMaterialsService.update(+id, updateLearningMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningMaterialsService.remove(+id);
  }
}
