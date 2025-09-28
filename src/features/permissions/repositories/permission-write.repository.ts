import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const permission = this.repo.create({
      name: dto.name,
      description: dto.description,
      module: { id: dto.moduleId },
      action: dto.action,
    });
    const res = await this.repo.save(permission);
    // Consultar el módulo para obtener id y name reales
    const module = await this.repo.manager.findOne(ModuleEntity, {
      where: { id: dto.moduleId },
      select: ['id', 'name'],
    });
    return {
      data: {
        id: res.id,
        name: res.name,
        description: res.description,
        action: res.action,
        module: module ? { id: module.id, name: module.name } : null,
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

    Object.assign(permission, dto); // aplicar cambios
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
