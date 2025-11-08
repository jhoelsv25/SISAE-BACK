import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentEntity } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly repo: Repository<EnrollmentEntity>,
  ) {}
  async create(dto: CreateEnrollmentDto) {
    try {
      const enrollment = this.repo.create({
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        section: dto.section ? { id: dto.section } : undefined,
        academicYear: dto.academicYear ? { id: dto.academicYear } : undefined,
      });
      await this.repo.save(enrollment);
      return { message: 'Inscripción creada correctamente', data: enrollment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la inscripción', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const enrollments = await this.repo.find({
        where: filter,
        relations: ['student', 'section'],
      });
      return { message: 'Inscripciones encontradas correctamente', data: enrollments };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar las inscripciones', 500);
    }
  }

  async findOne(id: string) {
    try {
      const enrollment = await this.repo.findOne({
        where: { id },
        relations: ['student', 'section'],
      });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      return { message: 'Inscripción encontrada correctamente', data: enrollment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar la inscripción', 500);
    }
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    try {
      const enrollment = await this.repo.findOne({ where: { id } });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      this.repo.merge(enrollment, {
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        section: dto.section ? { id: dto.section } : undefined,
        academicYear: dto.academicYear ? { id: dto.academicYear } : undefined,
      });
      await this.repo.save(enrollment);
      return { message: 'Inscripción actualizada correctamente', data: enrollment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la inscripción', 500);
    }
  }

  async remove(id: string) {
    try {
      const enrollment = await this.repo.findOne({ where: { id } });
      if (!enrollment) {
        throw new ErrorHandler('Inscripción no encontrada', 404);
      }
      await this.repo.remove(enrollment);
      return { message: 'Inscripción eliminada correctamente', data: enrollment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la inscripción', 500);
    }
  }
}
