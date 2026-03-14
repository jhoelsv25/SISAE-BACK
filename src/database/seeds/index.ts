import { DataSource } from 'typeorm';
import { seedMenuModules } from './modules-seed';
import { seedAdminPermissions } from './permission-seed';
import { seedRoles } from './roles-seed';
import { seedTeacherAttendances } from './teacher-attendances-seed';
import { seedTeachers } from './teachers-seed';
import { seedDemoAcademic } from './demo-academic-seed';
import { seedUsers } from './users-seed';
import { seedAnnouncements } from './announcements-seed';
import { seedLearningModules } from './learning-modules-seed';
import { seedAssessments } from './assessments-seed';
import { seedAssigments } from './assigments-seed';
import { seedNotifications } from './notifications-seed';
import { seedDemoAcademicLarge } from './demo-academic-large-seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    // 1. Roles básicos
    await seedRoles(dataSource);

    // 2. Módulos de menú y permisos
    await seedMenuModules(dataSource);
    await seedAdminPermissions(dataSource);

    // 3. Docentes y asistencias
    await seedTeachers(dataSource);
    await seedTeacherAttendances(dataSource);

    // 4. Usuarios (superadmin/admin)
    await seedUsers(dataSource);

    // 5. Demo académica (instituciones, años, periodos, grados, cursos, secciones, estudiantes, matrículas, notas, pagos)
    await seedDemoAcademic(dataSource);

    // 6. Demo académica LARGE (~100 colegios, cursos, secciones, estudiantes, notas, etc.)
    await seedDemoAcademicLarge(dataSource);

    // 7. Datos mock para ver el sistema completo
    await seedLearningModules(dataSource);
    await seedAssessments(dataSource);
    await seedAssigments(dataSource);
    await seedAnnouncements(dataSource);
    await seedNotifications(dataSource);

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
