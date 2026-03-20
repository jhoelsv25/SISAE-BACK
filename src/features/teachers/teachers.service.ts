import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { PaginatedResponse, Response } from '../../common/types/global.types';
import { PersonEntity } from '../persons/entities/person.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherEntity } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teachersRepository: Repository<TeacherEntity>,
    @InjectRepository(PersonEntity)
    private readonly personsRepository: Repository<PersonEntity>,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Response<TeacherEntity>> {
    try {
      const { institution, person, photoUrl, ...restDto } = dto;
      const teacher = this.teachersRepository.create({
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      const saved = await this.teachersRepository.save(teacher);
      if (person && photoUrl) {
        await this.personsRepository.update(person, { photoUrl });
      }
      const hydrated = await this.teachersRepository.findOne({
        where: { id: saved.id },
        relations: ['person', 'institution'],
      });
      return { message: 'Docente creado correctamente', data: hydrated ?? saved };
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

      const qb = this.teachersRepository
        .createQueryBuilder('teacher')
        .leftJoinAndSelect('teacher.person', 'person')
        .leftJoinAndSelect('teacher.institution', 'institution')
        .where(where);

      if (search) {
        qb.andWhere(
          `(
            teacher.teacherCode ILIKE :search OR
            teacher.specialization ILIKE :search OR
            teacher.professionalTitle ILIKE :search OR
            person.firstName ILIKE :search OR
            person.lastName ILIKE :search OR
            person.email ILIKE :search
          )`,
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
      const teacher = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
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
      const { institution, person, photoUrl, ...restDto } = dto;
      this.teachersRepository.merge(teacher, {
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      await this.teachersRepository.save(teacher);
      const personId = person || (teacher.person as unknown as { id?: string } | undefined)?.id;
      if (personId && photoUrl) {
        await this.personsRepository.update(personId, { photoUrl });
      }
      const hydrated = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
      return { message: 'Docente actualizado correctamente', data: hydrated ?? teacher };
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
