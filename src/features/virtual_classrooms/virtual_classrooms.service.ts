import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { StatusType } from '@common/enums/global.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';
import { PlatformType, VirtualClassroomType } from './enums/virtual_classroom.enum';

@Injectable()
export class VirtualClassroomsService {
  constructor(
    @InjectRepository(VirtualClassroomEntity)
    private readonly repo: Repository<VirtualClassroomEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
  ) {}

  private async ensureVirtualClassrooms(): Promise<void> {
    const [existing, sectionCourses] = await Promise.all([
      this.repo.find({ relations: ['sectionCourse'] }),
      this.sectionCourseRepo.find({
        relations: ['course', 'section', 'teacher', 'teacher.person', 'academicYear'],
      }),
    ]);

    const existingSectionCourseIds = new Set(existing.map((item) => item.sectionCourse?.id).filter(Boolean));
    const missing = sectionCourses.filter((item) => !existingSectionCourseIds.has(item.id));

    if (!missing.length) return;

    const classrooms = missing.map((item) =>
      this.repo.create({
        platform: PlatformType.GOOGLE_MEET,
        accessUrl: `/virtual-classroom/${item.id}`,
        type: VirtualClassroomType.LECTURE,
        status: StatusType.ACTIVE,
        sectionCourse: { id: item.id },
        settings: {
          autoProvisioned: true,
        },
      }),
    );

    await this.repo.save(classrooms);
  }

  async create(dto: CreateVirtualClassroomDto): Promise<Response<VirtualClassroomEntity>> {
    try {
      const entity = this.repo.create({
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      await this.repo.save(entity);
      const saved = await this.repo.findOne({
        where: { id: entity.id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
      return { message: 'Aula virtual creada con éxito', data: saved };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el aula virtual', 500);
    }
  }

  async findAll(filters: FilterBaseDto): Promise<PaginatedResponse<VirtualClassroomEntity>> {
    try {
      await this.ensureVirtualClassrooms();
      const { page = 1, size = 10 } = filters;
      const [data, total] = await this.repo.findAndCount({
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
        skip: (page - 1) * size,
        take: size,
        order: { createdAt: 'DESC' },
      });
      return {
        data,
        page,
        size,
        total,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener las aulas virtuales', 500);
    }
  }

  async findOne(id: string): Promise<VirtualClassroomEntity> {
    try {
      return this.repo.findOne({
        where: { id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener el aula virtual', 500);
    }
  }

  async update(
    id: string,
    dto: UpdateVirtualClassroomDto,
  ): Promise<Response<VirtualClassroomEntity>> {
    try {
      const res = await this.repo.findOne({ where: { id } });
      if (!res) throw new ErrorHandler('Aula virtual no encontrada', 404);
      await this.repo.update(id, {
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      const updatedEntity = await this.repo.findOne({
        where: { id },
        relations: ['sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'sectionCourse.teacher', 'sectionCourse.teacher.person', 'sectionCourse.academicYear'],
      });
      return { message: 'Aula virtual actualizada con éxito', data: updatedEntity };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar el aula virtual', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const res = await this.repo.findOne({ where: { id } });
      if (!res) throw new ErrorHandler('Aula virtual no encontrada', 404);
      await this.repo.remove(res);
      return { message: 'Aula virtual eliminada con éxito', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar el aula virtual', 500);
    }
  }
}
