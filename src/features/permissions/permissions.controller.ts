import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AutoPermission } from '../../auth/decorators/auto-permission.decorator';
import { AdminRoles, OnlySuperAdmin } from '../../auth/decorators/common-roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { FilterPermissionDto } from './dto/filter-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './services/permissions.service';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @AdminRoles()
  async create(@Body() dto: CreatePermissionDto) {
    console.log(dto);
    return this.permissionsService.create(dto);
  }

  @Get()
  @AutoPermission('read')
  async findAll(@Query() filters: FilterPermissionDto) {
    return this.permissionsService.getAll(filters);
  }

  @Get(':id')
  @AutoPermission('read')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.getById(id);
  }

  @Patch(':id')
  @AdminRoles()
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @OnlySuperAdmin()
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
