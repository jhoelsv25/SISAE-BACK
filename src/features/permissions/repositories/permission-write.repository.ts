import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ActionEntity } from '../../actions/entities/action.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionWriteRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repo: Repository<PermissionEntity>,
  ) {}

  async create(dto: CreatePermissionDto) {
    return await this.repo.manager.transaction(async manager => {
      const module = await manager.findOne(ModuleEntity, {
        where: { id: dto.moduleId },
        select: ['id', 'key', 'name'],
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      const actions = await manager.findBy(ActionEntity, {
        id: In(dto.actionIds || []),
      });

      if (!actions.length) {
        throw new NotFoundException('Acciones no encontradas');
      }

      const createdPermissions: PermissionEntity[] = [];

      for (const action of actions) {
        const key = `${module.key}:${action.key}`;

        const existing = await manager.findOne(PermissionEntity, { where: { key } });
        if (existing) continue;

        const permission = manager.create(PermissionEntity, {
          key,
          name: dto.name,
          description: dto.description,
          module,
          action,
        });

        const saved = await manager.save(permission);
        createdPermissions.push(saved);
      }

      return {
        data: createdPermissions,
        message: `Se crearon ${createdPermissions.length} permisos`,
      };
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    return await this.repo.manager.transaction(async manager => {
      const permission = await manager.findOne(PermissionEntity, {
        where: { id },
        relations: ['action', 'module'],
      });

      if (!permission) {
        throw new NotFoundException('Permiso no encontrado');
      }

      let module = permission.module;
      let action = permission.action;

      // 🔁 Si cambia el módulo
      if (dto.moduleId) {
        const newModule = await manager.findOne(ModuleEntity, { where: { id: dto.moduleId } });
        if (!newModule) throw new NotFoundException('Módulo no encontrado');
        module = newModule;
      }

      if (dto.actionIds && dto.actionIds.length > 0) {
        const newAction = await manager.findOne(ActionEntity, {
          where: { id: dto.actionIds[0] },
        });
        if (!newAction) throw new NotFoundException('Acción no encontrada');
        action = newAction;
      }

      const key = `${module.key}:${action.key}`;
      permission.key = key;
      permission.module = module;
      permission.action = action;

      if (dto.name !== undefined) permission.name = dto.name;
      if (dto.description !== undefined) permission.description = dto.description;

      const saved = await manager.save(permission);

      return {
        data: saved,
        message: 'Permiso actualizado exitosamente',
      };
    });
  }

  // Eliminar un permiso
  async remove(id: string) {
    const permission = await this.repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permiso no encontrado');

    // En lugar de borrarlo físicamente, puedes hacer soft delete si quieres
    await this.repo.softRemove(permission);

    return {
      data: null,
      message: 'Permiso eliminado exitosamente',
    };
  }
}
