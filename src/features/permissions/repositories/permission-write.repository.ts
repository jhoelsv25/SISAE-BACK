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

  // Crear un permiso
  async create(dto: CreatePermissionDto) {
    const module = await this.repo.manager.findOne(ModuleEntity, {
      where: { id: dto.moduleId },
      select: ['id', 'name', 'key'],
    });
    const actionRepo = this.repo.manager.getRepository('actions');
    const action = await actionRepo.findOne({
      where: { id: dto.actionId },
      select: ['id', 'key'],
    });
    if (!module || !action) throw new NotFoundException('Módulo o acción no encontrados');

    const key = `${module.key}:${action.key}`;

    const permission = this.repo.create({
      name: dto.name,
      description: dto.description,
      module: { id: dto.moduleId },
      action: { id: dto.actionId },
    });
    const res = await this.repo.save(permission);
    return {
      data: {
        id: res.id,
        name: res.name,
        description: res.description,
        action: action ? { id: action.id, key: action.key } : null,
        module: module ? { id: module.id, name: module.name, key: module.key } : null,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      },
      message: 'Permiso creado exitosamente',
    };
  }

  // Actualizar un permiso
  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permiso no encontrado');

    // Si se actualiza el módulo o la acción, recalcular el key
    let newKey = permission.key;
    let module = permission.module;
    let action = permission.action;

    if (dto.moduleId && dto.actionId) {
      module = await this.repo.manager.findOne(ModuleEntity, {
        where: { id: dto.moduleId },
        select: ['id', 'key', 'name'],
      });
      action = await this.repo.manager.findOne(ActionEntity, {
        where: { id: dto.actionId },
        select: ['id', 'key'],
      });
      if (!module || !action) throw new NotFoundException('Módulo o acción no encontrados');
      newKey = `${module.key}:${action.key}`;
      permission.module = module;
      permission.action = action;
    } else if (dto.moduleId) {
      module = await this.repo.manager.findOne(ModuleEntity, {
        where: { id: dto.moduleId },
        select: ['id', 'key', 'name'],
      });
      if (!module) throw new NotFoundException('Módulo no encontrado');
      newKey = `${module.key}:${action.key}`;
      permission.module = module;
    } else if (dto.actionId) {
      action = await this.repo.manager.findOne(ActionEntity, {
        where: { id: dto.actionId },
        select: ['id', 'key'],
      });
      if (!action) throw new NotFoundException('Acción no encontrada');
      newKey = `${module.key}:${action.key}`;
      permission.action = action;
    }

    Object.assign(permission, dto); // aplicar otros cambios
    permission.key = newKey;
    const res = await this.repo.save(permission);
    return {
      data: res,
      message: 'Permiso actualizado exitosamente',
    };
  }

  // Eliminar un permiso
  async remove(id: string) {
    const permission = await this.repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permiso no encontrado');

    // En lugar de borrarlo físicamente, puedes hacer soft delete si quieres
    const res = await this.repo.softRemove(permission);

    return {
      data: null,
      message: 'Permiso eliminado exitosamente',
    };
  }
}
