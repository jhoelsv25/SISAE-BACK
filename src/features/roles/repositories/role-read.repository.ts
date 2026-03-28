import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MENU_MODULES_MOCK, MenuItem } from '../../../common/constants/system-modules.mock';
import { FilterRoleDto } from '../dto/filte-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { ModuleMap, RoleByModule, RoleByModulePaginated } from '../interfaces/role.interface';

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
      .loadRelationCountAndMap('role.userCount', 'role.users')
      .loadRelationCountAndMap('role.permissionsCount', 'role.permissions')
      .select([
        'role.id',
        'role.name',
        'role.description',
        'role.isActive',
        'role.isSystem',
        'role.createdAt',
        'permission.id',
        'permission.name',
        'permission.slug',
      ]);

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
      select: { permissions: { id: true, name: true, slug: true }, id: true, name: true },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  /**
   * Obtiene el árbol de módulos y permisos para un rol dado
   */
  async getModulesAndPermissionsByRoleId(roleId: string): Promise<RoleByModule> {
    const role = await this.repo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Rol no encontrado');

    // Mapear permisos por módulo para búsqueda rápida
    const permissionsByModule: Record<string, string[]> = {};
    for (const perm of role.permissions) {
      if (!perm.module) continue;
      if (!permissionsByModule[perm.module]) {
        permissionsByModule[perm.module] = [];
      }
      permissionsByModule[perm.module].push(perm.slug);
    }

    // Función recursiva para mapear Mock -> ModuleMap
    const mapModule = (item: MenuItem): ModuleMap | null => {
      const moduleName = item.id;

      const directPermissions = permissionsByModule[moduleName] || [];
      const children = (item.children || [])
        .map(child => mapModule(child))
        .filter(child => child !== null) as ModuleMap[];

      // Para el admin UI, necesitamos ver el módulo si tiene permisos asignables (aunque el rol no tenga ninguno aún)
      const availablePermissions = item.permissions || [];
      if (directPermissions.length === 0 && children.length === 0 && availablePermissions.length === 0) {
        return null;
      }

      return {
        id: item.id,
        name: item.label,
        description: '',
        path: item.route,
        icon: item.icon,
        visibility: item.visibility as any,
        permissions: directPermissions,
        availablePermissions,
        children: children.length > 0 ? children : undefined,
      };
    };

    const modules = MENU_MODULES_MOCK.map(m => mapModule(m)).filter(m => m !== null) as ModuleMap[];

    return {
      role: { id: role.id, name: role.name },
      modules,
    };
  }

  async getModuleByRoleIdPaginated(
    id: string,
    filter?: FilterRoleDto,
  ): Promise<RoleByModulePaginated> {
    const { page = 1, size = 20, search } = filter || {};

    const role = await this.repo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Rol no encontrado');

    const permissionsByModule: Record<string, string[]> = {};
    for (const perm of role.permissions) {
      if (!perm.module) continue;
      if (!permissionsByModule[perm.module]) {
        permissionsByModule[perm.module] = [];
      }
      permissionsByModule[perm.module].push(perm.slug);
    }

    const mapModule = (item: MenuItem): ModuleMap | null => {
      const availablePermissions = item.permissions || [];
      const moduleName = item.id;

      const directPermissions = permissionsByModule[moduleName] || [];
      const children = (item.children || [])
        .map(child => mapModule(child))
        .filter(child => child !== null) as ModuleMap[];

      if (directPermissions.length === 0 && children.length === 0 && availablePermissions.length === 0) {
        return null;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.label.toLowerCase().includes(searchLower) ||
          (item.id.toLowerCase().includes(searchLower)) ||
          children.length > 0;

        if (!matchesSearch) return null;
      }

      return {
        id: item.id,
        name: item.label,
        description: '',
        path: item.route,
        icon: item.icon,
        visibility: item.visibility as any,
        permissions: directPermissions,
        availablePermissions,
        children: children.length > 0 ? children : undefined,
      };
    };

    const allModules = MENU_MODULES_MOCK.map(m => mapModule(m)).filter(m => m !== null) as ModuleMap[];

    const total = allModules.length;
    const paginatedModules = allModules.slice((page - 1) * size, page * size);

    return {
      role: { id: role.id, name: role.name },
      modules: paginatedModules,
      total,
      page,
      size,
    };
  }
}
