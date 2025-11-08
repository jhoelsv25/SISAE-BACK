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
      const course = this.repo.create(dto);
      await this.repo.save(course);
      return { message: 'Curso creado correctamente', data: course };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el curso', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const courses = await this.repo.find({ where: { ...filter } });
      return { message: 'Cursos encontrados correctamente', data: courses };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los cursos', 500);
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.repo.findOne({ where: { id } });
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
      await this.repo.update(id, dto);
      const updatedCourse = await this.repo.findOne({ where: { id } });
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
