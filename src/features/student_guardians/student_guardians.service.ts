import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateStudentGuardianDto } from './dto/create-student_guardian.dto';
import { UpdateStudentGuardianDto } from './dto/update-student_guardian.dto';
import { StudentGuardianEntity } from './entities/student_guardian.entity';

@Injectable()
export class StudentGuardiansService {
  constructor(
    @InjectRepository(StudentGuardianEntity)
    private readonly repo: Repository<StudentGuardianEntity>,
  ) {}

  async create(createStudentGuardianDto: CreateStudentGuardianDto) {
    try {
      const { student, guardian, ...rest } = createStudentGuardianDto;
      const studentGuardian = this.repo.create({
        ...rest,
        student: { id: student }, // assuming 'student' is an ID string
        guardian: { id: guardian }, // assuming 'guardian' is an ID string
      });
      const data = await this.repo.save(studentGuardian);
      return { message: 'Tutor del estudiante creado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el tutor del estudiante', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const data = await this.repo.find({ where: filter });
      return { message: 'Lista de tutores de estudiantes obtenida correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la lista de tutores de estudiantes', 500);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id } });
      if (!data) {
        throw new ErrorHandler('Tutor del estudiante no encontrado', 404);
      }
      return { message: 'Tutor del estudiante obtenido correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el tutor del estudiante', 500);
    }
  }

  async update(id: string, dto: UpdateStudentGuardianDto) {
    try {
      const { student, guardian, ...rest } = dto;
      const entityLike: any = { ...rest };
      if (student) {
        entityLike.student = { id: student };
      }
      if (guardian) {
        entityLike.guardian = { id: guardian };
      }
      await this.repo.update(id, entityLike);
      return { message: 'Tutor del estudiante actualizado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el tutor del estudiante', 500);
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
      return { message: 'Tutor del estudiante eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el tutor del estudiante', 500);
    }
  }
}
