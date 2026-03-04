import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) {
      throw new NotFoundException('El slug del permiso ya existe');
    }

    const permission = this.repo.create({
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      module: dto.module,
      scope: dto.scope ?? 'shared',
    });

    const saved = await this.repo.save(permission);
    return {
      data: saved,
      message: 'Permiso creado exitosamente',
    };
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.repo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permiso no encontrado');
    }

    if (dto.slug && dto.slug !== permission.slug) {
      const existing = await this.repo.findOne({ where: { slug: dto.slug } });
      if (existing) throw new NotFoundException('El slug del permiso ya existe');
      permission.slug = dto.slug;
    }

    if (dto.name !== undefined) permission.name = dto.name;
    if (dto.description !== undefined) permission.description = dto.description;
    if (dto.module !== undefined) permission.module = dto.module;
    if (dto.scope !== undefined) permission.scope = dto.scope;

    const saved = await this.repo.save(permission);

    return {
      data: saved,
      message: 'Permiso actualizado exitosamente',
    };
  }

  async remove(id: string) {
    const permission = await this.repo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permiso no encontrado');

    await this.repo.softRemove(permission);

    return {
      data: null,
      message: 'Permiso eliminado exitosamente',
    };
  }
}
