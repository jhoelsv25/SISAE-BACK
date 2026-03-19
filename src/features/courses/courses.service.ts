import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly repo: Repository<CourseEntity>,
  ) {}

  async create(dto: CreateCourseDto) {
    try {
      const { subjectAreaId, gradeId, ...rest } = dto;
      const course = this.repo.create({
        ...rest,
        competencies: rest.competencies ?? '',
        syllabusUrl: rest.syllabusUrl ?? '',
        subjectArea: { id: subjectAreaId },
        grade: { id: gradeId },
      });
      const saved = await this.repo.save(course);
      const hydrated = await this.repo.findOne({
        where: { id: saved.id },
        relations: ['subjectArea', 'grade'],
      });
      return { message: 'Curso creado correctamente', data: hydrated };
    } catch (error) {
      const message = error?.message ?? 'Ocurrió un error al crear el curso';
      throw new ErrorHandler(message, 500);
    }
  }

  async findAll(filter: any) {
    try {
      const { gradeId, subjectAreaId, ...rest } = filter ?? {};
      const where: any = { ...rest };
      if (gradeId) {
        where.grade = { id: gradeId };
      }
      if (subjectAreaId) {
        where.subjectArea = { id: subjectAreaId };
      }
      const courses = await this.repo.find({
        where,
        relations: ['subjectArea', 'grade'],
      });
      return { message: 'Cursos encontrados correctamente', data: courses };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los cursos', 500);
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.repo.findOne({
        where: { id },
        relations: ['subjectArea', 'grade'],
      });
      if (!course) {
        throw new ErrorHandler('Curso no encontrado', 404);
      }
      return { message: 'Curso encontrado correctamente', data: course };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el curso', 500);
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    try {
      const { subjectAreaId, gradeId, ...rest } = dto as UpdateCourseDto & {
        subjectAreaId?: string;
        gradeId?: string;
      };
      const payload: any = { ...rest };
      if (subjectAreaId) {
        payload.subjectArea = { id: subjectAreaId };
      }
      if (gradeId) {
        payload.grade = { id: gradeId };
      }
      await this.repo.update(id, payload);
      const updatedCourse = await this.repo.findOne({
        where: { id },
        relations: ['subjectArea', 'grade'],
      });
      return { message: 'Curso actualizado correctamente', data: updatedCourse };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el curso', 500);
    }
  }

  async remove(id: string) {
    try {
      const course = await this.repo.findOne({ where: { id } });
      if (!course) {
        throw new ErrorHandler('Curso no encontrado', 404);
      }
      await this.repo.remove(course);
      return { message: 'Curso eliminado correctamente', data: course };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el curso', 500);
    }
  }
}
