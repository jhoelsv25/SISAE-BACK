import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateStudentObservationDto } from './dto/create-student_observation.dto';
import { UpdateStudentObservationDto } from './dto/update-student_observation.dto';
import { StudentObservationEntity } from './entities/student_observation.entity';

@Injectable()
export class StudentObservationsService {
  constructor(
    @InjectRepository(StudentObservationEntity)
    private readonly repo: Repository<StudentObservationEntity>,
  ) {}

  async create(dto: CreateStudentObservationDto) {
    try {
      // Convert student and teacher from string (ID) to object as expected by StudentObservationEntity
      const observation = this.repo.create({
        ...dto,
        student: { id: dto.student }, // assuming dto.student is the student ID
        teacher: { id: dto.teacher }, // assuming dto.teacher is the teacher ID
      });
      await this.repo.save(observation);
      return { message: 'Observación del estudiante creada correctamente', data: observation };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la observación del estudiante', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const observations = await this.repo.find({ where: filter });
      return {
        message: 'Observaciones del estudiante obtenidas correctamente',
        data: observations,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las observaciones del estudiante', 500);
    }
  }

  async findOne(id: string) {
    try {
      const observation = await this.repo.findOne({ where: { id } });
      if (!observation) {
        throw new ErrorHandler('Observación del estudiante no encontrada', 404);
      }
      return { message: 'Observación del estudiante obtenida correctamente', data: observation };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la observación del estudiante', 500);
    }
  }

  async update(id: string, dto: UpdateStudentObservationDto) {
    try {
      const observation = await this.repo.findOne({ where: { id } });
      if (!observation) {
        throw new ErrorHandler('Observación del estudiante no encontrada', 404);
      }
      this.repo.merge(observation, {
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
      });
      await this.repo.save(observation);
      return { message: 'Observación del estudiante actualizada correctamente', data: observation };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la observación del estudiante', 500);
    }
  }

  async remove(id: string) {
    try {
      const observation = await this.repo.findOne({ where: { id } });
      if (!observation) {
        throw new ErrorHandler('Observación del estudiante no encontrada', 404);
      }
      await this.repo.remove(observation);
      return { message: 'Observación del estudiante eliminada correctamente', data: observation };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la observación del estudiante', 500);
    }
  }
}
