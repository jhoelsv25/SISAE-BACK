import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateTeacherAttendanceDto } from './dto/create-teacher_attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher_attendance.dto';
import { TeacherAttendanceEntity } from './entities/teacher_attendance.entity';

@Injectable()
export class TeacherAttendancesService {
  constructor(
    @InjectRepository(TeacherAttendanceEntity)
    private readonly repo: Repository<TeacherAttendanceEntity>,
  ) {}

  async create(dto: CreateTeacherAttendanceDto) {
    try {
      const attendance = this.repo.create({
        ...dto,
        teacher: { id: dto.teacher },
      });
      const data = await this.repo.save(attendance);
      return { message: 'Asistencia del docente creada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la asistencia del docente', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const data = await this.repo.find({ where: filter });
      return { message: 'Asistencia del docente obtenida correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la asistencia del docente', 500);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id } });
      if (!data) {
        throw new ErrorHandler('Asistencia del docente no encontrada', 404);
      }
      return { message: 'Asistencia del docente obtenida correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la asistencia del docente', 500);
    }
  }

  async update(id: string, dto: UpdateTeacherAttendanceDto) {
    try {
      const attendance = await this.repo.findOne({ where: { id } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia del docente no encontrada', 404);
      }
      this.repo.merge(attendance, {
        ...dto,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
      });
      const data = await this.repo.save(attendance);
      return { message: 'Asistencia del docente actualizada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la asistencia del docente', 500);
    }
  }

  async remove(id: string) {
    try {
      const attendance = await this.repo.findOne({ where: { id } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia del docente no encontrada', 404);
      }
      await this.repo.remove(attendance);
      return { message: 'Asistencia del docente eliminada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la asistencia del docente', 500);
    }
  }
}
