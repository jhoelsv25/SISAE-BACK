import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGradeLevelDto } from './dto/create-grade_leevel.dto';
import { UpdateGradeLevelDto } from './dto/update-grade_leevel.dto';
import { GradeLevelService } from './grade_level.service';

@Controller('grade-level')
export class GradeLevelController {
  constructor(private readonly gradeLevelService: GradeLevelService) {}

  @Post()
  create(@Body() dto: CreateGradeLevelDto) {
    return this.gradeLevelService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.gradeLevelService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeLevelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGradeLevelDto) {
    return this.gradeLevelService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeLevelService.remove(id);
  }
}
