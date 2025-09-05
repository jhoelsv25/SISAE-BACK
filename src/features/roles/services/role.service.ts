import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { Permission } from '../../permissions/entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getModulesAndPermissionsByRoleId(roleId: string): Promise<{
    role: { id: string; name: string };
    modules: Array<{
      id: string;
      name: string;
      description?: string;
      path?: string;
      icon?: string;
      permissions: string[];
      children?: Array<any>;
    }>;
  }> {
    const role = await this.roleRepository.findOne({
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
      permissions: string[];
      children: ModuleTree[];
      parentId: string | null;
    }

    // First, organize modules by their IDs
    const modulesMap: Record<string, ModuleTree> = {};

    // First pass: Create all module objects with their base properties
    for (const perm of role.permissions) {
      const module = perm.module;
      if (!module) continue;

      if (!modulesMap[module.id]) {
        modulesMap[module.id] = {
          id: module.id,
          name: module.name,
          description: module.description,
          path: module.path,
          icon: module.icon,
          permissions: [],
          children: [],
          parentId: module.parent?.id || null,
        };
      }
      modulesMap[module.id].permissions.push(perm.action);
    }

    // Build the tree structure recursively
    const buildTree = (parentId: string | null): ModuleTree[] => {
      return Object.values(modulesMap)
        .filter(module => module.parentId === parentId)
        .map(module => ({
          ...module,
          children: buildTree(module.id),
        }));
    };

    // Get root modules (those without parent) and build their trees
    const rootModules = buildTree(null);

    // Clean up function to remove parentId and empty children arrays recursively
    const cleanModule = (module: ModuleTree) => {
      const { parentId, children, ...rest } = module;
      const cleaned: any = { ...rest };

      if (children && children.length > 0) {
        // Recursively clean child modules
        cleaned.children = children.map(cleanModule).filter(child => {
          // Only include children that have permissions or their own children
          return child.permissions.length > 0 || (child.children && child.children.length > 0);
        });

        // If after filtering there are no children, don't include the children property
        if (cleaned.children.length === 0) {
          delete cleaned.children;
        }
      }
      return cleaned;
    };

    const modules = rootModules.map(cleanModule);
    return { role: { id: role.id, name: role.name }, modules };
  }
  async create(dto: CreateRoleDto) {
    try {
      const { permissionIds, ...rest } = dto;
      const role = this.roleRepository.create(rest);
      if (permissionIds && permissionIds.length) {
        role.permissions = await this.permissionRepository.findByIds(permissionIds);
      }
      return this.roleRepository.save(role);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del rol ya existe');
      }
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }

  async update(id: string, dto: Partial<CreateRoleDto>): Promise<Role> {
    try {
      const role = await this.roleRepository.preload({
        id,
        ...dto,
      });
      if (!role) {
        throw new NotFoundException('Rol no encontrado');
      }
      return this.roleRepository.save(role);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del rol ya existe');
      }
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const role = await this.findOne(id);
      await this.roleRepository.remove(role);
    } catch (error) {
      throw error;
    }
  }
}
