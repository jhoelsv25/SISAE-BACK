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
  visibility?: Visibility;
  badge?: number;
}

enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
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
      route: '/dashboard',
      visibility: Visibility.PUBLIC,
      position: 1,
    },
    {
      id: 'profile',
      icon: 'fa-user',
      label: 'Perfil',
      route: '/profile',
      visibility: Visibility.PRIVATE,
      position: 99,
    },

    // --- Gestión de Usuarios y Roles ---
    {
      id: 'administration-users',
      icon: 'fa-users-cog',
      label: 'Gestión de Acceso',
      route: '/access',
      visibility: Visibility.PUBLIC,
      position: 2,
      children: [
        {
          id: 'admin-users',
          icon: 'fa-user',
          label: 'Usuarios',
          route: '/access/users',
          visibility: Visibility.PUBLIC,
          position: 1,
          children: [
            {
              id: 'user-list',
              icon: 'fa-table',
              label: 'Usuarios',
              route: '/access/users/list',
              visibility: Visibility.PUBLIC,
              position: 1,
            },
            {
              id: 'user-import',
              icon: 'fa-file-import',
              label: 'Importar',
              route: '/access/users/import',
              position: 2,
              visibility: Visibility.PUBLIC,
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
      route: '/settings',
      visibility: Visibility.PUBLIC,
      position: 3,
      children: [
        {
          id: 'settings-institution',
          icon: 'fa-school',
          label: 'Datos Institucionales',
          visibility: Visibility.PUBLIC,
          route: '/settings/institution',
        },
        {
          id: 'settings-general',
          icon: 'fa-cogs',
          label: 'General',
          visibility: Visibility.PUBLIC,
          route: '/settings/general',
        },
        {
          id: 'settings-mail',
          icon: 'fa-envelope',
          label: 'Correo',
          visibility: Visibility.PUBLIC,
          route: '/settings/mail',
        },
        {
          id: 'settings-notifications',
          icon: 'fa-bell',
          label: 'Notificaciones',
          visibility: Visibility.PUBLIC,
          route: '/settings/notifications',
        },
      ],
    },

    // --- Mantenimiento y Seguridad ---
    {
      id: 'administration-maintenance',
      icon: 'fa-tools',
      label: 'Mantenimiento',
      route: '/maintenance',
      visibility: Visibility.PUBLIC,
      position: 4,
      children: [
        {
          id: 'admin-backup',
          icon: 'fa-database',
          visibility: Visibility.PUBLIC,
          label: 'Respaldos',
          route: '/maintenance/backup',
        },
        {
          id: 'settings-backup',
          icon: 'fa-database',
          label: 'Backups Configuración',
          visibility: Visibility.PUBLIC,
          route: '/maintenance/settings-backup',
        },
        {
          id: 'admin-audit',
          icon: 'fa-clipboard-list',
          label: 'Auditoría',
          visibility: Visibility.PUBLIC,
          route: '/maintenance/audit',
        },
      ],
    },

    // --- Gestión de Seguridad ---
    {
      id: 'admin-permissions',
      icon: 'fa-key',
      label: 'Gestión de Seguridad',
      route: '/administration',
      visibility: Visibility.PUBLIC,
      position: 3,
      children: [
        {
          id: 'admin-roles',
          icon: 'fa-user-shield',
          label: 'Roles',
          visibility: Visibility.PUBLIC,
          route: '/administration/roles',
          position: 1,
        },
        {
          id: 'admin-modules',
          icon: 'fa-puzzle-piece',
          label: 'Módulos',
          visibility: Visibility.PUBLIC,
          route: '/administration/modules',
          position: 2,
        },
        {
          id: 'permission-list',
          icon: 'fa-lock',
          label: 'Permisos',
          visibility: Visibility.PUBLIC,
          route: '/administration/permissions',
          position: 3,
        },
        {
          id: 'action-list',
          icon: 'fa-tools', //edit,create,update,delete
          label: 'Acciones',
          visibility: Visibility.PUBLIC,
          route: '/administration/actions',
          position: 4,
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
    // Extraer el key desde el route (última parte de la ruta)
    const routeParts = menuItem.route.split('/').filter(part => part.length > 0);
    const key = routeParts[routeParts.length - 1]; // Última parte, ej: 'users', 'roles', 'dashboard'

    // Construir el path basado en el padre
    let path = key;
    if (parent?.path) {
      path = `${parent.path}/${key}`;
    }

    // Check if module already exists
    let module = await moduleRepository.findOne({
      where: { key },
    });

    if (!module) {
      // Create new module
      module = moduleRepository.create({
        name: menuItem.label,
        description: `Módulo de ${menuItem.label}`,
        path: path,
        key: key,
        icon: menuItem.icon,
        order: menuItem.position || 0,
        parent: parent,
      });
      await moduleRepository.save(module);

      // Create standard CRUD permissions for the module
      const actions = ['create', 'read', 'update', 'delete'];

      for (const actionKey of actions) {
        // Busca la entidad de acción por key
        let actionEntity = await actionRepository.findOne({ where: { key: actionKey } });
        if (!actionEntity) {
          actionEntity = actionRepository.create({
            key: actionKey,
            name: actionKey.charAt(0).toUpperCase() + actionKey.slice(1),
          });
          await actionRepository.save(actionEntity);
        }

        const permissionKey = `${key}:${actionKey}`;

        // Verifica si el permiso ya existe antes de crearlo
        let exists = await permissionRepository.findOne({ where: { key: permissionKey } });
        if (!exists) {
          const permission = permissionRepository.create({
            key: permissionKey,
            name: `${menuItem.label} - ${actionKey}`,
            action: actionEntity, // Una sola acción (singular)
            module: module,
          });
          await permissionRepository.save(permission);
        }
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
