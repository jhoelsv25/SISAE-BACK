import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserReadRepository } from '@features/users/repositories/user-read.repository';
import { AttendanceEntity } from '@features/attendances/entities/attendance.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { GradeEntity } from '@features/grades/entities/grade.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PaymentEntity } from '@features/payments/entities/payment.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import type { DashboardResponse, DashboardRole } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userReadRepository: UserReadRepository,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepository: Repository<EnrollmentEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepository: Repository<SectionCourseEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepository: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepository: Repository<StudentGuardianEntity>,
  ) {}

  async getDashboard(userId: string): Promise<DashboardResponse> {
    if (!userId || userId === 'undefined') {
      return this.buildGuestDashboard('Invitado');
    }
    const user = await this.userReadRepository.findById(userId);
    const roleLabel = user?.role?.name ?? 'Invitado';
    const roleType = this.mapRoleType(String(roleLabel).toLowerCase());

    switch (roleType) {
      case 'student':
        return this.buildStudentDashboard(userId, roleLabel);
      case 'teacher':
        return this.buildTeacherDashboard(userId, roleLabel);
      case 'admin':
        return this.buildAdminDashboard(roleType, roleLabel);
      case 'superadmin':
        return this.buildSuperAdminDashboard(roleLabel);
      case 'director':
      case 'subdirector':
        return this.buildDirectorDashboard(roleType, roleLabel);
      case 'guardian':
        return this.buildGuardianDashboard(userId, roleLabel);
      case 'ugel':
        return this.buildUgelDashboard(roleLabel);
      case 'guest':
        return this.buildGuestDashboard(roleLabel);
      default:
        return this.buildGuestDashboard(roleLabel);
    }
  }

  private mapRoleType(roleKey: string): DashboardRole {
    if (roleKey.includes('super') && roleKey.includes('admin')) return 'superadmin';
    if (roleKey.includes('subdirector')) return 'subdirector';
    if (roleKey.includes('admin')) return 'admin';
    if (roleKey.includes('director')) return 'director';
    if (roleKey.includes('ugel')) return 'ugel';
    if (roleKey.includes('docente') || roleKey.includes('teacher')) return 'teacher';
    if (roleKey.includes('alumno') || roleKey.includes('student')) return 'student';
    if (roleKey.includes('apoderado') || roleKey.includes('guardian') || roleKey.includes('tutor')) return 'guardian';
    if (roleKey.includes('invitado') || roleKey.includes('guest') || roleKey.includes('libre')) return 'guest';
    return 'user';
  }

  private async buildStudentDashboard(userId: string, roleLabel: string): Promise<DashboardResponse> {
    const user = await this.userReadRepository.findById(userId);
    const personId = user.person?.id;
    const student = personId
      ? await this.studentRepository.findOne({ where: { person: { id: personId } } })
      : null;

    const enrollmentCount = student
      ? await this.enrollmentRepository.count({ where: { student: { id: student.id } } })
      : 0;

    const attendanceCount = student
      ? await this.attendanceRepository
          .createQueryBuilder('attendance')
          .leftJoin('attendance.enrollment', 'enrollment')
          .where('enrollment.studentId = :studentId', { studentId: student.id })
          .getCount()
      : 0;

    const gradeAverage = student
      ? await this.gradeRepository
          .createQueryBuilder('grade')
          .leftJoin('grade.enrollment', 'enrollment')
          .where('enrollment.studentId = :studentId', { studentId: student.id })
          .select('AVG(grade.finalGrade)', 'avg')
          .getRawOne()
      : null;

    const avgValue = gradeAverage?.avg ? Number(gradeAverage.avg).toFixed(2) : 'N/A';

    return {
      role: 'student',
      roleLabel,
      summary: [
        {
          id: 'enrollments',
          label: 'Mis clases',
          value: enrollmentCount,
          icon: 'fa-solid fa-book',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'attendance',
          label: 'Asistencias',
          value: attendanceCount,
          icon: 'fa-solid fa-clipboard-check',
          color: 'bg-success-100 text-success-700',
        },
        {
          id: 'average',
          label: 'Promedio final',
          value: avgValue,
          icon: 'fa-solid fa-chart-line',
          color: 'bg-info-100 text-info-700',
        },
      ],
      quickLinks: [
        { id: 'profile', label: 'Mi perfil', route: '/account/profile', icon: 'fa-solid fa-user', color: 'bg-neutral-100 text-neutral-700' },
        { id: 'grades', label: 'Calificaciones', route: '/assessments/grades', icon: 'fa-solid fa-star', color: 'bg-primary-100 text-primary-700' },
        { id: 'attendance', label: 'Asistencia', route: '/attendance', icon: 'fa-solid fa-clipboard-check', color: 'bg-success-100 text-success-700' },
        { id: 'classroom', label: 'Aula virtual', route: '/virtual-classroom', icon: 'fa-solid fa-chalkboard', color: 'bg-warning-100 text-warning-700' },
        { id: 'communications', label: 'Comunicaciones', route: '/communications', icon: 'fa-solid fa-envelope', color: 'bg-accent-100 text-accent-700' },
      ],
      sections: [
        {
          id: 'performance',
          title: 'Tu rendimiento',
          description: 'Resumen de tu actividad academica reciente.',
          items: [
            { label: 'Clases inscritas', value: enrollmentCount },
            { label: 'Asistencias registradas', value: attendanceCount },
            { label: 'Promedio final', value: avgValue },
          ],
        },
      ],
    };
  }

  private async buildTeacherDashboard(userId: string, roleLabel: string): Promise<DashboardResponse> {
    const user = await this.userReadRepository.findById(userId);
    const personId = user.person?.id;
    const teacher = personId
      ? await this.teacherRepository.findOne({ where: { person: { id: personId } } })
      : null;

    const classCount = teacher
      ? await this.sectionCourseRepository.count({ where: { teacher: { id: teacher.id } } })
      : 0;

    const enrolledStudents = teacher
      ? await this.sectionCourseRepository
          .createQueryBuilder('sectionCourse')
          .select('COALESCE(SUM(sectionCourse.enrolledStudents), 0)', 'total')
          .where('sectionCourse.teacherId = :teacherId', { teacherId: teacher.id })
          .getRawOne()
      : { total: 0 };

    const totalStudents = Number(enrolledStudents?.total ?? 0);

    return {
      role: 'teacher',
      roleLabel,
      summary: [
        {
          id: 'classes',
          label: 'Mis clases',
          value: classCount,
          icon: 'fa-solid fa-chalkboard',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'students',
          label: 'Estudiantes asignados',
          value: totalStudents,
          icon: 'fa-solid fa-user-group',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'communications',
          label: 'Comunicaciones',
          value: 'Activo',
          icon: 'fa-solid fa-envelope',
          color: 'bg-success-100 text-success-700',
        },
      ],
      quickLinks: [
        { id: 'classes', label: 'Mis clases', route: '/organization/section-courses', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-primary-100 text-primary-700' },
        { id: 'attendance', label: 'Asistencia', route: '/attendance', icon: 'fa-solid fa-clipboard-check', color: 'bg-success-100 text-success-700' },
        { id: 'grades', label: 'Calificaciones', route: '/assessments/grades', icon: 'fa-solid fa-star', color: 'bg-info-100 text-info-700' },
        { id: 'assessments', label: 'Evaluaciones', route: '/assessments', icon: 'fa-solid fa-pen-to-square', color: 'bg-warning-100 text-warning-700' },
        { id: 'communications', label: 'Comunicaciones', route: '/communications', icon: 'fa-solid fa-envelope', color: 'bg-accent-100 text-accent-700' },
      ],
      sections: [
        {
          id: 'teaching',
          title: 'Gestion docente',
          description: 'Resumen de tus clases y estudiantes.',
          items: [
            { label: 'Clases activas', value: classCount },
            { label: 'Estudiantes asignados', value: totalStudents },
          ],
        },
      ],
    };
  }

  private async buildAdminDashboard(role: DashboardRole, roleLabel: string): Promise<DashboardResponse> {
    const studentCount = await this.studentRepository.count();
    const teacherCount = await this.teacherRepository.count();
    const paymentCount = await this.paymentRepository.count();

    return {
      role,
      roleLabel,
      summary: [
        {
          id: 'students',
          label: 'Estudiantes',
          value: studentCount,
          icon: 'fa-solid fa-user-graduate',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'teachers',
          label: 'Docentes',
          value: teacherCount,
          icon: 'fa-solid fa-chalkboard-teacher',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'payments',
          label: 'Pagos',
          value: paymentCount,
          icon: 'fa-solid fa-coins',
          color: 'bg-success-100 text-success-700',
        },
      ],
      quickLinks: [
        { id: 'students', label: 'Gestion estudiantes', route: '/students/list', icon: 'fa-solid fa-user-graduate', color: 'bg-primary-100 text-primary-700' },
        { id: 'teachers', label: 'Gestion docentes', route: '/teachers/list', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-info-100 text-info-700' },
        { id: 'payments', label: 'Pagos', route: '/payments', icon: 'fa-solid fa-money-bill-wave', color: 'bg-success-100 text-success-700' },
        { id: 'attendance', label: 'Asistencia', route: '/attendance', icon: 'fa-solid fa-clipboard-check', color: 'bg-warning-100 text-warning-700' },
        { id: 'reports', label: 'Reportes', route: '/reports', icon: 'fa-solid fa-chart-bar', color: 'bg-neutral-100 text-neutral-700' },
      ],
      sections: [
        {
          id: 'overview',
          title: 'Resumen institucional',
          description: 'Indicadores generales de la institucion.',
          items: [
            { label: 'Estudiantes activos', value: studentCount },
            { label: 'Docentes activos', value: teacherCount },
            { label: 'Pagos registrados', value: paymentCount },
          ],
        },
      ],
    };
  }

  private async buildSuperAdminDashboard(roleLabel: string): Promise<DashboardResponse> {
    const studentCount = await this.studentRepository.count();
    const teacherCount = await this.teacherRepository.count();
    const paymentCount = await this.paymentRepository.count();
    const attendanceCount = await this.attendanceRepository.count();
    const institutionCount = await this.institutionRepository.count();

    return {
      role: 'superadmin',
      roleLabel,
      summary: [
        {
          id: 'institutions',
          label: 'Instituciones',
          value: institutionCount,
          icon: 'fa-solid fa-school',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'students',
          label: 'Estudiantes',
          value: studentCount,
          icon: 'fa-solid fa-user-graduate',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'teachers',
          label: 'Docentes',
          value: teacherCount,
          icon: 'fa-solid fa-chalkboard-teacher',
          color: 'bg-success-100 text-success-700',
        },
        {
          id: 'attendance',
          label: 'Asistencias',
          value: attendanceCount,
          icon: 'fa-solid fa-clipboard-check',
          color: 'bg-warning-100 text-warning-700',
        },
      ],
      quickLinks: [
        { id: 'administration', label: 'Administración', route: '/administration', icon: 'fa-solid fa-gear', color: 'bg-neutral-100 text-neutral-700' },
        { id: 'institutions', label: 'Instituciones', route: '/organization', icon: 'fa-solid fa-school', color: 'bg-primary-100 text-primary-700' },
        { id: 'reports', label: 'Reportes', route: '/reports', icon: 'fa-solid fa-chart-bar', color: 'bg-info-100 text-info-700' },
        { id: 'students', label: 'Estudiantes', route: '/students/list', icon: 'fa-solid fa-user-graduate', color: 'bg-success-100 text-success-700' },
        { id: 'teachers', label: 'Docentes', route: '/teachers/list', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-warning-100 text-warning-700' },
      ],
      sections: [
        {
          id: 'control',
          title: 'Control total',
          description: 'Vista completa de la institución y administración del sistema.',
          items: [
            { label: 'Instituciones', value: institutionCount },
            { label: 'Estudiantes', value: studentCount },
            { label: 'Docentes', value: teacherCount },
            { label: 'Asistencias', value: attendanceCount },
            { label: 'Pagos', value: paymentCount },
          ],
        },
      ],
    };
  }

  private async buildDirectorDashboard(role: DashboardRole, roleLabel: string): Promise<DashboardResponse> {
    const studentCount = await this.studentRepository.count();
    const teacherCount = await this.teacherRepository.count();
    const paymentCount = await this.paymentRepository.count();
    const attendanceCount = await this.attendanceRepository.count();

    return {
      role,
      roleLabel,
      summary: [
        {
          id: 'students',
          label: 'Estudiantes',
          value: studentCount,
          icon: 'fa-solid fa-user-graduate',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'teachers',
          label: 'Docentes',
          value: teacherCount,
          icon: 'fa-solid fa-chalkboard-teacher',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'attendance',
          label: 'Asistencias',
          value: attendanceCount,
          icon: 'fa-solid fa-clipboard-check',
          color: 'bg-success-100 text-success-700',
        },
        {
          id: 'payments',
          label: 'Pagos',
          value: paymentCount,
          icon: 'fa-solid fa-coins',
          color: 'bg-warning-100 text-warning-700',
        },
      ],
      quickLinks: [
        { id: 'reports', label: 'Reportes', route: '/reports', icon: 'fa-solid fa-chart-line', color: 'bg-primary-100 text-primary-700' },
        { id: 'students', label: 'Estudiantes', route: '/students/list', icon: 'fa-solid fa-user-graduate', color: 'bg-info-100 text-info-700' },
        { id: 'teachers', label: 'Docentes', route: '/teachers/list', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-success-100 text-success-700' },
        { id: 'payments', label: 'Pagos', route: '/payments', icon: 'fa-solid fa-money-bill-wave', color: 'bg-warning-100 text-warning-700' },
        { id: 'attendance', label: 'Asistencia', route: '/attendance', icon: 'fa-solid fa-clipboard-check', color: 'bg-accent-100 text-accent-700' },
      ],
      sections: [
        {
          id: 'institution',
          title: 'Vista global',
          description: 'Indicadores clave de la institucion.',
          items: [
            { label: 'Estudiantes', value: studentCount },
            { label: 'Docentes', value: teacherCount },
            { label: 'Asistencias', value: attendanceCount },
            { label: 'Pagos', value: paymentCount },
          ],
        },
      ],
    };
  }

  private async buildGuardianDashboard(userId: string, roleLabel: string): Promise<DashboardResponse> {
    const user = await this.userReadRepository.findById(userId);
    const personId = user.person?.id;
    const guardian = personId
      ? await this.guardianRepository.findOne({ where: { person: { id: personId } } })
      : null;

    const relations = guardian
      ? await this.studentGuardianRepository.find({
          where: { guardian: { id: guardian.id } },
          relations: ['student'],
        })
      : [];

    const studentIds = relations.map((rel) => rel.student?.id).filter(Boolean);

    const dependents = studentIds.length;
    const enrollmentCount = studentIds.length
      ? await this.enrollmentRepository.count({ where: { student: { id: In(studentIds) } } })
      : 0;

    return {
      role: 'guardian',
      roleLabel,
      summary: [
        {
          id: 'dependents',
          label: 'Hijos a cargo',
          value: dependents,
          icon: 'fa-solid fa-users',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'enrollments',
          label: 'Matriculas',
          value: enrollmentCount,
          icon: 'fa-solid fa-id-card',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'communications',
          label: 'Comunicaciones',
          value: 'Disponible',
          icon: 'fa-solid fa-envelope',
          color: 'bg-success-100 text-success-700',
        },
      ],
      quickLinks: [
        { id: 'profile', label: 'Mi perfil', route: '/account/profile', icon: 'fa-solid fa-user', color: 'bg-primary-100 text-primary-700' },
        { id: 'attendance', label: 'Asistencia', route: '/attendance', icon: 'fa-solid fa-clipboard-check', color: 'bg-success-100 text-success-700' },
        { id: 'grades', label: 'Calificaciones', route: '/assessments/grades', icon: 'fa-solid fa-star', color: 'bg-info-100 text-info-700' },
        { id: 'communications', label: 'Comunicaciones', route: '/communications', icon: 'fa-solid fa-envelope', color: 'bg-accent-100 text-accent-700' },
      ],
      sections: [
        {
          id: 'dependents',
          title: 'Seguimiento academico',
          description: 'Resumen general de tus dependientes.',
          items: [
            { label: 'Dependientes registrados', value: dependents },
            { label: 'Matriculas activas', value: enrollmentCount },
          ],
        },
      ],
    };
  }

  private async buildUgelDashboard(roleLabel: string): Promise<DashboardResponse> {
    const institutionCount = await this.institutionRepository.count();
    const studentCount = await this.studentRepository.count();
    const teacherCount = await this.teacherRepository.count();

    return {
      role: 'ugel',
      roleLabel,
      summary: [
        {
          id: 'institutions',
          label: 'Instituciones',
          value: institutionCount,
          icon: 'fa-solid fa-school',
          color: 'bg-primary-100 text-primary-700',
        },
        {
          id: 'students',
          label: 'Estudiantes',
          value: studentCount,
          icon: 'fa-solid fa-user-graduate',
          color: 'bg-info-100 text-info-700',
        },
        {
          id: 'teachers',
          label: 'Docentes',
          value: teacherCount,
          icon: 'fa-solid fa-chalkboard-teacher',
          color: 'bg-success-100 text-success-700',
        },
      ],
      quickLinks: [
        { id: 'reports', label: 'Reportes regionales', route: '/reports', icon: 'fa-solid fa-chart-bar', color: 'bg-primary-100 text-primary-700' },
        { id: 'organization', label: 'Instituciones', route: '/organization', icon: 'fa-solid fa-school', color: 'bg-info-100 text-info-700' },
        { id: 'students', label: 'Estudiantes', route: '/students/list', icon: 'fa-solid fa-user-graduate', color: 'bg-success-100 text-success-700' },
      ],
      sections: [
        {
          id: 'overview',
          title: 'Supervision UGEL',
          description: 'Indicadores generales de la jurisdiccion.',
          items: [
            { label: 'Instituciones', value: institutionCount },
            { label: 'Estudiantes', value: studentCount },
            { label: 'Docentes', value: teacherCount },
          ],
        },
      ],
    };
  }

  private buildGuestDashboard(roleLabel: string): DashboardResponse {
    return {
      role: 'guest',
      roleLabel,
      summary: [
        {
          id: 'welcome',
          label: 'Vista publica',
          value: 'Disponible',
          icon: 'fa-solid fa-circle-info',
          color: 'bg-primary-100 text-primary-700',
        },
      ],
      quickLinks: [
        { id: 'modules', label: 'Modulos', route: '/modules-list', icon: 'fa-solid fa-table-cells', color: 'bg-primary-100 text-primary-700' },
        { id: 'institution', label: 'Institucion', route: '/organization', icon: 'fa-solid fa-school', color: 'bg-info-100 text-info-700' },
      ],
      sections: [
        {
          id: 'public',
          title: 'Informacion publica',
          description: 'Contenido disponible sin credenciales institucionales.',
          items: [
            { label: 'Programas educativos', value: 'Disponible' },
            { label: 'Eventos y noticias', value: 'Disponible' },
          ],
        },
      ],
    };
  }
}
