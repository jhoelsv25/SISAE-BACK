import { DataSource } from 'typeorm';
import { MENU_MODULES_MOCK, MenuItem } from '../../common/constants/system-modules.mock';
import { PermissionEntity } from '../../features/permissions/entities/permission.entity';
import { RoleEntity } from '../../features/roles/entities/role.entity';

export async function seedMenuModules(dataSource: DataSource) {
  const permissionRepository = dataSource.getRepository(PermissionEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const menuItems: MenuItem[] = [...MENU_MODULES_MOCK];

  const standardActions = [
    { slugSufix: 'create', nameSufix: 'Crear' },
    { slugSufix: 'read', nameSufix: 'Leer' },
    { slugSufix: 'update', nameSufix: 'Actualizar' },
    { slugSufix: 'delete', nameSufix: 'Eliminar' },
  ];

  async function createModuleTree(
    menuItem: MenuItem,
    parentPath: string | null = null,
  ): Promise<void> {
    const routeParts = menuItem.route?.split('/').filter(part => part.length > 0) || [];
    const moduleName = routeParts.length > 0 ? routeParts[routeParts.length - 1] : menuItem.id;

    let path = moduleName;
    if (parentPath) {
      path = `${parentPath}/${moduleName}`;
    }

    for (const action of standardActions) {
      const permissionSlug = `${moduleName}:${action.slugSufix}`;

      const exists = await permissionRepository.findOne({ where: { slug: permissionSlug } });
      if (!exists) {
        const permission = permissionRepository.create({
          slug: permissionSlug,
          name: `${menuItem.label} - ${action.nameSufix}`,
          module: moduleName,
          scope: 'system',
        });
        await permissionRepository.save(permission);
      }
    }

    // Crear permisos personalizados definidos en el mock si existen
    if (menuItem.permissions && menuItem.permissions.length > 0) {
      for (const customSlug of menuItem.permissions) {
        const exists = await permissionRepository.findOne({ where: { slug: customSlug } });
        if (!exists) {
          const permission = permissionRepository.create({
            slug: customSlug,
            name: `${menuItem.label} - ${customSlug.split(':').pop() || 'Access'}`,
            module: moduleName,
            scope: 'system',
          });
          await permissionRepository.save(permission);
        }
      }
    }

    if (menuItem.children) {
      for (const childItem of menuItem.children) {
        await createModuleTree(childItem, path);
      }
    }
  }

  for (const menuItem of menuItems) {
    await createModuleTree(menuItem);
  }

  const superAdminRole = await roleRepository.findOne({
    where: { name: 'Super Admin' },
  });

  if (superAdminRole) {
    const allPermissions = await permissionRepository.find();
    superAdminRole.permissions = allPermissions;
    await roleRepository.save(superAdminRole);
  }

  console.log('✅ Menu modules seeded successfully');
}
