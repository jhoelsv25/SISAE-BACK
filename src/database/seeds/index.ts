import { DataSource } from 'typeorm';
import { seedMenuModules } from './modules-seed';
import { seedAdminPermissions } from './permission-seed';
import { seedRoles } from './roles-seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    // Crear roles básicos
    await seedRoles(dataSource);

    // Crear módulos de menú
    await seedMenuModules(dataSource);

    // Asignar todos los permisos al super admin
    await seedAdminPermissions(dataSource);

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
