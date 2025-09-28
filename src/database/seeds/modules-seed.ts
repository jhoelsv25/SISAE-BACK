import { DataSource } from 'typeorm';
import { ModuleEntity } from '../../features/modules/entities/module.entity';
import { PermissionEntity } from '../../features/permissions/entities/permission.entity';
import { RoleEntity } from '../../features/roles/entities/role.entity';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  position?: number;
  permissions?: string[];
  children?: MenuItem[];
  badge?: number;
}

export async function seedMenuModules(dataSource: DataSource) {
  const moduleRepository = dataSource.getRepository(ModuleEntity);
  const permissionRepository = dataSource.getRepository(PermissionEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  // Define menu structure
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'fa-chart-line',
      label: 'Dashboard',
      route: '/dashboard/home',
      position: 1,
    },
    {
      id: 'management',
      icon: 'fa-folder',
      label: 'Gestión',
      route: '/management',
      position: 2,
      children: [
        {
          id: 'roles',
          icon: 'fa-user-shield',
          label: 'Roles y Permisos',
          route: '/management/roles',
        },
        {
          id: 'modules',
          icon: 'fa-puzzle-piece',
          label: 'Módulos',
          route: '/management/modules',
        },
        {
          id: 'permissions',
          icon: 'fa-key',
          label: 'Permisos',
          route: '/management/permissions',
        },
        {
          id: 'users',
          icon: 'fa-users-cog',
          label: 'Usuarios',
          route: '/management/users',
        },
      ],
    },

    {
      id: 'administration',
      icon: 'fa-cog',
      label: 'Administración',
      route: '/dashboard/administration',
      position: 12,
      permissions: ['admin.view'],
      children: [
        {
          id: 'admin-users',
          icon: 'fa-users-cog',
          label: 'Usuarios',
          route: '/dashboard/administration/users',
        },
        {
          id: 'admin-roles',
          icon: 'fa-user-shield',
          label: 'Roles y Permisos',
          route: '/dashboard/administration/roles',
        },
        {
          id: 'admin-settings',
          icon: 'fa-sliders-h',
          label: 'Configuraciones',
          route: '/dashboard/administration/settings',
        },
        {
          id: 'admin-backup',
          icon: 'fa-database',
          label: 'Respaldos',
          route: '/dashboard/administration/backup',
        },
      ],
    },
  ];

  // Recursive function to create modules and their children
  async function createModuleTree(
    menuItem: MenuItem,
    parent: ModuleEntity | null = null,
  ): Promise<ModuleEntity> {
    // Check if module already exists
    let module = await moduleRepository.findOne({
      where: { path: menuItem.route },
    });

    if (!module) {
      // Create new module
      module = moduleRepository.create({
        name: menuItem.label,
        description: `Módulo de ${menuItem.label}`,
        path: menuItem.route,
        icon: menuItem.icon,
        position: menuItem.position || 0,
        parent: parent,
      });
      await moduleRepository.save(module);

      // Create standard CRUD permissions for the module
      const actions = ['create', 'read', 'update', 'delete'];
      for (const action of actions) {
        const permission = permissionRepository.create({
          name: `${menuItem.id}_${action}`,
          action: action,
          module: module,
        });
        await permissionRepository.save(permission);
      }
    }

    // Recursively create children if they exist
    if (menuItem.children) {
      for (const childItem of menuItem.children) {
        await createModuleTree(childItem, module);
      }
    }

    return module;
  }

  // Create all modules
  for (const menuItem of menuItems) {
    await createModuleTree(menuItem);
  }

  // Find superadmin role and assign all permissions
  const superAdminRole = await roleRepository.findOne({
    where: { name: 'Super Admin' },
  });

  if (superAdminRole) {
    // Get all permissions
    const allPermissions = await permissionRepository.find();

    // Assign all permissions to superadmin
    superAdminRole.permissions = allPermissions;
    await roleRepository.save(superAdminRole);
  }

  console.log('✅ Menu modules seeded successfully');
}
