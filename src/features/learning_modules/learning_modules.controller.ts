import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningModulesService } from './learning_modules.service';
import { CreateLearningModuleDto } from './dto/create-learning_module.dto';
import { UpdateLearningModuleDto } from './dto/update-learning_module.dto';

@Controller('learning-modules')
export class LearningModulesController {
  constructor(private readonly learningModulesService: LearningModulesService) {}

  @Post()
  create(@Body() createLearningModuleDto: CreateLearningModuleDto) {
    return this.learningModulesService.create(createLearningModuleDto);
  }

  @Get()
  findAll() {
    return this.learningModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningModulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningModuleDto: UpdateLearningModuleDto) {
    return this.learningModulesService.update(+id, updateLearningModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningModulesService.remove(+id);
  }
}
