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
      const { academicYear, section, course, teacher, ...rest } = dto;
      const sectionCourse = this.repo.create({
        ...rest,
        academicYear: academicYear ? { id: academicYear } : undefined,
        section: section ? { id: section } : undefined,
        course: course ? { id: course } : undefined,
        teacher: teacher ? { id: teacher } : undefined,
      });
      const saved = await this.repo.save(sectionCourse);
      const hydrated = await this.repo.findOne({
        where: { id: saved.id },
        relations: ['section', 'course', 'academicYear', 'teacher', 'teacher.person'],
      });
      return { message: 'Curso asignado a sección correctamente', data: hydrated };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el sectionCourse', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const { courseId, sectionId, academicYearId, teacherId, ...rest } = filter ?? {};
      const qb = this.repo
        .createQueryBuilder('sectionCourse')
        .leftJoinAndSelect('sectionCourse.section', 'section')
        .leftJoinAndSelect('sectionCourse.course', 'course')
        .leftJoinAndSelect('sectionCourse.academicYear', 'academicYear')
        .leftJoinAndSelect('sectionCourse.teacher', 'teacher')
        .leftJoinAndSelect('teacher.person', 'teacherPerson');

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          qb.andWhere(`sectionCourse.${key} = :${key}`, { [key]: value });
        }
      });

      if (courseId) {
        qb.andWhere('course.id = :courseId', { courseId });
      }
      if (sectionId) {
        qb.andWhere('section.id = :sectionId', { sectionId });
      }
      if (academicYearId) {
        qb.andWhere('academicYear.id = :academicYearId', { academicYearId });
      }
      if (teacherId) {
        qb.andWhere('teacher.id = :teacherId', { teacherId });
      }

      const [data, total] = await qb.getManyAndCount();
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
      const { academicYear, section, course, teacher, ...rest } = updateSectionCourseDto;
      const payload: Record<string, unknown> = { ...rest };
      if (academicYear !== undefined) payload.academicYear = academicYear ? { id: academicYear } : undefined;
      if (section !== undefined) payload.section = section ? { id: section } : undefined;
      if (course !== undefined) payload.course = course ? { id: course } : undefined;
      if (teacher !== undefined) payload.teacher = teacher ? { id: teacher } : null;
      await this.repo.update(id, payload);
      const updatedSectionCourse = await this.repo.findOne({
        where: { id },
        relations: ['section', 'course', 'academicYear', 'teacher', 'teacher.person'],
      });
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
