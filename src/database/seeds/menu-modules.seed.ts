import { DataSource } from 'typeorm';
import { Module } from '../../features/modules/entities/module.entity';
import { Permission } from '../../features/permissions/entities/permission.entity';
import { Role } from '../../features/roles/entities/role.entity';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  position?: number;
  permissions?: string[];
  children?: MenuItem[];
  badge?: number;
}

export async function seedMenuModules(dataSource: DataSource) {
  const moduleRepository = dataSource.getRepository(Module);
  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);

  // Define menu structure
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'fa-chart-line',
      label: 'Dashboard',
      route: '/dashboard/home',
      position: 1,
    },
    {
      id: 'students',
      icon: 'fa-graduation-cap',
      label: 'Estudiantes',
      route: '/dashboard/students',
      position: 2,
      children: [
        {
          id: 'students-list',
          icon: 'fa-list',
          label: 'Lista de Estudiantes',
          route: '/dashboard/students',
        },
        {
          id: 'students-create',
          icon: 'fa-plus',
          label: 'Nuevo Estudiante',
          route: '/dashboard/students/create',
        },
        {
          id: 'students-import',
          icon: 'fa-upload',
          label: 'Importar Estudiantes',
          route: '/dashboard/students/import',
        },
      ],
    },
    {
      id: 'teachers',
      icon: 'fa-chalkboard-teacher',
      label: 'Profesores',
      route: '/dashboard/teachers',
      position: 3,
      children: [
        {
          id: 'teachers-list',
          icon: 'fa-list',
          label: 'Lista de Profesores',
          route: '/dashboard/teachers',
        },
        {
          id: 'teachers-create',
          icon: 'fa-plus',
          label: 'Nuevo Profesor',
          route: '/dashboard/teachers/create',
        },
        {
          id: 'teachers-schedule',
          icon: 'fa-calendar',
          label: 'Horarios',
          route: '/dashboard/teachers/schedule',
        },
      ],
    },
    {
      id: 'courses',
      icon: 'fa-book',
      label: 'Cursos',
      route: '/dashboard/courses',
      position: 4,
      children: [
        {
          id: 'courses-list',
          icon: 'fa-list',
          label: 'Lista de Cursos',
          route: '/dashboard/courses',
        },
        {
          id: 'courses-create',
          icon: 'fa-plus',
          label: 'Nuevo Curso',
          route: '/dashboard/courses/create',
        },
        {
          id: 'courses-curriculum',
          icon: 'fa-book-open',
          label: 'Currícula',
          route: '/dashboard/courses/curriculum',
        },
      ],
    },
    {
      id: 'grades',
      icon: 'fa-star',
      label: 'Calificaciones',
      route: '/dashboard/grades',
      position: 5,
      children: [
        {
          id: 'grades-input',
          icon: 'fa-edit',
          label: 'Ingresar Notas',
          route: '/dashboard/grades/input',
        },
        {
          id: 'grades-reports',
          icon: 'fa-file-alt',
          label: 'Reportes de Notas',
          route: '/dashboard/grades/reports',
        },
        {
          id: 'grades-periods',
          icon: 'fa-calendar-alt',
          label: 'Períodos Académicos',
          route: '/dashboard/grades/periods',
        },
      ],
    },
    {
      id: 'attendance',
      icon: 'fa-calendar-check',
      label: 'Asistencia',
      route: '/dashboard/attendance',
      position: 6,
      children: [
        {
          id: 'attendance-daily',
          icon: 'fa-calendar-day',
          label: 'Asistencia Diaria',
          route: '/dashboard/attendance/daily',
        },
        {
          id: 'attendance-reports',
          icon: 'fa-chart-pie',
          label: 'Reportes',
          route: '/dashboard/attendance/reports',
        },
      ],
    },
    {
      id: 'schedules',
      icon: 'fa-clock',
      label: 'Horarios',
      route: '/dashboard/schedules',
      position: 7,
      children: [
        {
          id: 'schedules-class',
          icon: 'fa-table',
          label: 'Horario de Clases',
          route: '/dashboard/schedules/class',
        },
        {
          id: 'schedules-exam',
          icon: 'fa-clipboard-list',
          label: 'Horario de Exámenes',
          route: '/dashboard/schedules/exam',
        },
      ],
    },
    {
      id: 'reports',
      icon: 'fa-chart-bar',
      label: 'Reportes',
      route: '/dashboard/reports',
      position: 8,
      children: [
        {
          id: 'reports-academic',
          icon: 'fa-graduation-cap',
          label: 'Reportes Académicos',
          route: '/dashboard/reports/academic',
        },
        {
          id: 'reports-financial',
          icon: 'fa-dollar-sign',
          label: 'Reportes Financieros',
          route: '/dashboard/reports/financial',
        },
        {
          id: 'reports-custom',
          icon: 'fa-cogs',
          label: 'Reportes Personalizados',
          route: '/dashboard/reports/custom',
        },
      ],
    },
    {
      id: 'communications',
      icon: 'fa-envelope',
      label: 'Comunicaciones',
      route: '/dashboard/communications',
      position: 9,
      children: [
        {
          id: 'communications-messages',
          icon: 'fa-comments',
          label: 'Mensajes',
          route: '/dashboard/communications/messages',
        },
        {
          id: 'communications-notifications',
          icon: 'fa-bell',
          label: 'Notificaciones',
          route: '/dashboard/communications/notifications',
        },
        {
          id: 'communications-announcements',
          icon: 'fa-bullhorn',
          label: 'Comunicados',
          route: '/dashboard/communications/announcements',
        },
      ],
    },
    {
      id: 'parents',
      icon: 'fa-users',
      label: 'Padres de Familia',
      route: '/dashboard/parents',
      position: 10,
      children: [
        {
          id: 'parents-list',
          icon: 'fa-list',
          label: 'Lista de Padres',
          route: '/dashboard/parents',
        },
        {
          id: 'parents-meetings',
          icon: 'fa-handshake',
          label: 'Reuniones',
          route: '/dashboard/parents/meetings',
        },
      ],
    },
    {
      id: 'finance',
      icon: 'fa-dollar-sign',
      label: 'Finanzas',
      route: '/dashboard/finance',
      position: 11,
      permissions: ['finance.view'],
      children: [
        {
          id: 'finance-payments',
          icon: 'fa-credit-card',
          label: 'Pagos',
          route: '/dashboard/finance/payments',
        },
        {
          id: 'finance-invoices',
          icon: 'fa-file-invoice',
          label: 'Facturas',
          route: '/dashboard/finance/invoices',
        },
        {
          id: 'finance-reports',
          icon: 'fa-chart-line',
          label: 'Reportes Financieros',
          route: '/dashboard/finance/reports',
        },
      ],
    },
    {
      id: 'administration',
      icon: 'fa-cog',
      label: 'Administración',
      route: '/dashboard/administration',
      position: 12,
      permissions: ['admin.view'],
      children: [
        {
          id: 'admin-users',
          icon: 'fa-users-cog',
          label: 'Usuarios',
          route: '/dashboard/administration/users',
        },
        {
          id: 'admin-roles',
          icon: 'fa-user-shield',
          label: 'Roles y Permisos',
          route: '/dashboard/administration/roles',
        },
        {
          id: 'admin-settings',
          icon: 'fa-sliders-h',
          label: 'Configuraciones',
          route: '/dashboard/administration/settings',
        },
        {
          id: 'admin-backup',
          icon: 'fa-database',
          label: 'Respaldos',
          route: '/dashboard/administration/backup',
        },
      ],
    },
  ];

  // Recursive function to create modules and their children
  async function createModuleTree(
    menuItem: MenuItem,
    parent: Module | null = null,
  ): Promise<Module> {
    // Check if module already exists
    let module = await moduleRepository.findOne({
      where: { path: menuItem.route },
    });

    if (!module) {
      // Create new module
      module = moduleRepository.create({
        name: menuItem.label,
        description: `Módulo de ${menuItem.label}`,
        path: menuItem.route,
        icon: menuItem.icon,
        position: menuItem.position || 0,
        parent: parent,
      });
      await moduleRepository.save(module);

      // Create standard CRUD permissions for the module
      const actions = ['create', 'read', 'update', 'delete'];
      for (const action of actions) {
        const permission = permissionRepository.create({
          name: `${menuItem.id}_${action}`,
          action: action,
          module: module,
        });
        await permissionRepository.save(permission);
      }
    }

    // Recursively create children if they exist
    if (menuItem.children) {
      for (const childItem of menuItem.children) {
        await createModuleTree(childItem, module);
      }
    }

    return module;
  }

  // Create all modules
  for (const menuItem of menuItems) {
    await createModuleTree(menuItem);
  }

  // Find superadmin role and assign all permissions
  const superAdminRole = await roleRepository.findOne({
    where: { name: 'Super Admin' },
  });

  if (superAdminRole) {
    // Get all permissions
    const allPermissions = await permissionRepository.find();

    // Assign all permissions to superadmin
    superAdminRole.permissions = allPermissions;
    await roleRepository.save(superAdminRole);
  }

  console.log('✅ Menu modules seeded successfully');
}
