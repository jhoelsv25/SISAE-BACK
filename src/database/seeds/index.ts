import { DataSource } from 'typeorm';
import { seedMenuModules } from './modules-seed';
import { seedAdminPermissions } from './permission-seed';
import { seedRoles } from './roles-seed';
import { seedUsers } from './users-seed';
import { seedStateSchool } from './state-school-seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    // 1. Roles básicos
    await seedRoles(dataSource);

    // 2. Módulos de menú y permisos
    await seedMenuModules(dataSource);
    await seedAdminPermissions(dataSource);

    // 3. Datos del Colegio Real (Colegio Carmelinas, Grados, Secciones, Cursos)
    await seedStateSchool(dataSource);

    // 4. Usuarios Principales (superadmin, admin, director, etc.)
    await seedUsers(dataSource);

    console.log('✅ Real data seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
