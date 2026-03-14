import { DataSource } from 'typeorm';
import { seedMenuModules } from './modules-seed';
import { seedAdminPermissions } from './permission-seed';
import { seedRoles } from './roles-seed';
import { seedTeacherAttendances } from './teacher-attendances-seed';
import { seedTeachers } from './teachers-seed';
import { seedDemoAcademic } from './demo-academic-seed';
import { seedUsers } from './users-seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    // Crear roles básicos
    await seedRoles(dataSource);

    // Crear módulos de menú
    await seedMenuModules(dataSource);

    // Asignar todos los permisos al super admin
    await seedAdminPermissions(dataSource);

    // Seed de docentes base
    await seedTeachers(dataSource);

    // Seed de asistencias docentes (demo)
    await seedTeacherAttendances(dataSource);

    // Seed de usuarios base (superadmin/admin)
    await seedUsers(dataSource);

    // Seed demo académica (2 registros por tabla principal)
    await seedDemoAcademic(dataSource);

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
