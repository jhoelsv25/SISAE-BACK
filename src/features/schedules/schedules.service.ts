import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleEntity } from './entities/schedule.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { TeacherEntity } from '../teachers/entities/teacher.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly repo: Repository<ScheduleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepo: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepo: Repository<StudentGuardianEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const { sectionCourse, description, ...rest } = createScheduleDto;
      const schedule = this.repo.create({
        ...rest,
        description: description ?? '',
        sectionCourse: sectionCourse ? { id: sectionCourse } : undefined,
      });
      const saved = await this.repo.save(schedule);
      return this.repo.findOne({
        where: { id: saved.id },
        relations: {
          sectionCourse: {
            section: true,
            course: true,
            teacher: { person: true },
          },
        },
      });
    } catch (error: any) {
      const driverError = error?.driverError ?? error;
      const code = driverError?.code;
      if (code === '23502') {
        throw new ErrorHandler('Falta completar un campo requerido. Por favor revise los datos.', 400, 'Schedule');
      }
      if (code === '23503') {
        throw new ErrorHandler('La sección-curso seleccionada no es válida.', 400, 'Schedule');
      }
      if (code === '23505') {
        throw new ErrorHandler('Ya existe un horario con estos datos.', 409, 'Schedule');
      }
      this.logger.error('Error creating schedule', error?.stack ?? `${error}`);
      throw new ErrorHandler('Ocurrió un error al crear el horario. Intente nuevamente.', 500, 'Schedule');
    }
  }

  async findAll(filter: any, user?: { id?: string }) {
    try {
      const { sectionId, courseId, sectionCourseId, teacherId, ...rest } = filter ?? {};
      const authUser = user?.id
        ? await this.userRepo.findOne({ where: { id: user.id }, relations: ['person', 'role'] })
        : null;
      const roleName = String(authUser?.role?.name ?? '').toLowerCase();
      const personId = authUser?.person?.id ?? null;

      const schedules = await this.repo.find({
        relations: {
          sectionCourse: {
            section: true,
            course: true,
            teacher: { person: true },
            academicYear: true,
          },
        },
      });

      let visibleSchedules = schedules;

      if (authUser && personId) {
        if (roleName.includes('docente') || roleName.includes('teacher')) {
          visibleSchedules = schedules.filter(
            (schedule) => schedule.sectionCourse?.teacher?.person?.id === personId,
          );
        } else if (roleName.includes('alumno') || roleName.includes('student')) {
          const student = await this.studentRepo.findOne({ where: { person: { id: personId } } });
          if (!student) {
            visibleSchedules = [];
          } else {
            const enrollments = await this.enrollmentRepo.find({
              where: { student: { id: student.id } },
              relations: ['section', 'academicYear'],
            });
            const keys = new Set(
              enrollments
                .filter((item) => String(item.status ?? '').toLowerCase() === 'enrolled')
                .map((item) => `${item.section?.id}:${item.academicYear?.id}`),
            );

            visibleSchedules = schedules.filter((schedule) =>
              keys.has(`${schedule.sectionCourse?.section?.id}:${schedule.sectionCourse?.academicYear?.id}`),
            );
          }
        } else if (
          roleName.includes('apoderado') ||
          roleName.includes('guardian') ||
          roleName.includes('tutor')
        ) {
          const guardian = await this.guardianRepo.findOne({ where: { person: { id: personId } } });
          if (!guardian) {
            visibleSchedules = [];
          } else {
            const links = await this.studentGuardianRepo.find({
              where: { guardian: { id: guardian.id } },
              relations: ['student'],
            });
            const studentIds = links.map((item) => item.student?.id).filter(Boolean) as string[];
            if (!studentIds.length) {
              visibleSchedules = [];
            } else {
              const enrollments = await this.enrollmentRepo.find({
                where: { student: { id: In(studentIds) } },
                relations: ['section', 'academicYear'],
              });
              const keys = new Set(
                enrollments
                  .filter((item) => String(item.status ?? '').toLowerCase() === 'enrolled')
                  .map((item) => `${item.section?.id}:${item.academicYear?.id}`),
              );

              visibleSchedules = schedules.filter((schedule) =>
                keys.has(`${schedule.sectionCourse?.section?.id}:${schedule.sectionCourse?.academicYear?.id}`),
              );
            }
          }
        }
      }

      return visibleSchedules.filter((schedule) => {
        const matchSectionCourse =
          !sectionCourseId || schedule.sectionCourse?.id === sectionCourseId;
        const matchSection =
          !sectionId || schedule.sectionCourse?.section?.id === sectionId;
        const matchCourse =
          !courseId || schedule.sectionCourse?.course?.id === courseId;
        const matchTeacher =
          !teacherId || schedule.sectionCourse?.teacher?.id === teacherId;

        const matchRest = Object.entries(rest).every(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            return true;
          }
          return String(((schedule as unknown as Record<string, unknown>)[key]) ?? '') === String(value);
        });

        return matchSectionCourse && matchSection && matchCourse && matchTeacher && matchRest;
      });
    } catch (error: any) {
      const driverError = error?.driverError ?? error;
      const code = driverError?.code;
      if (code === '23503') {
        throw new ErrorHandler('La relación del horario no es válida.', 400, 'Schedule');
      }
      this.logger.error(
        `Error finding schedules with filter ${JSON.stringify(filter ?? {})}`,
        error?.stack ?? `${error}`,
      );
      throw new ErrorHandler('Ocurrió un error al obtener los horarios.', 500, 'Schedule');
    }
  }

  async findOne(id: string) {
    try {
      return await this.repo.findOne({
        where: { id },
        relations: {
          sectionCourse: {
            section: true,
            course: true,
            teacher: { person: true },
          },
        },
      });
    } catch (error: any) {
      this.logger.error(`Error finding schedule ${id}`, error?.stack ?? `${error}`);
      throw new ErrorHandler('Ocurrió un error al obtener el horario.', 500, 'Schedule');
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const { sectionCourse, description, ...rest } = updateScheduleDto;
      const payload: Record<string, unknown> = { ...rest };
      if (description !== undefined) payload.description = description;
      if (sectionCourse !== undefined) payload.sectionCourse = sectionCourse ? { id: sectionCourse } : undefined;
      await this.repo.update(id, payload);
      return this.findOne(id);
    } catch (error: any) {
      const driverError = error?.driverError ?? error;
      const code = driverError?.code;
      if (code === '23502') {
        throw new ErrorHandler('Falta completar un campo requerido. Por favor revise los datos.', 400, 'Schedule');
      }
      if (code === '23503') {
        throw new ErrorHandler('La sección-curso seleccionada no es válida.', 400, 'Schedule');
      }
      if (code === '23505') {
        throw new ErrorHandler('Ya existe un horario con estos datos.', 409, 'Schedule');
      }
      this.logger.error(`Error updating schedule ${id}`, error?.stack ?? `${error}`);
      throw new ErrorHandler('Ocurrió un error al actualizar el horario. Intente nuevamente.', 500, 'Schedule');
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
    } catch (error) {
      this.logger.error(`Error removing schedule ${id}`, error instanceof Error ? error.stack : `${error}`);
      throw new ErrorHandler('Ocurrió un error al eliminar el horario. Intente nuevamente.', 500);
    }
  }
}
