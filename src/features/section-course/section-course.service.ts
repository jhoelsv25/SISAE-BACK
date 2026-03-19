import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateSectionCourseDto } from './dto/create-section-course.dto';
import { UpdateSectionCourseDto } from './dto/update-section-course.dto';
import { SectionCourseEntity } from './entities/section-course.entity';

@Injectable()
export class SectionCourseService {
  private readonly logger = new Logger(SectionCourseService.name);

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
        relations: {
          section: true,
          course: true,
          academicYear: true,
          teacher: { person: true },
        },
      });
      return { message: 'Curso asignado a sección correctamente', data: hydrated };
    } catch (error) {
      this.logger.error('Error creating sectionCourse', error instanceof Error ? error.stack : `${error}`);
      throw new ErrorHandler('Ocurrió un error al crear el sectionCourse', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const { courseId, sectionId, academicYearId, teacherId, ...rest } = filter ?? {};
      const data = await this.repo.find({
        relations: {
          section: true,
          course: true,
          academicYear: true,
          teacher: { person: true },
        },
      });
      const filtered = data.filter((item) => {
        const matchCourse = !courseId || item.course?.id === courseId;
        const matchSection = !sectionId || item.section?.id === sectionId;
        const matchAcademicYear = !academicYearId || item.academicYear?.id === academicYearId;
        const matchTeacher = !teacherId || item.teacher?.id === teacherId;
        const matchRest = Object.entries(rest).every(([key, value]) => {
          if (value === undefined || value === null || value === '') return true;
          return String((item as unknown as Record<string, unknown>)[key] ?? '') === String(value);
        });
        return matchCourse && matchSection && matchAcademicYear && matchTeacher && matchRest;
      });
      const total = filtered.length;
      return { message: 'sectionCourse obtenidos correctamente', data: filtered, total };
    } catch (error) {
      this.logger.error(
        `Error finding sectionCourse list with filter ${JSON.stringify(filter ?? {})}`,
        error instanceof Error ? error.stack : `${error}`,
      );
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
      this.logger.error(`Error finding sectionCourse ${id}`, error instanceof Error ? error.stack : `${error}`);
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
        relations: {
          section: true,
          course: true,
          academicYear: true,
          teacher: { person: true },
        },
      });
      if (!updatedSectionCourse) {
        throw new ErrorHandler('sectionCourse no encontrado', 404);
      }
      return { message: 'sectionCourse actualizado correctamente', data: updatedSectionCourse };
    } catch (error) {
      this.logger.error(`Error updating sectionCourse ${id}`, error instanceof Error ? error.stack : `${error}`);
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
      this.logger.error(`Error removing sectionCourse ${id}`, error instanceof Error ? error.stack : `${error}`);
      throw new ErrorHandler('Ocurrió un error al eliminar el sectionCourse', 500);
    }
  }
}
