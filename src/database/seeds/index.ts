import { DataSource } from 'typeorm';
import { seedAdminPermissions } from './admin-permissions.seed';
import { seedManagementModules } from './management-modules.seed';
import { seedMenuModules } from './menu-modules.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    // First create the management modules
    await seedManagementModules(dataSource);

    // Then create menu modules
    await seedMenuModules(dataSource);

    // Finally assign all permissions to super admin
    await seedAdminPermissions(dataSource);

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
