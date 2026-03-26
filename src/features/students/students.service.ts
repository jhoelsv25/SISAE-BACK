import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { hashPassword } from '@common/utils/password.util';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RoleEntity } from '@features/roles/entities/role.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { UserEntity, UserStatus } from '@features/users/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { ImportStudentsDto } from './dto/import-students.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentStatus, StudentType } from './enums/student.enum';
import { StudentEntity } from './entities/student.entity';

type HydratedStudent = StudentEntity & {
  person?: PersonEntity & { user?: UserEntity | null };
  institution?: InstitutionEntity | null;
};

type StudentView = {
  id: string;
  firstName: string;
  lastName: string;
  docType: string;
  docNumber: string;
  gender: 'M' | 'F' | 'O';
  birthDate: string;
  phone?: string;
  address?: string;
  email: string;
  username: string;
  studentCode: string;
  age: number;
  grade: string;
  isActive: boolean;
  photoUrl?: string;
  personId?: string;
  institution?: string | { id: string; name?: string };
};

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
    @InjectRepository(PersonEntity)
    private readonly personsRepository: Repository<PersonEntity>,
    @InjectRepository(InstitutionEntity)
    private readonly institutionsRepository: Repository<InstitutionEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardiansRepository: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardiansRepository: Repository<StudentGuardianEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateStudentDto): Promise<Response<StudentView>> {
    try {
      const institutionId = await this.resolveInstitutionId(dto.institution);
      if (!institutionId) {
        throw new ErrorHandler('No se encontró una institución para asociar al estudiante', 400);
      }

      const person = await this.savePerson(dto);
      const user = await this.saveUser(dto, person);

      const student = this.studentsRepository.create({
        studentCode: dto.studentCode,
        studentType: StudentType.REGULAR,
        religion: 'No especificada',
        nativeLanguage: 'Español',
        hasDisability: false,
        healthIssues: [],
        insunranceNumber: dto.studentCode,
        bloodType: 'No especificado',
        allergies: '',
        medicalConditions: '',
        admisionDate: new Date(),
        withdrawalReason: '',
        status: dto.isActive === false ? StudentStatus.INACTIVE : StudentStatus.ACTIVE,
        institution: { id: institutionId } as InstitutionEntity,
        person: { id: person.id } as PersonEntity,
      });

      const saved = await this.studentsRepository.save(student);
      const hydrated = await this.findStudentEntity(saved.id);

      if (!hydrated) {
        throw new ErrorHandler('No se pudo hidratar el estudiante creado', 500);
      }

      return {
        message: 'Estudiante creado correctamente',
        data: this.mapStudent(hydrated, new Map([[hydrated.id, '-']])),
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al crear el estudiante', 500);
    }
  }

  async findAll(filter: FilterStudentDto, userId?: string): Promise<PaginatedResponse<StudentView>> {
    try {
      const { page = 1, size = 10, search, status, studentType } = filter;
      const scopedStudentIds = await this.resolveVisibleStudentIds(userId);

      if (scopedStudentIds && scopedStudentIds.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          size,
        };
      }

      const qb = this.studentsRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.person', 'person')
        .leftJoinAndSelect('person.user', 'user')
        .leftJoinAndSelect('student.institution', 'institution')
        .orderBy('student.createdAt', 'DESC')
        .skip((page - 1) * size)
        .take(size);

      if (status) {
        qb.andWhere('student.status = :status', { status });
      }

      if (studentType) {
        qb.andWhere('student.student_type = :studentType', { studentType });
      }

      if (scopedStudentIds) {
        qb.andWhere('student.id IN (:...scopedStudentIds)', { scopedStudentIds });
      }

      if (search?.trim()) {
        qb.andWhere(
          `(
            student.student_code ILIKE :search OR
            person.first_name ILIKE :search OR
            person.last_name ILIKE :search OR
            person.email ILIKE :search OR
            person.document_number ILIKE :search OR
            user.username ILIKE :search
          )`,
          { search: `%${search.trim()}%` },
        );
      }

      const [students, total] = await qb.getManyAndCount();
      const gradeMap = await this.getLatestGradeMap(students.map((student) => student.id));

      return {
        data: students.map((student) => this.mapStudent(student as HydratedStudent, gradeMap)),
        total,
        page,
        size,
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      this.logger.error(
        `Error finding students with filter ${JSON.stringify(filter ?? {})} and user ${userId ?? 'anonymous'}`,
        error instanceof Error ? error.stack : `${error}`,
      );
      throw new ErrorHandler('Ocurrió un error al obtener los estudiantes', 500);
    }
  }

  async findAllCursor(
    params: FilterStudentDto & {
      limit?: number;
      cursorDate?: string;
      cursorId?: string;
    },
    userId?: string,
  ) {
    try {
      const roleRow = userId
        ? await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['role'],
            select: {
              id: true,
              role: {
                id: true,
                name: true,
              },
            },
          })
        : null;

      const result = await this.dataSource.query(`SELECT get_students_cursor($1) as result`, [
        JSON.stringify({
          ...params,
          userId,
          roleName: roleRow?.role?.name ?? null,
        }),
      ]);

      return result[0]?.result ?? { data: [], nextCursor: null };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al obtener los estudiantes por cursor', 500);
    }
  }

  async findOne(id: string): Promise<Response<StudentView>> {
    try {
      const student = await this.findStudentEntity(id);
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }

      const gradeMap = await this.getLatestGradeMap([student.id]);
      return { message: 'Estudiante encontrado', data: this.mapStudent(student, gradeMap) };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al buscar el estudiante', 500);
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Response<StudentView>> {
    try {
      const student = await this.findStudentEntity(id);
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }

      const person = await this.savePerson(dto, student.person);
      await this.saveUser(dto, person, student.person?.user ?? null);

      const institutionId = await this.resolveInstitutionId(dto.institution, student.institution?.id);
      this.studentsRepository.merge(student, {
        studentCode: dto.studentCode ?? student.studentCode,
        status:
          dto.isActive === undefined
            ? student.status
            : dto.isActive
              ? StudentStatus.ACTIVE
              : StudentStatus.INACTIVE,
        institution: institutionId ? ({ id: institutionId } as InstitutionEntity) : student.institution,
        person: { id: person.id } as PersonEntity,
      });

      await this.studentsRepository.save(student);
      const hydrated = await this.findStudentEntity(id);

      if (!hydrated) {
        throw new ErrorHandler('No se pudo hidratar el estudiante actualizado', 500);
      }

      const gradeMap = await this.getLatestGradeMap([hydrated.id]);
      return {
        message: 'Estudiante actualizado correctamente',
        data: this.mapStudent(hydrated, gradeMap),
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al actualizar el estudiante', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.studentsRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      return { message: 'Estudiante eliminado correctamente', data: null };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al eliminar el estudiante', 500);
    }
  }

  async import(dto: ImportStudentsDto): Promise<{ created: number; errors?: { row: number; message: string }[] }> {
    const errors: { row: number; message: string }[] = [];
    let created = 0;
    const prefix = `imp-${Date.now()}`;

    const [firstInstitution] = await this.institutionsRepository.find({ take: 1 });
    const institutionId = firstInstitution?.id ?? null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < dto.rows.length; i++) {
        const row = dto.rows[i];
        try {
          const nameParts = String(row.name ?? '').trim().split(/\s+/);
          const firstName = nameParts[0] || 'Sin nombre';
          const lastName = nameParts.slice(1).join(' ') || 'Importado';
          const email = String(row.email ?? '').trim() || `${prefix}-${i}@import.local`;
          const uniqueSuffix = `${prefix}-${i}`;

          const person = queryRunner.manager.create(PersonEntity, {
            documentType: DocumentType.DNI,
            documentNumber: uniqueSuffix,
            firstName,
            lastName,
            birthDate: new Date(2010, 0, 1),
            gender: Gender.OTHER,
            birthPlace: uniqueSuffix,
            nationality: 'Peruana',
            address: uniqueSuffix,
            district: uniqueSuffix,
            province: uniqueSuffix,
            department: uniqueSuffix,
            phone: uniqueSuffix,
            mobile: uniqueSuffix,
            email: email.includes('@') ? email : `${uniqueSuffix}@import.local`,
            photoUrl: '',
            materialStatus: MaterialStatus.SINGLE,
          });
          const savedPerson = await queryRunner.manager.save(PersonEntity, person);

          const studentCode = `EST-${prefix}-${i}`;
          const student = queryRunner.manager.create(StudentEntity, {
            studentCode,
            studentType: StudentType.REGULAR,
            religion: 'No especificada',
            nativeLanguage: 'Español',
            hasDisability: false,
            healthIssues: [],
            insunranceNumber: uniqueSuffix,
            bloodType: 'O+',
            allergies: 'Ninguna',
            medicalConditions: 'Ninguna',
            admisionDate: new Date(),
            withdrawalReason: '',
            status: StudentStatus.ACTIVE,
            institution: institutionId ? { id: institutionId } : undefined,
            person: { id: savedPerson.id },
          });
          await queryRunner.manager.save(StudentEntity, student);
          created++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          errors.push({ row: i + 1, message: msg });
        }
      }
      await queryRunner.commitTransaction();
      return { created, errors: errors.length > 0 ? errors : undefined };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ErrorHandler(err instanceof Error ? err.message : 'Error al importar estudiantes', 500);
    } finally {
      await queryRunner.release();
    }
  }

  private async findStudentEntity(id: string): Promise<HydratedStudent | null> {
    return this.studentsRepository.findOne({
      where: { id },
      relations: ['person', 'person.user', 'institution'],
    }) as Promise<HydratedStudent | null>;
  }

  private isFullAccessRole(roleName?: string | null) {
    const roleKey = String(roleName ?? '').toLowerCase();
    return (
      (roleKey.includes('super') && roleKey.includes('admin')) ||
      roleKey.includes('admin') ||
      roleKey.includes('director') ||
      roleKey.includes('subdirector') ||
      roleKey.includes('ugel')
    );
  }

  private isTeacherRole(roleName?: string | null) {
    const roleKey = String(roleName ?? '').toLowerCase();
    return roleKey.includes('docente') || roleKey.includes('teacher');
  }

  private isStudentRole(roleName?: string | null) {
    const roleKey = String(roleName ?? '').toLowerCase();
    return roleKey.includes('alumno') || roleKey.includes('student');
  }

  private isGuardianRole(roleName?: string | null) {
    const roleKey = String(roleName ?? '').toLowerCase();
    return roleKey.includes('apoderado') || roleKey.includes('guardian') || roleKey.includes('tutor');
  }

  private async resolveVisibleStudentIds(userId?: string): Promise<string[] | null> {
    if (!userId) {
      return null;
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['person', 'role'],
    });

    if (!user) {
      return [];
    }

    if (this.isFullAccessRole(user.role?.name)) {
      return null;
    }

    const personId = user.person?.id;
    if (!personId) {
      return [];
    }

    if (this.isStudentRole(user.role?.name)) {
      const student = await this.studentsRepository.findOne({
        where: { person: { id: personId } },
        select: ['id'],
      });
      return student ? [student.id] : [];
    }

    if (this.isGuardianRole(user.role?.name)) {
      const guardian = await this.guardiansRepository.findOne({
        where: { person: { id: personId } },
        select: ['id'],
      });

      if (!guardian) {
        return [];
      }

      const links = await this.studentGuardiansRepository.find({
        where: { guardian: { id: guardian.id } },
        relations: ['student'],
      });

      return [...new Set(links.map((link) => link.student?.id).filter(Boolean) as string[])];
    }

    if (this.isTeacherRole(user.role?.name)) {
      const teacherRows = await this.dataSource.query(
        `
          SELECT t.id
          FROM teachers t
          WHERE t.person_id = $1
          LIMIT 1
        `,
        [personId],
      );

      const teacherId = teacherRows[0]?.id as string | undefined;
      if (!teacherId) {
        return [];
      }

      const studentRows = await this.dataSource.query(
        `
          SELECT DISTINCT e.student_id AS "studentId"
          FROM enrollments e
          INNER JOIN section_courses sc
            ON sc."sectionId" = e.section_id
           AND sc.academic_year_id = e.academic_year_id
          WHERE sc."teacherId" = $1
        `,
        [teacherId],
      );

      const studentIds = studentRows
        .map((row: { studentId?: string }) => row.studentId)
        .filter((value): value is string => Boolean(value));

      return Array.from(new Set<string>(studentIds));
    }

    return [];
  }

  private async resolveInstitutionId(institutionId?: string, fallbackId?: string): Promise<string | null> {
    if (institutionId) return institutionId;
    if (fallbackId) return fallbackId;
    const firstInstitution = await this.institutionsRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });
    return firstInstitution?.id ?? null;
  }

  private async savePerson(dto: CreateStudentDto | UpdateStudentDto, current?: PersonEntity | null): Promise<PersonEntity> {
    const person = current ? this.personsRepository.create(current) : this.personsRepository.create();
    const currentEmail = current?.email ?? '';
    const nextEmail = dto.email ?? currentEmail;

    this.personsRepository.merge(person, {
      documentType: this.mapDocumentType(dto.docType ?? undefined, current?.documentType),
      documentNumber: dto.docNumber ?? current?.documentNumber ?? '',
      firstName: dto.firstName ?? current?.firstName ?? '',
      lastName: dto.lastName ?? current?.lastName ?? '',
      birthDate: dto.birthDate ? new Date(dto.birthDate) : current?.birthDate,
      gender: this.mapGender(dto.gender ?? undefined, current?.gender),
      address: dto.address ?? current?.address ?? '',
      phone: dto.phone ?? current?.phone ?? '',
      mobile: dto.phone ?? current?.mobile ?? '',
      email: nextEmail,
      photoUrl: dto.photoUrl ?? current?.photoUrl ?? '',
      materialStatus: current?.materialStatus ?? MaterialStatus.SINGLE,
      nationality: current?.nationality ?? 'Peruana',
      birthPlace: current?.birthPlace ?? '',
      district: current?.district ?? '',
      province: current?.province ?? '',
      department: current?.department ?? '',
    });

    return this.personsRepository.save(person);
  }

  private async saveUser(
    dto: CreateStudentDto | UpdateStudentDto,
    person: PersonEntity,
    current?: UserEntity | null,
  ): Promise<UserEntity> {
    const role = await this.rolesRepository.findOne({
      where: [{ name: ILike('Estudiante') }, { name: ILike('Student') }],
    });

    const nextUsername = dto.username ?? current?.username ?? person.email.split('@')[0];
    const nextEmail = dto.email ?? current?.email ?? person.email;
    const nextIsActive = dto.isActive ?? current?.isActive ?? true;

    if (current) {
      current.username = nextUsername;
      current.email = nextEmail;
      current.isActive = nextIsActive;
      current.status = nextIsActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
      current.person = person;
      if (role) current.role = role;
      if (dto.password) {
        current.password = await hashPassword(dto.password);
      }
      return this.usersRepository.save(current);
    }

    const password = dto.password ? await hashPassword(dto.password) : await hashPassword(dto.studentCode);
    const user = this.usersRepository.create({
      username: nextUsername,
      email: nextEmail,
      password,
      isActive: nextIsActive,
      status: nextIsActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      person,
      role: role ?? undefined,
    });

    return this.usersRepository.save(user);
  }

  private async getLatestGradeMap(studentIds: string[]): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    if (!studentIds.length) return map;

    const enrollments = await this.enrollmentsRepository.find({
      where: {
        student: {
          id: In(studentIds),
        },
      },
      relations: ['student', 'section', 'section.grade'],
      order: { createdAt: 'DESC' },
    });

    for (const enrollment of enrollments) {
      const studentId = enrollment.student?.id;
      if (!studentId || map.has(studentId)) continue;
      map.set(studentId, this.formatGrade(enrollment.section?.grade));
    }

    return map;
  }

  private mapStudent(student: HydratedStudent, gradeMap: Map<string, string>): StudentView {
    const person = student.person;
    const user = person?.user;
    return {
      id: student.id,
      firstName: person?.firstName ?? '',
      lastName: person?.lastName ?? '',
      docType: this.toFrontendDocType(person?.documentType),
      docNumber: person?.documentNumber ?? '',
      gender: this.toFrontendGender(person?.gender),
      birthDate: this.toDateString(person?.birthDate),
      phone: person?.phone ?? '',
      address: person?.address ?? '',
      email: user?.email ?? person?.email ?? '',
      username: user?.username ?? '',
      studentCode: student.studentCode,
      age: this.calculateAge(person?.birthDate),
      grade: gradeMap.get(student.id) ?? '-',
      isActive: user?.isActive ?? student.status === StudentStatus.ACTIVE,
      photoUrl: person?.photoUrl ?? '',
      personId: person?.id,
      institution: student.institution ? { id: student.institution.id, name: student.institution.name } : '',
    };
  }

  private mapDocumentType(value?: string, current?: DocumentType): DocumentType {
    switch ((value ?? '').toUpperCase()) {
      case 'DNI':
        return DocumentType.DNI;
      case 'PASSPORT':
        return DocumentType.PASSPORT;
      case 'CE':
        return DocumentType.OTHER;
      default:
        return current ?? DocumentType.DNI;
    }
  }

  private mapGender(value?: string, current?: Gender): Gender {
    switch ((value ?? '').toUpperCase()) {
      case 'M':
        return Gender.MALE;
      case 'F':
        return Gender.FEMALE;
      case 'O':
        return Gender.OTHER;
      default:
        return current ?? Gender.OTHER;
    }
  }

  private toFrontendDocType(value?: DocumentType): string {
    switch (value) {
      case DocumentType.DNI:
        return 'DNI';
      case DocumentType.PASSPORT:
        return 'PASSPORT';
      default:
        return 'CE';
    }
  }

  private toFrontendGender(value?: Gender): 'M' | 'F' | 'O' {
    switch (value) {
      case Gender.MALE:
        return 'M';
      case Gender.FEMALE:
        return 'F';
      default:
        return 'O';
    }
  }

  private toDateString(value?: Date): string {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
  }

  private calculateAge(value?: Date): number {
    if (!value) return 0;
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(age, 0);
  }

  private formatGrade(
    grade?: {
      name?: string;
      level?: string;
      gradeNumber?: number;
    } | null,
  ): string {
    if (!grade) return '-';
    if (grade.name) return grade.name;
    if (grade.level && grade.gradeNumber) return `${grade.gradeNumber} ${grade.level}`;
    return '-';
  }
}
