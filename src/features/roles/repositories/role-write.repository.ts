import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { PermissionEntity } from '../../permissions/entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleWriteRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateRoleDto) {
    return this.dataSource.transaction(async manager => {
      const role = manager.create(RoleEntity, { name: dto.name, description: dto.description });

      if (dto.permissionIds?.length) {
        role.permissions = await manager.find(PermissionEntity, {
          where: { id: In(dto.permissionIds) },
        });
      }

      await manager.save(role);
      return {
        data: role,
        message: 'Rol creado correctamente',
      };
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    return this.dataSource.transaction(async manager => {
      const role = await manager.findOne(RoleEntity, { where: { id }, relations: ['permissions'] });
      if (!role) throw new NotFoundException('El rol no existe');

      if (dto.name) role.name = dto.name;
      if (dto.description) role.description = dto.description;

      if (dto.permissionIds) {
        const currentIds = role.permissions.map(p => p.id);

        // Permisos a agregar
        const toAddIds = dto.permissionIds.filter(id => !currentIds.includes(id));
        const toAdd = await manager.findBy(PermissionEntity, { id: In(toAddIds) });

        // Permisos a quitar
        const toRemove = role.permissions.filter(p => !dto.permissionIds.includes(p.id));

        // Actualizar relación
        role.permissions = role.permissions
          .filter(p => dto.permissionIds.includes(p.id))
          .concat(toAdd);
      }

      await manager.save(role);
      return {
        data: role,
        message: 'Rol actualizado correctamente',
      };
    });
  }

  async softDelete(id: string) {
    return this.dataSource.transaction(async manager => {
      const role = await manager.findOne(RoleEntity, { where: { id } });
      if (!role) throw new ErrorHandler('El rol no existe');
      role.deletedAt = new Date();
      await manager.save(role);
      return { message: 'Rol eliminado correctamente' };
    });
  }
}
