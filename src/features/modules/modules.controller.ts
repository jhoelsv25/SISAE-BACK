import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AutoPermission } from '../../auth/decorators/auto-permission.decorator';
import { AdminRoles, OnlySuperAdmin } from '../../auth/decorators/common-roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateModuleDto } from './dto/create-module.dto';
import { FilterModuleDto } from './dto/filter-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './services/modules.service';

@ApiTags('modules')
@ApiBearerAuth()
@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @AdminRoles()
  async create(@Body() dto: CreateModuleDto) {
    return await this.modulesService.create(dto);
  }

  @Get()
  @AutoPermission('read')
  async findAll(@Query() filters: FilterModuleDto) {
    return await this.modulesService.getAll(filters);
  }

  @Get(':id')
  @AutoPermission('read')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.getById(id);
  }

  @Put(':id')
  @AdminRoles()
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return await this.modulesService.update(id, dto);
  }

  @Delete(':id')
  @OnlySuperAdmin()
  async remove(@Param('id') id: string) {
    return await this.modulesService.remove(id);
  }
}
