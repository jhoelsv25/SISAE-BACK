import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
  ) {}

  async create(dto: CreateStudentDto): Promise<Response<StudentEntity>> {
    try {
      const student = this.studentsRepository.create({
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
        person: dto.person ? { id: dto.person } : undefined,
      });
      const data = await this.studentsRepository.save(student);
      return { message: 'Estudiante creado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el estudiante', 500);
    }
  }

  async findAll(filter: FilterStudentDto): Promise<PaginatedResponse<StudentEntity>> {
    try {
      const { page = 1, size = 10, ...rest } = filter;
      const where: FindOptionsWhere<StudentEntity> = {};
      for (const key of Object.keys(rest)) {
        if (rest[key] !== undefined && rest[key] !== null) {
          where[key] = rest[key];
        }
      }
      const [data, total] = await this.studentsRepository.findAndCount({
        where,
        take: size,
        skip: (page - 1) * size,
      });
      return { data, total, page, size };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los estudiantes', 500);
    }
  }

  async findOne(id: string): Promise<Response<StudentEntity>> {
    try {
      const student = await this.studentsRepository.findOne({ where: { id } });
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      return { message: 'Estudiante encontrado', data: student };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar el estudiante', 500);
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Response<StudentEntity>> {
    try {
      const student = await this.studentsRepository.findOne({ where: { id } });
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      this.studentsRepository.merge(student, {
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
        person: dto.person ? { id: dto.person } : undefined,
      });
      await this.studentsRepository.save(student);
      return { message: 'Estudiante actualizado correctamente', data: student };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el estudiante', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.studentsRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      return { message: 'Estudiante eliminado correctamente', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el estudiante', 500);
    }
  }
}
