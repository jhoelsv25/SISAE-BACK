import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { PaginatedResponse, Response } from '../../common/types/global.types';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherEntity } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teachersRepository: Repository<TeacherEntity>,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Response<TeacherEntity>> {
    try {
      const { institution, person, ...restDto } = dto;
      const teacher = this.teachersRepository.create({
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      await this.teachersRepository.save(teacher);
      return { message: 'Docente creado correctamente', data: teacher };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el docente', 500);
    }
  }

  async findAll(query: FilterTeacherDto): Promise<PaginatedResponse<TeacherEntity>> {
    try {
      const { page = 1, size = 10, search, ...rest } = query;
      const where: FindOptionsWhere<TeacherEntity> = {};

      for (const key of ['contractType', 'laborRegime', 'workloadType', 'employmentStatus']) {
        if (rest[key] !== undefined && rest[key] !== null) {
          where[key] = rest[key];
        }
      }

      const qb = this.teachersRepository.createQueryBuilder('teacher').where(where);

      if (search) {
        qb.andWhere(
          '(teacher.teacherCode ILIKE :search OR teacher.specialization ILIKE :search OR teacher.professionalTitle ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      qb.skip((page - 1) * size).take(size);

      const [teachers, total] = await qb.getManyAndCount();

      return {
        data: teachers,
        total,
        page,
        size,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener los docentes', 500);
    }
  }

  async findOne(id: string): Promise<Response<TeacherEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({ where: { id } });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      return { message: 'Docente encontrado', data: teacher };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener el docente', 500);
    }
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Response<TeacherEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({ where: { id } });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      const { institution, person, ...restDto } = dto;
      this.teachersRepository.merge(teacher, {
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      await this.teachersRepository.save(teacher);
      return { message: 'Docente actualizado correctamente', data: teacher };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar el docente', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.teachersRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      return { message: 'Docente eliminado correctamente', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar el docente', 500);
    }
  }
}
