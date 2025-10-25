import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateGradeLevelDto } from './dto/create-grade_leevel.dto';
import { UpdateGradeLevelDto } from './dto/update-grade_leevel.dto';
import { GradeLevelService } from './grade_level.service';

@Controller('grade-level')
export class GradeLevelController {
  constructor(private readonly gradeLevelService: GradeLevelService) {}

  @Post()
  create(@Body() createGradeLevelDto: CreateGradeLevelDto) {
    return this.gradeLevelService.create(createGradeLevelDto);
  }

  @Get()
  findAll() {
    return this.gradeLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeLevelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeLevelDto: UpdateGradeLevelDto) {
    return this.gradeLevelService.update(+id, updateGradeLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeLevelService.remove(+id);
  }
}
