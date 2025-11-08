import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly repo: Repository<AttendanceEntity>,
  ) {}

  async create(dto: CreateAttendanceDto) {
    try {
      // Assuming dto.enrollment is a string (id), convert it to an object reference
      const attendance = this.repo.create({
        ...dto,
        enrollment: { id: dto.enrollment },
        sectionCourse: { id: dto.sectionCourse },
      });
      await this.repo.save(attendance);
      return { message: 'Asistencia creada correctamente', data: attendance };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la asistencia', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const attendances = await this.repo.find({ where: filter });
      return { message: 'Asistencias obtenidas correctamente', data: attendances };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las asistencias', 500);
    }
  }

  async findOne(id: string) {
    try {
      const attendance = await this.repo.findOne({ where: { id } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia no encontrada', 404);
      }
      return { message: 'Asistencia obtenida correctamente', data: attendance };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la asistencia', 500);
    }
  }

  async update(id: string, dto: UpdateAttendanceDto) {
    try {
      const attendance = await this.repo.findOne({ where: { id } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia no encontrada', 404);
      }
      this.repo.merge(attendance, {
        ...dto,
        enrollment: dto.enrollment ? { id: dto.enrollment } : undefined,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      await this.repo.save(attendance);
      return { message: 'Asistencia actualizada correctamente', data: attendance };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la asistencia', 500);
    }
  }

  async remove(id: string) {
    try {
      const attendance = await this.repo.findOne({ where: { id } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia no encontrada', 404);
      }
      await this.repo.remove(attendance);
      return { message: 'Asistencia eliminada correctamente', data: attendance };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la asistencia', 500);
    }
  }
}
