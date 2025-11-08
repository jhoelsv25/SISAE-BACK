import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';

@Injectable()
export class VirtualClassroomsService {
  constructor(
    @InjectRepository(VirtualClassroomEntity)
    private readonly repo: Repository<VirtualClassroomEntity>,
  ) {}

  async create(dto: CreateVirtualClassroomDto): Promise<Response<VirtualClassroomEntity>> {
    try {
      const entity = this.repo.create({
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      await this.repo.save(entity);
      return { message: 'Aula virtual creada con éxito', data: entity };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el aula virtual', 500);
    }
  }

  async findAll(filters: FilterBaseDto): Promise<PaginatedResponse<VirtualClassroomEntity>> {
    try {
      const { page = 1, size = 10 } = filters;
      const [data, total] = await this.repo.findAndCount({
        skip: (page - 1) * size,
        take: size,
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
      return this.repo.findOne({ where: { id } });
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
      const updatedEntity = await this.repo.findOne({ where: { id } });
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
