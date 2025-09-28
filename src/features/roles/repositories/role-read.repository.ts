import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterRoleDto } from '../dto/filte-role.dto';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleReadRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repo: Repository<RoleEntity>,
  ) {}

  async findAll(filters?: FilterRoleDto) {
    const page = filters?.page ?? 1;
    const size = filters?.size ?? 20;

    const query = this.repo
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .select(['role.id', 'role.name', 'permission.id', 'permission.name'])
      .where('role.deletedAt IS NULL');

    if (filters?.search) {
      query.andWhere('role.name ILIKE :search', { search: `%${filters.search}%` });
    }

    query.skip((page - 1) * size).take(size);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, size };
  }

  async findOne(id: string) {
    const role = await this.repo.findOne({
      where: { id },
      relations: ['permissions'],
      select: { permissions: { id: true, name: true }, id: true, name: true },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }
}
