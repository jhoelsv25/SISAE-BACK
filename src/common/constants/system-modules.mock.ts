export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route?: string;
  order?: number;
  permissions?: string[];
  children?: MenuItem[];
  visibility?: Visibility;
  isSystem?: boolean;
  badge?: number;
}

export const MENU_MODULES_MOCK: MenuItem[] = [
  {
    id: 'dashboard',
    icon: 'fa-home',
    label: 'Dashboard',
    route: '/dashboard',
    order: 1,
    permissions: ['view_dashboard'],
    visibility: Visibility.PUBLIC,
  },

  // ============================================
  // CONFIGURACIÓN ACADÉMICA
  // ============================================
  {
    id: 'academic-setup',
    icon: 'fa-cog',
    label: 'Configuración Académica',
    route: '/academic-setup',
    order: 2,
    permissions: ['manage_academic_setup'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'academic-years',
        icon: 'fa-calendar-check',
        label: 'Años y Periodos',
        route: '/academic-setup/years',
        permissions: ['view_academic_year'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'grade-levels',
        icon: 'fa-layer-group',
        label: 'Niveles y Grados',
        route: '/academic-setup/grade-levels',
        permissions: ['view_grade_level'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'subject-areas',
        icon: 'fa-th-large',
        label: 'Áreas y Cursos',
        route: '/academic-setup/subject-areas',
        permissions: ['view_subject_area'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'competencies',
        icon: 'fa-star',
        label: 'Competencias',
        route: '/academic-setup/competencies',
        permissions: ['view_competency'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // ORGANIZACIÓN (Secciones)
  // ============================================
  {
    id: 'organization',
    icon: 'fa-sitemap',
    label: 'Organización Escolar',
    route: '/organization',
    order: 3,
    permissions: ['view_organization'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'sections',
        icon: 'fa-users',
        label: 'Secciones',
        route: '/organization/sections',
        permissions: ['view_section'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'schedules',
        icon: 'fa-calendar-days',
        label: 'Horarios',
        route: '/organization/schedules',
        permissions: ['view_schedule'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // ESTUDIANTES 
  // ============================================
  {
    id: 'students',
    icon: 'fa-user-graduate',
    label: 'Estudiantes',
    route: '/students',
    order: 4,
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
        id: 'enrollments',
        icon: 'fa-file-signature',
        label: 'Matrículas',
        route: '/students/enrollments',
        permissions: ['view_enrollment'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'guardians',
        icon: 'fa-user-shield',
        label: 'Apoderados',
        route: '/students/guardians',
        permissions: ['view_guardian'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // DOCENTES
  // ============================================
  {
    id: 'teachers',
    icon: 'fa-chalkboard-teacher',
    label: 'Docentes',
    route: '/teachers',
    order: 5,
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
        id: 'teacher-attendances',
        icon: 'fa-user-check',
        label: 'Asistencia Docente',
        route: '/teachers/attendances',
        permissions: ['view_teacher_attendance'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // EVALUACIONES Y ASISTENCIA
  // ============================================
  {
    id: 'academic-management',
    icon: 'fa-book-reader',
    label: 'Académico',
    order: 6,
    permissions: ['view_assessment', 'view_attendance'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'assessments',
        icon: 'fa-file-signature',
        label: 'Evaluaciones',
        route: '/assessments/list',
        permissions: ['view_assessment'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'attendance',
        icon: 'fa-clipboard-check',
        label: 'Asistencia Estudiantes',
        route: '/attendance/register',
        permissions: ['view_attendance'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'behavior',
        icon: 'fa-flag',
        label: 'Conducta',
        route: '/behavior/records',
        permissions: ['view_behavior'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // AULA VIRTUAL
  // ============================================
  {
    id: 'virtual-classroom',
    icon: 'fa-laptop-code',
    label: 'Aula Virtual',
    route: '/virtual-classroom',
    order: 7,
    permissions: ['view_virtual_classroom'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'virtual-classrooms-list',
        icon: 'fa-door-open',
        label: 'Mis Aulas',
        route: '/virtual-classroom/list',
        permissions: ['view_virtual_classroom'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'assignments',
        icon: 'fa-tasks',
        label: 'Tareas y Entregas',
        route: '/virtual-classroom/list',
        permissions: ['view_assignment'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // SERVICIOS
  // ============================================
  {
    id: 'services',
    icon: 'fa-concierge-bell',
    label: 'Servicios',
    order: 8,
    permissions: ['view_payment', 'view_communication'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'payments',
        icon: 'fa-money-bill-wave',
        label: 'Caja y Pagos',
        route: '/payments/register',
        permissions: ['view_payment'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'communications',
        icon: 'fa-bullhorn',
        label: 'Comunicaciones',
        route: '/communications/announcements',
        permissions: ['view_communication'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },

  // ============================================
  // ADMINISTRACIÓN
  // ============================================
  {
    id: 'administration',
    icon: 'fa-cogs',
    label: 'Administración',
    route: '/administration',
    order: 9,
    permissions: ['view_administration'],
    visibility: Visibility.PUBLIC,
    children: [
      {
        id: 'institution',
        icon: 'fa-university',
        label: 'Institución',
        route: '/administration/institution',
        permissions: ['manage_institution'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'users',
        icon: 'fa-user-cog',
        label: 'Gestión de Usuarios',
        route: '/administration/users',
        permissions: ['view_user'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'roles-permissions',
        icon: 'fa-user-lock',
        label: 'Roles y Permisos',
        route: '/administration/roles',
        permissions: ['view_role', 'view_permission'],
        visibility: Visibility.PUBLIC,
      },
      {
        id: 'audit-logs',
        icon: 'fa-history',
        label: 'Auditoría',
        route: '/administration/audit-logs',
        permissions: ['view_audit_log'],
        visibility: Visibility.PUBLIC,
      },
    ],
  },
];
