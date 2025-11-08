import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';
import { AssigmentEntity } from './entities/assigment.entity';

@Injectable()
export class AssigmentsService {
  constructor(
    @InjectRepository(AssigmentEntity)
    private readonly repo: Repository<AssigmentEntity>,
  ) {}

  async create(dto: CreateAssigmentDto) {
    try {
      const assigment = this.repo.create({
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
        module: dto.module ? { id: dto.module } : undefined,
      });
      await this.repo.save(assigment);
      return { message: 'Asignación creada correctamente', data: assigment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el assigment', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const assigments = await this.repo.find({ where: filter });
      return { message: 'Asignaciones obtenidas correctamente', data: assigments };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las asignaciones', 500);
    }
  }

  async findOne(id: string) {
    try {
      const assigment = await this.repo.findOne({ where: { id } });
      if (!assigment) {
        throw new ErrorHandler('Asignación no encontrada', 404);
      }
      return { message: 'Asignación obtenida correctamente', data: assigment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la asignación', 500);
    }
  }

  async update(id: string, dto: UpdateAssigmentDto) {
    try {
      const assigment = await this.repo.findOne({ where: { id } });
      if (!assigment) {
        throw new ErrorHandler('Asignación no encontrada', 404);
      }
      this.repo.merge(assigment, {
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
        module: dto.module ? { id: dto.module } : undefined,
      });
      await this.repo.save(assigment);
      return { message: 'Asignación actualizada correctamente', data: assigment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la asignación', 500);
    }
  }

  async remove(id: string) {
    try {
      const assigment = await this.repo.findOne({ where: { id } });
      if (!assigment) {
        throw new ErrorHandler('Asignación no encontrada', 404);
      }
      await this.repo.remove(assigment);
      return { message: 'Asignación eliminada correctamente', data: assigment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la asignación', 500);
    }
  }
}
