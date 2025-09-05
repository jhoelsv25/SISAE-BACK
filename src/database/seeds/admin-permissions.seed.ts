import { DataSource } from 'typeorm';
import { Module } from '../../features/modules/entities/module.entity';
import { Permission } from '../../features/permissions/entities/permission.entity';
import { Role } from '../../features/roles/entities/role.entity';
import { User } from '../../features/users/entities/user.entity';

export async function seedAdminPermissions(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const moduleRepository = dataSource.getRepository(Module);

  // Find the user
  const user = await userRepository.findOne({
    where: { id: 'f50d719a-c3eb-4173-b96e-86573e463a93' },
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  // Create or find admin role
  let adminRole = await roleRepository.findOne({
    where: { name: 'Super Admin' },
  });

  if (!adminRole) {
    adminRole = roleRepository.create({
      name: 'Super Admin',
      description: 'Role con acceso completo al sistema',
    });
    await roleRepository.save(adminRole);
  }

  // Get all modules
  const modules = await moduleRepository.find();

  // Create permissions for each module
  const permissions: Permission[] = [];

  for (const module of modules) {
    // Define standard CRUD actions
    const actions = ['create', 'read', 'update', 'delete'];

    for (const action of actions) {
      const existingPermission = await permissionRepository.findOne({
        where: {
          name: `${module.name}_${action}`,
          action: action,
          module: { id: module.id },
        },
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

  // Assign permissions to admin role
  adminRole.permissions = permissions;
  await roleRepository.save(adminRole);

  // Assign admin role to user
  user.role = adminRole;
  await userRepository.save(user);

  console.log('✅ Admin permissions seeded successfully');
  console.log(`✅ User ${user.email} has been assigned the Super Admin role with all permissions`);
}
