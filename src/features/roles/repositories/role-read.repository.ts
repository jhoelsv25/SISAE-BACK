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
      .select([
        'role.id',
        'role.name',
        'role.description',
        'role.createdAt',
        'permission.id',
        'permission.name',
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
      select: { permissions: { id: true, name: true }, id: true, name: true },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  /**
   * Obtiene el árbol de módulos y permisos para un rol dado
   */
  async getModulesAndPermissionsByRoleId(roleId: string): Promise<{
    role: { id: string; name: string };
    modules: Array<{
      id: string;
      name: string;
      description?: string;
      path?: string;
      icon?: string;
      visibility?: 'private' | 'public';
      permissions: string[];
      children?: Array<any>;
    }>;
  }> {
    const role = await this.repo.findOne({
      where: { id: roleId },
      relations: ['permissions', 'permissions.module', 'permissions.module.parent'],
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    interface ModuleTree {
      id: string;
      name: string;
      description?: string;
      path?: string;
      icon?: string;
      visibility?: 'private' | 'public';
      permissions: string[];
      children: ModuleTree[];
      parentId: string | null;
    }

    // Organizar módulos por ID
    const modulesMap: Record<string, ModuleTree> = {};
    for (const perm of role.permissions) {
      const module = perm.module;
      if (!module) continue;
      if (!modulesMap[module.id]) {
        modulesMap[module.id] = {
          id: module.id,
          name: module.name,
          description: module.description,
          path: module.path?.startsWith('/') ? module.path : `/${module.path}`,
          icon: module.icon,
          visibility: module.visibility,
          permissions: [],
          children: [],
          parentId: module.parent?.id || null,
        };
      }
      // Agrega el key del permiso, no el objeto action
      modulesMap[module.id].permissions.push(perm.key);
    }

    // Construir árbol recursivo
    const buildTree = (parentId: string | null): ModuleTree[] => {
      return Object.values(modulesMap)
        .filter(module => module.parentId === parentId)
        .map(module => ({
          ...module,
          children: buildTree(module.id),
        }));
    };

    // Limpiar nodos vacíos
    const cleanModule = (module: ModuleTree) => {
      const { parentId, children, ...rest } = module;
      const cleaned: any = { ...rest };
      if (children && children.length > 0) {
        cleaned.children = children.map(cleanModule).filter(child => {
          return child.permissions.length > 0 || (child.children && child.children.length > 0);
        });
        if (cleaned.children.length === 0) {
          delete cleaned.children;
        }
      }
      return cleaned;
    };

    const rootModules = buildTree(null);
    const modules = rootModules.map(cleanModule);
    return { role: { id: role.id, name: role.name }, modules };
  }
}
