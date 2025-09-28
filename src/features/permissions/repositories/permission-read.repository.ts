import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { FilterPermissionDto } from '../dto/filter-permission.dto';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionReadRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repo: Repository<PermissionEntity>,
  ) {}

  async findAll(filters?: FilterPermissionDto) {
    try {
      const page = filters?.page ?? 1;
      const size = filters?.size ?? 20;

      const query = this.repo
        .createQueryBuilder('permission')
        .leftJoinAndSelect('permission.module', 'module') // Cambiado a AndSelect
        .where('permission.deletedAt IS NULL');
      if (filters?.search) {
        query.andWhere('permission.name ILIKE :search OR permission.action ILIKE :search', {
          search: `%${filters.search}%`,
        });
      }

      // Filtro por fecha de creación
      if (filters?.createdAtFrom) {
        query.andWhere('permission.createdAt >= :createdAtFrom', {
          createdAtFrom: filters.createdAtFrom,
        });
      }
      if (filters?.createdAtTo) {
        query.andWhere('permission.createdAt <= :createdAtTo', {
          createdAtTo: filters.createdAtTo,
        });
      }

      // Ordenar por fecha de creación descendente por defecto
      query.orderBy('permission.createdAt', 'DESC');

      query.skip((page - 1) * size).take(size);

      const [data, total] = await query.getManyAndCount();

      // Mapear para devolver el módulo solo con id y name
      const mappedData = data.map(perm => ({
        id: perm.id,
        name: perm.name,
        action: perm.action,
        description: perm.description,
        module: perm.module ? { id: perm.module.id, name: perm.module.name } : null,
        createdAt: perm.createdAt,
        updatedAt: perm.updatedAt,
      }));

      return {
        data: mappedData,
        total,
        page,
        size,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.repo
        .createQueryBuilder('permission')
        .leftJoin('permission.module', 'module')
        .addSelect(['module.id', 'module.name'])
        .where('permission.id = :id', { id })
        .getOne();

      if (!permission) throw new NotFoundException('Permiso no encontrado');
      return permission;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
