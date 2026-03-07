import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
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
      return this.repo.save(schedule);
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
      throw new ErrorHandler('Ocurrió un error al crear el horario. Intente nuevamente.', 500, 'Schedule');
    }
  }

  async findAll(filter: any) {
    return this.repo.find({ where: filter });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
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
      throw new ErrorHandler('Ocurrió un error al actualizar el horario. Intente nuevamente.', 500, 'Schedule');
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el horario. Intente nuevamente.', 500);
    }
  }
}
