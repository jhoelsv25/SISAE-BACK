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
      const qb = this.repo
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.teacher', 'teacher')
        .andWhere('attendance.vigencia = :vigencia', { vigencia: 1 });

      if (filter?.date) {
        qb.andWhere('attendance.date = :date', { date: filter.date });
      }

      if (filter?.teacher) {
        qb.andWhere('teacher.id = :teacherId', { teacherId: filter.teacher });
      }

      const data = await qb.orderBy('teacher.teacherCode', 'ASC').getMany();
      return { message: 'Asistencia del docente obtenida correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la asistencia del docente', 500);
    }
  }

  async findTeachers() {
    try {
      const data = await this.repo.manager.query(
        `SELECT
          t.id,
          t.teacher_code AS "teacherCode",
          t.specialization,
          p.first_name AS "firstName",
          p.last_name AS "lastName"
        FROM teachers t
        LEFT JOIN persons p ON p.id = t.person_id
        ORDER BY t.teacher_code ASC`,
      );
      return { message: 'Docentes obtenidos correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener docentes para asistencia', 500);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id, vigencia: 1 } });
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
      const attendance = await this.repo.findOne({ where: { id, vigencia: 1 } });
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
      const attendance = await this.repo.findOne({ where: { id, vigencia: 1 } });
      if (!attendance) {
        throw new ErrorHandler('Asistencia del docente no encontrada', 404);
      }
      await this.repo.update(id, { vigencia: 0 });
      return { message: 'Asistencia del docente eliminada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la asistencia del docente', 500);
    }
  }

  async registerBulk(data: any) {
    try {
      const { date, attendances } = data;
      // attendances is expected to be an array of objects: { teacherCode, status, observations, checkInTime }

      const teacherCodes = attendances.map((a: any) => a.teacherCode).filter(Boolean);
      const teachers = await this.repo.manager.query(
        `SELECT id, teacher_code AS "teacherCode" FROM teachers WHERE teacher_code = ANY($1)`,
        [teacherCodes]
      );
      const teacherMap = new Map(teachers.map((t: any) => [t.teacherCode, t.id]));

      const results = { success: true, message: 'Asistencias registradas correctamente', processed: 0, errors: [] as string[] };
      for (const item of attendances) {
        if (!item.teacherCode) continue;
        const teacherId = teacherMap.get(item.teacherCode);
        if (!teacherId) {
          results.errors.push(`Docente con código ${item.teacherCode} no encontrado`);
          continue;
        }

        const existing = await this.repo.findOne({
          where: { date, teacher: { id: teacherId as string }, vigencia: 1 },
        });
        if (existing) {
          this.repo.merge(existing, { 
            status: item.status, 
            observations: item.observations,
            checkInTime: item.checkInTime || existing.checkInTime
          });
          await this.repo.save(existing);
        } else {
          const newAtt = this.repo.create({
            date,
            teacher: { id: teacherId as string },
            status: item.status,
            observations: item.observations,
            leaveType: item.observations ? 'Permiso' : 'Asistencia Regular',
            checkInTime: item.checkInTime || '00:00:00',
            vigencia: 1,
          });
          await this.repo.save(newAtt);
        }
        results.processed++;
      }
      return results;
    } catch (error: any) {
      throw new ErrorHandler('Error al registrar asistencias masivas de docentes: ' + error.message, 500);
    }
  }
}
