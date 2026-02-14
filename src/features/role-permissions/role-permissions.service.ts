import { Injectable } from '@nestjs/common';
import { AssignPermissionDto } from './dto/assing-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission';

@Injectable()
export class RolePermissionsService {
  create(dto: AssignPermissionDto) {
    return 'This action adds a new rolePermission';
  }

  findAll() {
    return `This action returns all rolePermissions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} rolePermission`;
  }

  update(id: string, dto: RemovePermissionDto) {
    return `This action updates a #${id} rolePermission`;
  }

  remove(id: string) {
    return `This action removes a #${id} rolePermission`;
  }
}
