import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AutoPermission } from '../../auth/decorators/auto-permission.decorator';
import { AdminRoles, OnlySuperAdmin } from '../../auth/decorators/common-roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './services/role.service';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @AdminRoles()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @AutoPermission('read')
  findAll() {
    return this.roleService.getAll();
  }

  //modulos y permisos asociados al rol
  @Get(':id/modules')
  @AutoPermission('read')
  findModules(@Param('id') id: string) {
    return this.roleService.getModulesAndPermissionsByRoleId(id);
  }

  @Get(':id')
  @AutoPermission('read')
  findOne(@Param('id') id: string) {
    return this.roleService.getById(id);
  }

  @Patch(':id')
  @AdminRoles()
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @OnlySuperAdmin()
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
