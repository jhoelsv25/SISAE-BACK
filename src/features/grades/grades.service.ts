import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeEntity } from './entities/grade.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly repo: Repository<GradeEntity>,
  ) {}

  async create(dto: CreateGradeDto) {
    try {
      // Convert enrollment string to object reference
      const grade = this.repo.create({
        ...dto,
        enrollment: { id: dto.enrollment }, // assuming dto.enrollment is the id
        sectionCourse: { id: dto.sectionCourse }, // assuming dto.sectionCourse is the id
        period: { id: dto.period }, // assuming dto.period is the id
        teacher: { id: dto.teacher }, // assuming dto.teacher is the id
      });
      await this.repo.save(grade);
      return { message: 'Grado creado correctamente', data: grade };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el grado', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const grades = await this.repo.find({ where: { ...filter } });
      return grades;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar los grados', 500);
    }
  }

  async findOne(id: string) {
    try {
      const grade = await this.repo.findOne({ where: { id } });
      if (!grade) throw new ErrorHandler('Grado no encontrado', 404);
      return { message: 'Grado encontrado correctamente', data: grade };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar el grado', 500);
    }
  }

  async update(id: string, dto: UpdateGradeDto) {
    try {
      await this.repo.update(id, {
        ...dto,
        enrollment: dto.enrollment ? { id: dto.enrollment } : undefined,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        period: dto.period ? { id: dto.period } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
      });
      return { message: 'Grado actualizado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el grado', 500);
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
      return { message: 'Grado eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el grado', 500);
    }
  }
}
