import { DataSource } from 'typeorm';
import { ActionEntity } from '../../features/actions/entities/action.entity';
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
    // --- Dashboard ---
    {
      id: 'dashboard',
      icon: 'fa-chart-line',
      label: 'Dashboard',
      route: '/dashboard/home',
      position: 1,
    },

    // --- Gestión de Usuarios y Roles ---
    {
      id: 'administration-users',
      icon: 'fa-users-cog',
      label: 'Usuarios y Roles',
      route: '/administration/users',
      position: 2,
      children: [
        {
          id: 'admin-users',
          icon: 'fa-user',
          label: 'Usuarios',
          route: '/administration/users',
          position: 1,
          children: [
            {
              id: 'user-list',
              icon: 'fa-table',
              label: 'Listado de Usuarios',
              route: '/administration/users/list',
              position: 1,
            },
            {
              id: 'user-import',
              icon: 'fa-file-import',
              label: 'Importar Usuarios',
              route: '/administration/users/import',
              position: 2,
            },
          ],
        },
        {
          id: 'admin-roles',
          icon: 'fa-user-shield',
          label: 'Roles',
          route: '/administration/roles',
          position: 2,
        },
        {
          id: 'admin-permissions',
          icon: 'fa-key',
          label: 'Permisos y Acciones',
          route: '/administration/permissions',
          position: 3,
          children: [
            {
              id: 'permission-list',
              icon: 'fa-list',
              label: 'Listado de Permisos',
              route: '/administration/permissions/list',
              position: 1,
            },
            {
              id: 'action-list',
              icon: 'fa-tasks',
              label: 'Listado de Acciones',
              route: '/administration/permissions/actions',
              position: 2,
            },
          ],
        },
      ],
    },

    // --- Configuración del Sistema ---
    {
      id: 'administration-settings',
      icon: 'fa-cog',
      label: 'Configuraciones',
      route: '/administration/settings',
      position: 3,
      children: [
        {
          id: 'settings-institution',
          icon: 'fa-school',
          label: 'Datos Institucionales',
          route: '/administration/settings/institution',
        },
        {
          id: 'settings-general',
          icon: 'fa-cogs',
          label: 'General',
          route: '/administration/settings/general',
        },
        {
          id: 'settings-mail',
          icon: 'fa-envelope',
          label: 'Correo',
          route: '/administration/settings/mail',
        },
        {
          id: 'settings-notifications',
          icon: 'fa-bell',
          label: 'Notificaciones',
          route: '/administration/settings/notifications',
        },
        {
          id: 'settings-api',
          icon: 'fa-plug',
          label: 'API / Integraciones',
          route: '/administration/settings/api',
        },
      ],
    },

    // --- Mantenimiento y Seguridad ---
    {
      id: 'administration-maintenance',
      icon: 'fa-tools',
      label: 'Mantenimiento',
      route: '/administration/maintenance',
      position: 4,
      children: [
        {
          id: 'admin-modules',
          icon: 'fa-puzzle-piece',
          label: 'Módulos',
          route: '/administration/modules',
        },
        {
          id: 'admin-backup',
          icon: 'fa-database',
          label: 'Respaldos',
          route: '/administration/backup',
        },
        {
          id: 'settings-backup',
          icon: 'fa-database',
          label: 'Backups Configuración',
          route: '/administration/settings/backup',
        },
        {
          id: 'admin-audit',
          icon: 'fa-clipboard-list',
          label: 'Auditoría',
          route: '/administration/audit',
        },
      ],
    },

    // --- Integraciones y Notificaciones ---
    {
      id: 'administration-integrations',
      icon: 'fa-plug',
      label: 'Integraciones',
      route: '/administration/integrations',
      position: 5,
      children: [
        {
          id: 'admin-integrations',
          icon: 'fa-network-wired',
          label: 'Conexiones',
          route: '/administration/integrations',
        },
        {
          id: 'admin-notifications',
          icon: 'fa-bell',
          label: 'Notificaciones',
          route: '/administration/notifications',
        },
      ],
    },
  ];

  // Antes de crear módulos, asegúrate de poblar la tabla actions con los keys estándar
  const actionRepository = dataSource.getRepository(ActionEntity);
  const standardActions = [
    { key: 'create', name: 'Crear' },
    { key: 'read', name: 'Leer' },
    { key: 'update', name: 'Actualizar' },
    { key: 'delete', name: 'Eliminar' },
  ];
  for (const action of standardActions) {
    let exists = await actionRepository.findOne({ where: { key: action.key } });
    if (!exists) {
      exists = actionRepository.create(action);
      await actionRepository.save(exists);
    }
  }

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
        key: menuItem.id, // Asigna el key único del módulo
      });
      await moduleRepository.save(module);

      // Create standard CRUD permissions for the module
      const actions = ['create', 'read', 'update', 'delete'];
      for (const actionKey of actions) {
        // Busca la entidad de acción por key
        let actionEntity = await dataSource
          .getRepository(ActionEntity)
          .findOne({ where: { key: actionKey } });
        if (!actionEntity) {
          actionEntity = dataSource
            .getRepository(ActionEntity)
            .create({ key: actionKey, name: actionKey });
          await dataSource.getRepository(ActionEntity).save(actionEntity);
        }
        const permissionKey = `${menuItem.id}:${actionKey}`;
        const permission = permissionRepository.create({
          key: permissionKey,
          name: `${menuItem.label} - ${actionKey}`,
          action: actionEntity,
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
