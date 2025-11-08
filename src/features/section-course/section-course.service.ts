import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateSectionCourseDto } from './dto/create-section-course.dto';
import { UpdateSectionCourseDto } from './dto/update-section-course.dto';
import { SectionCourseEntity } from './entities/section-course.entity';

@Injectable()
export class SectionCourseService {
  constructor(
    @InjectRepository(SectionCourseEntity)
    private readonly repo: Repository<SectionCourseEntity>,
  ) {}

  async create(dto: CreateSectionCourseDto) {
    try {
      const { academicYear, section, course, ...rest } = dto;
      const sectionCourse = this.repo.create({
        ...rest,
        academicYear: academicYear ? { id: academicYear } : undefined,
        section: section ? { id: section } : undefined,
        course: course ? { id: course } : undefined,
      });
      await this.repo.save(sectionCourse);
      return sectionCourse;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el sectionCourse', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const [data, total] = await this.repo.findAndCount({
        where: filter,
      });
      return { message: 'sectionCourse obtenidos correctamente', data, total };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener todos los sectionCourse', 500);
    }
  }

  async findOne(id: string) {
    try {
      const sectionCourse = await this.repo.findOne({
        where: { id },
      });
      if (!sectionCourse) {
        throw new ErrorHandler('sectionCourse no encontrado', 404);
      }
      return { message: 'sectionCourse obtenido correctamente', data: sectionCourse };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el sectionCourse', 500);
    }
  }

  async update(id: string, updateSectionCourseDto: UpdateSectionCourseDto) {
    try {
      const { academicYear, section, course, ...rest } = updateSectionCourseDto;
      await this.repo.update(id, {
        ...rest,
        academicYear: academicYear ? { id: academicYear } : undefined,
        section: section ? { id: section } : undefined,
        course: course ? { id: course } : undefined,
      });
      const updatedSectionCourse = await this.repo.findOne({ where: { id } });
      if (!updatedSectionCourse) {
        throw new ErrorHandler('sectionCourse no encontrado', 404);
      }
      return { message: 'sectionCourse actualizado correctamente', data: updatedSectionCourse };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el sectionCourse', 500);
    }
  }

  async remove(id: string) {
    try {
      const sectionCourse = await this.repo.findOne({ where: { id } });
      if (!sectionCourse) {
        throw new ErrorHandler('sectionCourse no encontrado', 404);
      }
      await this.repo.remove(sectionCourse);
      return { message: 'sectionCourse eliminado correctamente', data: sectionCourse };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el sectionCourse', 500);
    }
  }
}
