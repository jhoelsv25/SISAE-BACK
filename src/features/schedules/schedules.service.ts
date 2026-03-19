import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly repo: Repository<ScheduleEntity>,
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

  async findAll(filter: any) {
    try {
      const { sectionId, courseId, sectionCourseId, ...rest } = filter ?? {};
      const schedules = await this.repo.find({
        relations: {
          sectionCourse: {
            section: true,
            course: true,
            teacher: { person: true },
          },
        },
      });

      return schedules.filter((schedule) => {
        const matchSectionCourse =
          !sectionCourseId || schedule.sectionCourse?.id === sectionCourseId;
        const matchSection =
          !sectionId || schedule.sectionCourse?.section?.id === sectionId;
        const matchCourse =
          !courseId || schedule.sectionCourse?.course?.id === courseId;

        const matchRest = Object.entries(rest).every(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            return true;
          }
          return String(((schedule as unknown as Record<string, unknown>)[key]) ?? '') === String(value);
        });

        return matchSectionCourse && matchSection && matchCourse && matchRest;
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
