import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() dto: CreateModuleDto) {
    console.log('Creating module with data:', dto);
    return await this.modulesService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return await this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.modulesService.remove(id);
  }
}
