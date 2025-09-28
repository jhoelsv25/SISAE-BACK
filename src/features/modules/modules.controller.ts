import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { FilterModuleDto } from './dto/filter-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './services/modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() dto: CreateModuleDto) {
    return await this.modulesService.create(dto);
  }

  @Get()
  async findAll(@Query() filters: FilterModuleDto) {
    return await this.modulesService.getAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return await this.modulesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.modulesService.remove(id);
  }
}
