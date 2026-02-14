import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AssignPermissionDto } from './dto/assing-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission';
import { RolePermissionsService } from './role-permissions.service';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  create(@Body() createRolePermissionDto: AssignPermissionDto) {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() removePermissionDto: RemovePermissionDto) {
    return this.rolePermissionsService.update(id, removePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolePermissionsService.remove(id);
  }
}
