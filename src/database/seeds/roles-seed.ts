import { DataSource } from 'typeorm';
import { RoleEntity } from '../../features/roles/entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(RoleEntity);

  const roles = [
    {
      name: 'Super Admin',
      description: 'Rol con acceso completo al sistema',
    },
    {
      name: 'Admin',
      description: 'Rol administrativo con permisos elevados',
    },
    {
      name: 'User',
      description: 'Rol básico para usuarios estándar',
    },
  ];

  for (const roleData of roles) {
    let role = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!role) {
      role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`✅ Rol creado: ${roleData.name}`);
    } else {
      console.log(`ℹ️  Rol ya existe: ${roleData.name}`);
    }
  }
  console.log('✅ Seed de roles completado');
}
