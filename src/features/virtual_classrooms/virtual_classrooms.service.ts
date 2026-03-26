import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { StatusType } from '@common/enums/global.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';
import { PlatformType, VirtualClassroomType } from './enums/virtual_classroom.enum';

@Injectable()
export class VirtualClassroomsService {
  constructor(
    @InjectRepository(VirtualClassroomEntity)
    private readonly repo: Repository<VirtualClassroomEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepo: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepo: Repository<StudentGuardianEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
  ) {}

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

  private async filterByUserAccess(
    classrooms: VirtualClassroomEntity[],
    userId?: string,
  ): Promise<VirtualClassroomEntity[]> {
    if (!userId) {
      return [];
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['person', 'role'],
    });

    if (!user) {
      return [];
    }

    if (this.isFullAccessRole(user.role?.name)) {
      return classrooms;
    }

    const personId = user.person?.id;
    if (!personId) {
      return [];
    }

    if (this.isTeacherRole(user.role?.name)) {
      return classrooms.filter(
        (classroom) => classroom.sectionCourse?.teacher?.person?.id === personId,
      );
    }

    if (this.isStudentRole(user.role?.name)) {
      const student = await this.studentRepo.findOne({
        where: { person: { id: personId } },
      });

      if (!student) {
        return [];
      }

      const enrollments = await this.enrollmentRepo.find({
        where: { student: { id: student.id } },
        relations: ['section', 'academicYear'],
      });

      const enrollmentKeys = new Set(
        enrollments.map((item) => `${item.section?.id ?? ''}:${item.academicYear?.id ?? ''}`),
      );

      return classrooms.filter((classroom) =>
        enrollmentKeys.has(
          `${classroom.sectionCourse?.section?.id ?? ''}:${classroom.sectionCourse?.academicYear?.id ?? ''}`,
        ),
      );
    }

    if (this.isGuardianRole(user.role?.name)) {
      const guardian = await this.guardianRepo.findOne({
        where: { person: { id: personId } },
      });

      if (!guardian) {
        return [];
      }

      const guardianLinks = await this.studentGuardianRepo.find({
        where: { guardian: { id: guardian.id } },
        relations: ['student'],
      });

      const studentIds = guardianLinks
        .map((item) => item.student?.id)
        .filter(Boolean) as string[];

      if (!studentIds.length) {
        return [];
      }

      const enrollments = await this.enrollmentRepo.find({
        where: studentIds.map((studentId) => ({ student: { id: studentId } })),
        relations: ['section', 'academicYear'],
      });

      const enrollmentKeys = new Set(
        enrollments.map((item) => `${item.section?.id ?? ''}:${item.academicYear?.id ?? ''}`),
      );

      return classrooms.filter((classroom) =>
        enrollmentKeys.has(
          `${classroom.sectionCourse?.section?.id ?? ''}:${classroom.sectionCourse?.academicYear?.id ?? ''}`,
        ),
      );
    }

    return [];
  }

  private async ensureVirtualClassrooms(): Promise<void> {
    const [existing, sectionCourses] = await Promise.all([
      this.repo.find({ relations: ['sectionCourse'] }),
      this.sectionCourseRepo.find({
        relations: ['course', 'section', 'teacher', 'teacher.person', 'academicYear'],
      }),
    ]);

    const existingSectionCourseIds = new Set(existing.map((item) => item.sectionCourse?.id).filter(Boolean));
    const missing = sectionCourses.filter((item) => !existingSectionCourseIds.has(item.id));

    if (!missing.length) return;

    const classrooms = missing.map((item) =>
      this.repo.create({
        platform: PlatformType.GOOGLE_MEET,
        accessUrl: `/virtual-classroom/${item.id}`,
        type: VirtualClassroomType.LECTURE,
        status: StatusType.ACTIVE,
        sectionCourse: { id: item.id },
        settings: {
          autoProvisioned: true,
        },
      }),
    );

    await this.repo.save(classrooms);
  }

  async create(dto: CreateVirtualClassroomDto): Promise<Response<VirtualClassroomEntity>> {
    try {
      const entity = this.repo.create({
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      await this.repo.save(entity);
      const saved = await this.repo.findOne({
        where: { id: entity.id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
      return { message: 'Aula virtual creada con éxito', data: saved };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el aula virtual', 500);
    }
  }

  async findAll(filters: FilterBaseDto, userId?: string): Promise<PaginatedResponse<VirtualClassroomEntity>> {
    try {
      await this.ensureVirtualClassrooms();
      const { page = 1, size = 10 } = filters;
      const classrooms = await this.repo.find({
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
        order: { createdAt: 'DESC' },
      });

      const scoped = await this.filterByUserAccess(classrooms, userId);
      const total = scoped.length;
      const data = scoped.slice((page - 1) * size, page * size);

      return {
        data,
        page,
        size,
        total,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener las aulas virtuales', 500);
    }
  }

  async findOne(id: string): Promise<VirtualClassroomEntity> {
    try {
      return this.repo.findOne({
        where: { id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener el aula virtual', 500);
    }
  }

  async update(
    id: string,
    dto: UpdateVirtualClassroomDto,
  ): Promise<Response<VirtualClassroomEntity>> {
    try {
      const res = await this.repo.findOne({ where: { id } });
      if (!res) throw new ErrorHandler('Aula virtual no encontrada', 404);
      await this.repo.update(id, {
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      const updatedEntity = await this.repo.findOne({
        where: { id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
      return { message: 'Aula virtual actualizada con éxito', data: updatedEntity };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar el aula virtual', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const res = await this.repo.findOne({ where: { id } });
      if (!res) throw new ErrorHandler('Aula virtual no encontrada', 404);
      await this.repo.remove(res);
      return { message: 'Aula virtual eliminada con éxito', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar el aula virtual', 500);
    }
  }
}
