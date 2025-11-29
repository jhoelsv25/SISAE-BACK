import { DataSource } from 'typeorm';
import { ActionEntity } from '../../features/actions/entities/action.entity';
import { ModuleEntity } from '../../features/modules/entities/module.entity';
import { PermissionEntity } from '../../features/permissions/entities/permission.entity';
import { RoleEntity } from '../../features/roles/entities/role.entity';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route: string;
  order?: number;
  permissions?: string[];
  children?: MenuItem[];
  visibility?: Visibility;
  isSystem?: boolean;
  badge?: number;
}

enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export async function seedMenuModules(dataSource: DataSource) {
  const moduleRepository = dataSource.getRepository(ModuleEntity);
  const permissionRepository = dataSource.getRepository(PermissionEntity);
  const roleRepository = dataSource.getRepository(RoleEntity);

  const menuStructure: MenuItem[] = [
    {
      id: 'dashboard',
      icon: 'fa-home',
      label: 'Dashboard',
      route: '/dashboard',
      order: 1,
      permissions: ['view_dashboard'],
      visibility: Visibility.PUBLIC,
    },
    {
      id: 'academic',
      icon: 'fa-graduation-cap',
      label: 'Académico',
      route: '/academic',
      order: 2,
      permissions: ['view_academic'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'academic-years',
          icon: 'fa-calendar',
          label: 'Años Académicos',
          route: '/academic/years',
          permissions: ['view_academic_year', 'manage_academic_year'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'academic-periods',
          icon: 'fa-clock',
          label: 'Períodos',
          route: '/academic/periods',
          permissions: ['view_academic_period', 'manage_academic_period'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'grade-levels',
          icon: 'fa-chart-bar',
          label: 'Niveles y Grados',
          route: '/academic/grade-levels',
          permissions: ['view_grade_level', 'manage_grade_level'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'sections',
          icon: 'fa-users',
          label: 'Secciones',
          route: '/academic/sections',
          permissions: ['view_section', 'manage_section'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'subjects',
          icon: 'fa-book-open',
          label: 'Áreas y Cursos',
          route: '/academic/subjects',
          permissions: ['view_course', 'manage_course'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'schedule',
          icon: 'fa-calendar-days',
          label: 'Horarios',
          route: '/academic/schedule',
          permissions: ['view_schedule', 'manage_schedule'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'students',
      icon: 'fa-user-graduate',
      label: 'Estudiantes',
      route: '/students',
      order: 3,
      permissions: ['view_student'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'students-list',
          icon: 'fa-list',
          label: 'Lista de Estudiantes',
          route: '/students/list',
          permissions: ['view_student'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'students-enrollment',
          icon: 'fa-file-signature',
          label: 'Matrículas',
          route: '/students/enrollment',
          permissions: ['view_enrollment', 'manage_enrollment'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'students-guardians',
          icon: 'fa-user-shield',
          label: 'Apoderados',
          route: '/students/guardians',
          permissions: ['view_guardian', 'manage_guardian'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'students-behavior',
          icon: 'fa-flag',
          label: 'Conducta',
          route: '/students/behavior',
          permissions: ['view_behavior', 'manage_behavior'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'students-observations',
          icon: 'fa-eye',
          label: 'Observaciones',
          route: '/students/observations',
          permissions: ['view_observation', 'manage_observation'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'teachers',
      icon: 'fa-chalkboard-teacher',
      label: 'Docentes',
      route: '/teachers',
      order: 4,
      permissions: ['view_teacher'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'teachers-list',
          icon: 'fa-list',
          label: 'Lista de Docentes',
          route: '/teachers/list',
          permissions: ['view_teacher'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'teachers-assignments',
          icon: 'fa-tasks',
          label: 'Asignaciones',
          route: '/teachers/assignments',
          permissions: ['view_section_course', 'manage_section_course'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'teachers-attendance',
          icon: 'fa-user-check',
          label: 'Asistencia Docente',
          route: '/teachers/attendance',
          permissions: ['view_teacher_attendance', 'manage_teacher_attendance'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'grades',
      icon: 'fa-file-alt',
      label: 'Calificaciones',
      route: '/grades',
      order: 5,
      permissions: ['view_grade'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'grades-register',
          icon: 'fa-pen-square',
          label: 'Registro de Notas',
          route: '/grades/register',
          permissions: ['manage_grade'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'grades-competencies',
          icon: 'fa-star',
          label: 'Competencias',
          route: '/grades/competencies',
          permissions: ['view_competency', 'manage_competency'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'grades-assessments',
          icon: 'fa-clipboard',
          label: 'Evaluaciones',
          route: '/grades/assessments',
          permissions: ['view_assessment', 'manage_assessment'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'grades-reports',
          icon: 'fa-chart-bar',
          label: 'Reportes',
          route: '/grades/reports',
          permissions: ['view_grade_report'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'attendance',
      icon: 'fa-user-check',
      label: 'Asistencia',
      route: '/attendance',
      order: 6,
      permissions: ['view_attendance'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'attendance-register',
          icon: 'fa-check-circle',
          label: 'Registro',
          route: '/attendance/register',
          permissions: ['manage_attendance'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'attendance-reports',
          icon: 'fa-chart-pie',
          label: 'Reportes',
          route: '/attendance/reports',
          permissions: ['view_attendance'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'virtual-classroom',
      icon: 'fa-chalkboard',
      label: 'Aula Virtual',
      route: '/virtual-classroom',
      order: 7,
      permissions: ['view_virtual_classroom'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'virtual-classrooms',
          icon: 'fa-video',
          label: 'Aulas Virtuales',
          route: '/virtual-classroom/rooms',
          permissions: ['view_virtual_classroom', 'manage_virtual_classroom'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'learning-modules',
          icon: 'fa-folder',
          label: 'Módulos de Aprendizaje',
          route: '/virtual-classroom/modules',
          permissions: ['view_learning_module', 'manage_learning_module'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'learning-materials',
          icon: 'fa-file',
          label: 'Materiales',
          route: '/virtual-classroom/materials',
          permissions: ['view_learning_material', 'manage_learning_material'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'assignments',
          icon: 'fa-tasks',
          label: 'Tareas',
          route: '/virtual-classroom/assignments',
          permissions: ['view_assignment', 'manage_assignment'],
          badge: 0, // Dinámico: tareas pendientes por calificar
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'forums',
          icon: 'fa-comments',
          label: 'Foros',
          route: '/virtual-classroom/forums',
          permissions: ['view_forum', 'manage_forum'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'chat',
          icon: 'fa-comment-dots',
          label: 'Chat',
          route: '/virtual-classroom/chat',
          permissions: ['view_chat'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'video-conferences',
          icon: 'fa-video',
          label: 'Videoconferencias',
          route: '/virtual-classroom/conferences',
          permissions: ['view_video_conference', 'manage_video_conference'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'file-storage',
          icon: 'fa-cloud-upload-alt',
          label: 'Archivos',
          route: '/virtual-classroom/files',
          permissions: ['view_file_storage', 'manage_file_storage'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'payments',
      icon: 'fa-money-bill-wave',
      label: 'Pagos',
      route: '/payments',
      order: 8,
      permissions: ['view_payment'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'payments-register',
          icon: 'fa-file-invoice-dollar',
          label: 'Registro de Pagos',
          route: '/payments/register',
          permissions: ['manage_payment'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'payments-pending',
          icon: 'fa-exclamation-triangle',
          label: 'Pendientes',
          route: '/payments/pending',
          permissions: ['view_payment'],
          badge: 0, // Dinámico: pagos vencidos
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'payments-reports',
          icon: 'fa-chart-bar',
          label: 'Reportes Financieros',
          route: '/payments/reports',
          permissions: ['view_payment_report'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'communications',
      icon: 'fa-bullhorn',
      label: 'Comunicaciones',
      route: '/communications',
      order: 9,
      permissions: ['view_communication'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'announcements',
          icon: 'fa-bullhorn',
          label: 'Anuncios',
          route: '/communications/announcements',
          permissions: ['view_announcement', 'manage_announcement'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'notifications',
          icon: 'fa-bell',
          label: 'Notificaciones',
          route: '/communications/notifications',
          permissions: ['view_notification'],
          badge: 0, // Dinámico: notificaciones no leídas
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'email-log',
          icon: 'fa-envelope',
          label: 'Historial de Emails',
          route: '/communications/email-log',
          permissions: ['view_email_log'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'reports',
      icon: 'fa-chart-bar',
      label: 'Reportes',
      route: '/reports',
      order: 10,
      permissions: ['view_reports'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'reports-academic',
          icon: 'fa-graduation-cap',
          label: 'Reportes Académicos',
          route: '/reports/academic',
          permissions: ['view_academic_report'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'reports-attendance',
          icon: 'fa-user-check',
          label: 'Reportes de Asistencia',
          route: '/reports/attendance',
          permissions: ['view_attendance_report'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'reports-behavior',
          icon: 'fa-flag',
          label: 'Reportes de Conducta',
          route: '/reports/behavior',
          permissions: ['view_behavior_report'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'reports-financial',
          icon: 'fa-money-bill-wave',
          label: 'Reportes Financieros',
          route: '/reports/financial',
          permissions: ['view_financial_report'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'administration',
      icon: 'fa-cogs',
      label: 'Administración',
      route: '/administration',
      order: 11,
      permissions: ['view_administration'],
      visibility: Visibility.PUBLIC,
      children: [
        {
          id: 'institution',
          icon: 'fa-building',
          label: 'Institución',
          route: '/administration/institution',
          permissions: ['manage_institution'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'users',
          icon: 'fa-users',
          label: 'Usuarios',
          route: '/administration/users',
          permissions: ['view_user', 'manage_user'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'roles',
          icon: 'fa-user-shield',
          label: 'Roles y Permisos',
          route: '/administration/roles',
          permissions: ['view_role', 'manage_role'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'audit-log',
          icon: 'fa-file-search',
          label: 'Auditoría',
          route: '/administration/audit-log',
          permissions: ['view_audit_log'],
          visibility: Visibility.PUBLIC,
        },
        {
          id: 'sessions',
          icon: 'fa-desktop',
          label: 'Sesiones Activas',
          route: '/administration/sessions',
          permissions: ['view_sessions', 'manage_sessions'],
          visibility: Visibility.PUBLIC,
        },
      ],
    },
    {
      id: 'profile',
      icon: 'fa-user-circle',
      label: 'Mi Perfil',
      route: '/profile',
      order: 12,
      permissions: [],
      visibility: Visibility.PRIVATE,
    },
  ];

  const menuItems: MenuItem[] = menuStructure;
  // Antes de crear módulos, asegúrate de poblar la tabla actions con los keys estándar
  const actionRepository = dataSource.getRepository(ActionEntity);
  const standardActions = [
    { key: 'create', name: 'Crear' },
    { key: 'read', name: 'Leer' },
    { key: 'update', name: 'Actualizar' },
    { key: 'delete', name: 'Eliminar' },
  ];
  for (const action of standardActions) {
    let exists = await actionRepository.findOne({ where: { key: action.key } });
    if (!exists) {
      exists = actionRepository.create(action);
      await actionRepository.save(exists);
    }
  }

  // Recursive function to create modules and their children
  async function createModuleTree(
    menuItem: MenuItem,
    parent: ModuleEntity | null = null,
  ): Promise<ModuleEntity> {
    // Extraer el key desde el route (última parte de la ruta)
    const routeParts = menuItem.route.split('/').filter(part => part.length > 0);
    const key = routeParts[routeParts.length - 1]; // Última parte, ej: 'users', 'roles', 'dashboard'

    // Construir el path basado en el padre
    let path = key;
    if (parent?.path) {
      path = `${parent.path}/${key}`;
    }

    // Check if module already exists
    let module = await moduleRepository.findOne({
      where: { key },
    });

    if (!module) {
      // Create new module
      module = moduleRepository.create({
        name: menuItem.label,
        description: `Módulo de ${menuItem.label}`,
        path: path,
        key: key,
        icon: menuItem.icon,
        order: menuItem.order || 0,
        visibility: menuItem.visibility || Visibility.PUBLIC,
        isSystem: menuItem.isSystem || false,
        parent: parent,
      });
      await moduleRepository.save(module);

      // Create standard CRUD permissions for the module
      const actions = ['create', 'read', 'update', 'delete'];

      for (const actionKey of actions) {
        // Busca la entidad de acción por key
        let actionEntity = await actionRepository.findOne({ where: { key: actionKey } });
        if (!actionEntity) {
          actionEntity = actionRepository.create({
            key: actionKey,
            name: actionKey.charAt(0).toUpperCase() + actionKey.slice(1),
          });
          await actionRepository.save(actionEntity);
        }

        const permissionKey = `${key}:${actionKey}`;

        // Verifica si el permiso ya existe antes de crearlo
        let exists = await permissionRepository.findOne({ where: { key: permissionKey } });
        if (!exists) {
          const permission = permissionRepository.create({
            key: permissionKey,
            name: `${menuItem.label} - ${actionKey}`,
            action: actionEntity, // Una sola acción (singular)
            module: module,
          });
          await permissionRepository.save(permission);
        }
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
