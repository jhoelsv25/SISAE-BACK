import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

      if (!module) throw new NotFoundException('Módulo no encontrado');

      const actions = await manager.findByIds(ActionEntity, dto.actionIds || []);
      if (!actions.length) throw new NotFoundException('Acciones no encontradas');

      // Generar key tipo "moduleKey:action1,action2"
      const actionKeys = actions.map(a => a.key).join(',');
      const key = `${module.key}:${actionKeys}`;

      const permission = manager.create(PermissionEntity, {
        key,
        name: dto.name,
        description: dto.description,
        module,
        actions,
      });

      const saved = await manager.save(permission);

      return {
        data: saved,
        message: 'Permiso creado exitosamente',
      };
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    return await this.repo.manager.transaction(async manager => {
      const permission = await manager.findOne(PermissionEntity, {
        where: { id },
        relations: ['actions', 'module'],
      });

      if (!permission) throw new NotFoundException('Permiso no encontrado');

      let module = permission.module;
      let actions = permission.actions;

      if (dto.moduleId) {
        const newModule = await manager.findOne(ModuleEntity, { where: { id: dto.moduleId } });
        if (!newModule) throw new NotFoundException('Módulo no encontrado');
        module = newModule;
        permission.module = module;
      }

      if (dto.actionIds) {
        const newActions = await manager.findByIds(ActionEntity, dto.actionIds);
        if (!newActions.length) throw new NotFoundException('Acciones no encontradas');
        actions = newActions;
        permission.actions = actions;
      }

      // Regenerar key
      const actionKeys = actions.map(a => a.key).join(',');
      permission.key = `${module.key}:${actionKeys}`;

      Object.assign(permission, dto); // otros campos

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
