import { DataSource } from 'typeorm';
import { Module } from '../../features/modules/entities/module.entity';

export async function seedManagementModules(dataSource: DataSource) {
  const moduleRepository = dataSource.getRepository(Module);

  // Create Dashboard module
  let dashboardModule = await moduleRepository.findOne({
    where: { name: 'Dashboard' },
  });

  if (!dashboardModule) {
    dashboardModule = moduleRepository.create({
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'fa-dashboard',
      position: 1,
      description: 'Módulo de dashboard',
    });
    await moduleRepository.save(dashboardModule);
  }

  // Create Users Management module
  let usersModule = await moduleRepository.findOne({
    where: { name: 'Gestión de Usuarios' },
  });

  if (!usersModule) {
    usersModule = moduleRepository.create({
      name: 'Gestión de Usuarios',
      path: '/users',
      icon: 'fa-users',
      position: 2,
      description: 'Módulo para administrar usuarios del sistema, roles y permisos',
    });
    await moduleRepository.save(usersModule);
  }

  // Create Users List as child of Users Management
  let usersListModule = await moduleRepository.findOne({
    where: { name: 'Lista de usuarios' },
  });

  if (!usersListModule) {
    usersListModule = moduleRepository.create({
      name: 'Lista de usuarios',
      path: '/users/list',
      icon: 'fa-list',
      position: 1,
      description: 'Lista de usuarios del sistema',
      parent: usersModule,
    });
    await moduleRepository.save(usersListModule);
  }

  // Create Management module (parent)
  let managementModule = await moduleRepository.findOne({
    where: { name: 'Gestión' },
  });

  if (!managementModule) {
    managementModule = moduleRepository.create({
      name: 'Gestión',
      path: 'management',
      icon: 'settings',
      position: 3,
      description: 'Módulo de gestión del sistema',
    });
    await moduleRepository.save(managementModule);
  }

  // Define child modules for Management
  const childModules = [
    {
      name: 'Roles',
      path: 'roles',
      icon: 'security',
      position: 1,
      description: 'Gestión de roles del sistema',
    },
    {
      name: 'Módulos',
      path: 'modules',
      icon: 'apps',
      position: 2,
      description: 'Gestión de módulos del sistema',
    },
    {
      name: 'Permisos',
      path: 'permissions',
      icon: 'lock',
      position: 3,
      description: 'Gestión de permisos del sistema',
    },
  ];

  // Create child modules
  for (const moduleData of childModules) {
    const existingModule = await moduleRepository.findOne({
      where: { name: moduleData.name },
    });

    if (!existingModule) {
      const newModule = moduleRepository.create({
        ...moduleData,
        parent: managementModule,
      });
      await moduleRepository.save(newModule);
    }
  }

  console.log('✅ Management modules seeded successfully');
}
