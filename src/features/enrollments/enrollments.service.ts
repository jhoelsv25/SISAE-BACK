import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { EnrollmentStatus } from '../../common/enums/global.enum';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentEntity } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly repo: Repository<EnrollmentEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
  ) {}

  private async countEnrolledInSection(sectionId?: string, academicYearId?: string) {
    if (!sectionId || !academicYearId) return 0;
    return this.repo.count({
      where: {
        section: { id: sectionId },
        academicYear: { id: academicYearId },
        status: EnrollmentStatus.ENROLLED,
      },
    });
  }

  private async syncSectionCourseOccupancy(sectionId?: string, academicYearId?: string) {
    if (!sectionId || !academicYearId) return;
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: {
        section: { id: sectionId },
        academicYear: { id: academicYearId },
      },
    });

    if (!sectionCourse) return;

    const enrolledStudents = await this.countEnrolledInSection(sectionId, academicYearId);
    sectionCourse.enrolledStudents = enrolledStudents;
    await this.sectionCourseRepo.save(sectionCourse);
  }

  private async ensureCapacityAvailable(
    sectionId?: string,
    academicYearId?: string,
    status?: EnrollmentStatus,
    currentEnrollmentId?: string,
  ) {
    if (!sectionId || !academicYearId || status !== EnrollmentStatus.ENROLLED) return;

    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: {
        section: { id: sectionId },
        academicYear: { id: academicYearId },
      },
    });

    if (!sectionCourse?.maxStudents) return;

    const enrolledCount = await this.countEnrolledInSection(sectionId, academicYearId);
    const currentEnrollment =
      currentEnrollmentId
        ? await this.repo.findOne({
            where: { id: currentEnrollmentId },
            relations: ['section', 'academicYear'],
          })
        : null;

    const isSameSlot =
      !!currentEnrollment &&
      currentEnrollment.section?.id === sectionId &&
      currentEnrollment.academicYear?.id === academicYearId &&
      currentEnrollment.status === EnrollmentStatus.ENROLLED;

    const effectiveCount = isSameSlot ? Math.max(enrolledCount - 1, 0) : enrolledCount;

    if (effectiveCount >= sectionCourse.maxStudents) {
      throw new ErrorHandler(
        `La sección ya alcanzó su capacidad máxima de ${sectionCourse.maxStudents} estudiantes`,
        409,
      );
    }
  }

  private async ensureEnrollmentAvailability(
    studentId?: string,
    academicYearId?: string,
    sectionId?: string,
    currentEnrollmentId?: string,
  ) {
    if (!studentId || !academicYearId) return;

    const existing = await this.repo.findOne({
      where: {
        student: { id: studentId },
        academicYear: { id: academicYearId },
        status: In([EnrollmentStatus.ENROLLED, EnrollmentStatus.COMPLETED]),
      },
      relations: ['section', 'academicYear', 'student', 'student.person'],
      order: { createdAt: 'DESC' },
    });

    if (!existing || existing.id === currentEnrollmentId) return;

    const fullName =
      `${existing.student?.person?.firstName ?? ''} ${existing.student?.person?.lastName ?? ''}`.trim() ||
      existing.student?.studentCode ||
      'El estudiante';

    if (existing.section?.id === sectionId) {
      throw new ErrorHandler(`${fullName} ya está matriculado en esta sección para el año académico actual`, 409);
    }

    throw new ErrorHandler(
      `${fullName} ya tiene una matrícula activa en la sección ${existing.section?.name ?? '-'} para este año académico`,
      409,
    );
  }

  async create(dto: CreateEnrollmentDto) {
    try {
      await this.ensureEnrollmentAvailability(dto.student, dto.academicYear, dto.section);
      await this.ensureCapacityAvailable(dto.section, dto.academicYear, dto.status);
      const enrollment = this.repo.create({
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        section: dto.section ? { id: dto.section } : undefined,
        academicYear: dto.academicYear ? { id: dto.academicYear } : undefined,
      });
      await this.repo.save(enrollment);
      await this.syncSectionCourseOccupancy(dto.section, dto.academicYear);
      return { message: 'Inscripción creada correctamente', data: enrollment };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al crear la inscripción', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const { sectionCourse, studentId, sectionId, academicYearId, status, ...otherFilters } = filter;
      const query = this.repo
        .createQueryBuilder('enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('student.person', 'person')
        .leftJoinAndSelect('enrollment.section', 'section')
        .leftJoinAndSelect('enrollment.academicYear', 'academicYear');

      if (sectionCourse) {
        query.innerJoin(
          SectionCourseEntity,
          'sc',
          'sc."sectionId" = enrollment.section_id AND sc.id = :scId AND sc.deleted_at IS NULL',
          { scId: sectionCourse },
        );
      }

      if (studentId) {
        query.andWhere('student.id = :studentId', { studentId });
      }

      if (sectionId) {
        query.andWhere('section.id = :sectionId', { sectionId });
      }

      if (academicYearId) {
        query.andWhere('academicYear.id = :academicYearId', { academicYearId });
      }

      if (status) {
        query.andWhere('enrollment.status = :status', { status });
      }

      // Aplicar filtros adicionales de forma segura
      Object.keys(otherFilters).forEach((key, index) => {
        if (otherFilters[key] !== undefined && otherFilters[key] !== null) {
          query.andWhere(`enrollment.${key} = :val${index}`, {
            [`val${index}`]: otherFilters[key],
          });
        }
      });

      const enrollments = await query.getMany();
      return { message: 'Inscripciones encontradas correctamente', data: enrollments };
    } catch (error) {
      console.error('Error in EnrollmentsService.findAll:', error);
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al buscar las inscripciones', 500);
    }
  }

  async findOne(id: string) {
    try {
      const enrollment = await this.repo.findOne({
        where: { id },
        relations: ['student', 'section'],
      });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      return { message: 'Inscripción encontrada correctamente', data: enrollment };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al buscar la inscripción', 500);
    }
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    try {
      const enrollment = await this.repo.findOne({
        where: { id },
        relations: ['student', 'section', 'academicYear'],
      });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      await this.ensureEnrollmentAvailability(
        dto.student ?? enrollment.student?.id,
        dto.academicYear ?? enrollment.academicYear?.id,
        dto.section ?? enrollment.section?.id,
        id,
      );
      await this.ensureCapacityAvailable(
        dto.section ?? enrollment.section?.id,
        dto.academicYear ?? enrollment.academicYear?.id,
        (dto.status as EnrollmentStatus | undefined) ?? enrollment.status,
        id,
      );

      const previousSectionId = enrollment.section?.id;
      const previousAcademicYearId = enrollment.academicYear?.id;
      this.repo.merge(enrollment, {
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        section: dto.section ? { id: dto.section } : undefined,
        academicYear: dto.academicYear ? { id: dto.academicYear } : undefined,
      });
      await this.repo.save(enrollment);
      await this.syncSectionCourseOccupancy(previousSectionId, previousAcademicYearId);
      await this.syncSectionCourseOccupancy(
        dto.section ?? previousSectionId,
        dto.academicYear ?? previousAcademicYearId,
      );
      return { message: 'Inscripción actualizada correctamente', data: enrollment };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al actualizar la inscripción', 500);
    }
  }

  async remove(id: string) {
    try {
      const enrollment = await this.repo.findOne({
        where: { id },
        relations: ['section', 'academicYear'],
      });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      const sectionId = enrollment.section?.id;
      const academicYearId = enrollment.academicYear?.id;
      await this.repo.remove(enrollment);
      await this.syncSectionCourseOccupancy(sectionId, academicYearId);
      return { message: 'Inscripción eliminada correctamente', data: enrollment };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al eliminar la inscripción', 500);
    }
  }
}
