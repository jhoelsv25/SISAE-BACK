import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FilterPermissionDto } from './dto/filter-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './services/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() dto: CreatePermissionDto) {
    console.log(dto);
    return this.permissionsService.create(dto);
  }

  @Get()
  async findAll(@Query() filters: FilterPermissionDto) {
    return this.permissionsService.getAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
