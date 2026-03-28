import { DataSource } from 'typeorm';
import { MENU_MODULES_MOCK, MenuItem } from '../../common/constants/system-modules.mock';
import { PermissionEntity } from '../../features/permissions/entities/permission.entity';
import { RoleEntity } from '../../features/roles/entities/role.entity';

function expandCanonicalSeedAliases(slug: string): string[] {
  const aliases = [slug];

  const colonMatch = /^([^:]+):(.+)$/.exec(slug);
  if (colonMatch) {
    const [, resource, action] = colonMatch;
    const resourceVariants = new Set<string>([
      resource,
      resource.replace(/-/g, '_'),
      resource.replace(/_/g, '-'),
    ]);

    if (resource.endsWith('s')) {
      resourceVariants.add(resource.slice(0, -1));
    } else {
      resourceVariants.add(`${resource}s`);
    }

    for (const variant of resourceVariants) {
      aliases.push(`${variant}:${action}`);
    }
  }

  const legacyMatch = /^(view|read|create|update|delete|manage)_(.+)$/.exec(slug);
  if (!legacyMatch) return aliases;

  const [, action, resource] = legacyMatch;

  if (action === 'view' || action === 'read') {
    aliases.push(`${resource}:view`);
  } else if (action === 'manage') {
    aliases.push(`${resource}:manage`);
  } else {
    aliases.push(`${resource}:${action}`);
  }

  return Array.from(new Set(aliases));
}

export async function seedMenuModules(dataSource: DataSource) {
  const permissionRepository = dataSource.getRepository(PermissionEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const menuItems: MenuItem[] = [...MENU_MODULES_MOCK];

  const standardActions = [
    { slugSufix: 'view', nameSufix: 'Ver' },
    { slugSufix: 'create', nameSufix: 'Crear' },
    { slugSufix: 'update', nameSufix: 'Actualizar' },
    { slugSufix: 'delete', nameSufix: 'Eliminar' },
  ];

  async function createModuleTree(
    menuItem: MenuItem,
    parentPath: string | null = null,
  ): Promise<void> {
    const moduleName = menuItem.id;

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
        for (const slug of expandCanonicalSeedAliases(customSlug)) {
          const exists = await permissionRepository.findOne({ where: { slug } });
          if (!exists) {
            const permission = permissionRepository.create({
              slug,
              name: `${menuItem.label} - ${slug.split(':').pop() || slug.split('_')[0] || 'Access'}`,
              module: moduleName,
              scope: 'system',
            });
            await permissionRepository.save(permission);
          }
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
