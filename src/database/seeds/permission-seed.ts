import { DataSource } from 'typeorm';
import { hashPassword } from '../../common/utils/password.util';
import { ModuleEntity } from '../../features/modules/entities/module.entity';
import { PermissionEntity } from '../../features/permissions/entities/permission.entity';
import { RoleEntity } from '../../features/roles/entities/role.entity';
import { UserEntity } from '../../features/users/entities/user.entity';

export async function seedAdminPermissions(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(UserEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);
  const permissionRepository = dataSource.getRepository(PermissionEntity);
  const moduleRepository = dataSource.getRepository(ModuleEntity);

  // Buscar o crear usuario admin por defecto
  let user = await userRepository.findOne({
    where: { email: 'admin@sisae.com' },
  });

  if (!user) {
    const hashedPassword = await hashPassword('admin123');
    user = userRepository.create({
      email: 'admin@sisae.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Principal',
      isActive: true,
    });
    await userRepository.save(user);
    console.log('✅ Usuario admin@sisae.com creado');
  }

  // Crear o buscar rol admin
  let adminRole = await roleRepository.findOne({
    where: { name: 'Super Admin' },
    relations: ['permissions'],
  });

  if (!adminRole) {
    adminRole = roleRepository.create({
      name: 'Super Admin',
      description: 'Role con acceso completo al sistema',
      permissions: [],
    });
    await roleRepository.save(adminRole);
  }

  // Obtener todos los módulos
  const modules = await moduleRepository.find();

  // Crear permisos para cada módulo
  const permissions: PermissionEntity[] = [];

  for (const module of modules) {
    const actions = ['create', 'read', 'update', 'delete'];
    for (const action of actions) {
      let existingPermission = await permissionRepository.findOne({
        where: {
          name: `${module.name}_${action}`,
          action: action,
          module: { id: module.id },
        },
        relations: ['module'],
      });
      if (!existingPermission) {
        const permission = permissionRepository.create({
          name: `${module.name}_${action}`,
          action: action,
          module: module,
        });
        await permissionRepository.save(permission);
        permissions.push(permission);
      } else {
        permissions.push(existingPermission);
      }
    }
  }

  // Asignar permisos al rol admin (evitar duplicados por id)
  const allPermissions = [...(adminRole.permissions || []), ...permissions];
  const uniquePermissions = allPermissions.filter(
    (perm, index, self) => self.findIndex(p => p.id === perm.id) === index,
  );
  adminRole.permissions = uniquePermissions;
  await roleRepository.save(adminRole);

  // Asignar rol admin al usuario
  user.role = adminRole;
  await userRepository.save(user);

  console.log('✅ Admin permissions seeded successfully');
  console.log(`✅ User ${user.email} has been assigned the Super Admin role with all permissions`);
}
