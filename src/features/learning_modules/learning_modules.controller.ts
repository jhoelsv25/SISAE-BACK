import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateLearningModuleDto } from './dto/create-learning_module.dto';
import { UpdateLearningModuleDto } from './dto/update-learning_module.dto';
import { LearningModulesService } from './learning_modules.service';

@Controller('learning-modules')
export class LearningModulesController {
  constructor(private readonly learningModulesService: LearningModulesService) {}

  @Post()
  create(@Body() dto: CreateLearningModuleDto) {
    return this.learningModulesService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.learningModulesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningModulesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLearningModuleDto) {
    return this.learningModulesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningModulesService.remove(id);
  }
}
