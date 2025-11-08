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
      const { sectionCourse, ...rest } = createScheduleDto;
      const schedule = this.repo.create({
        ...rest,
        sectionCourse: sectionCourse ? { id: sectionCourse } : undefined,
      });
      return this.repo.save(schedule);
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el horario', 500);
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
      const { sectionCourse, ...rest } = updateScheduleDto;
      await this.repo.update(id, {
        ...rest,
        sectionCourse: sectionCourse ? { id: sectionCourse } : undefined,
      });
      return this.findOne(id);
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar el horario', 500);
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar el horario', 500);
    }
  }
}
