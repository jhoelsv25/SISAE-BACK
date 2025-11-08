import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAssigmentSubmissionDto } from './dto/create-assigment_submission.dto';
import { UpdateAssigmentSubmissionDto } from './dto/update-assigment_submission.dto';
import { AssigmentSubmissionEntity } from './entities/assigment_submission.entity';

@Injectable()
export class AssigmentSubmissionsService {
  constructor(
    @InjectRepository(AssigmentSubmissionEntity)
    private readonly repo: Repository<AssigmentSubmissionEntity>,
  ) {}

  async create(dto: CreateAssigmentSubmissionDto) {
    try {
      // Map 'assigment' to an object with id for TypeORM relation
      const entityData = {
        ...dto,
        assigment: { id: dto.assigment },
      };
      const assigmentSubmission = this.repo.create(entityData);
      await this.repo.save(assigmentSubmission);
      return { message: 'Envío de asignación creado correctamente', data: assigmentSubmission };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el assigmentSubmission', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const assigmentSubmissions = await this.repo.find({ where: filter });
      return { message: 'Lista de envíos de asignación', data: assigmentSubmissions };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los assigmentSubmissions', 500);
    }
  }

  async findOne(id: string) {
    try {
      const assigmentSubmission = await this.repo.findOne({ where: { id } });
      if (!assigmentSubmission) {
        throw new ErrorHandler('No se encontró el assigmentSubmission', 404);
      }
      return { message: 'Detalles del envío de asignación', data: assigmentSubmission };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el assigmentSubmission', 500);
    }
  }

  async update(id: string, dto: UpdateAssigmentSubmissionDto) {
    try {
      const assigmentSubmission = await this.repo.findOne({ where: { id } });
      if (!assigmentSubmission) {
        throw new ErrorHandler('No se encontró el assigmentSubmission', 404);
      }
      this.repo.merge(assigmentSubmission, {
        ...dto,
        assigment: dto.assigment ? { id: dto.assigment } : undefined,
      });
      await this.repo.save(assigmentSubmission);
      return {
        message: 'Envío de asignación actualizado correctamente',
        data: assigmentSubmission,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el assigmentSubmission', 500);
    }
  }

  async remove(id: string) {
    try {
      const assigmentSubmission = await this.repo.findOne({ where: { id } });
      if (!assigmentSubmission) {
        throw new ErrorHandler('No se encontró el assigmentSubmission', 404);
      }
      await this.repo.remove(assigmentSubmission);
      return { message: 'Envío de asignación eliminado correctamente', data: assigmentSubmission };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el assigmentSubmission', 500);
    }
  }
}
