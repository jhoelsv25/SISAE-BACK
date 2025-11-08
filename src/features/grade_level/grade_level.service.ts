import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateGradeLevelDto } from './dto/create-grade_leevel.dto';
import { UpdateGradeLevelDto } from './dto/update-grade_leevel.dto';
import { GradeLevelEntity } from './entities/grade_leevel.entity';

@Injectable()
export class GradeLevelService {
  constructor(
    @InjectRepository(GradeLevelEntity)
    private readonly repo: Repository<GradeLevelEntity>,
  ) {}

  async create(dto: CreateGradeLevelDto) {
    try {
      // Convert institution string to object if necessary
      const entityData = {
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
      };
      const gradeLevel = this.repo.create(entityData);
      await this.repo.save(gradeLevel);
      return { message: 'Nivel de grado creado correctamente', data: gradeLevel };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el nivel de grado', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const gradeLevels = await this.repo.find({ where: filter });
      return gradeLevels;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los niveles de grado', 500);
    }
  }

  async findOne(id: string) {
    try {
      const gradeLevel = await this.repo.findOne({ where: { id } });
      if (!gradeLevel) {
        throw new ErrorHandler('Nivel de grado no encontrado', 404);
      }
      return { message: 'Nivel de grado encontrado', data: gradeLevel };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el nivel de grado', 500);
    }
  }

  async update(id: string, dto: UpdateGradeLevelDto) {
    try {
      const gradeLevel = await this.repo.findOne({ where: { id } });
      if (!gradeLevel) {
        throw new ErrorHandler('Nivel de grado no encontrado', 404);
      }
      const entityData = {
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
      };
      const updatedGradeLevel = this.repo.merge(gradeLevel, entityData);
      await this.repo.save(updatedGradeLevel);
      return { message: 'Nivel de grado actualizado correctamente', data: updatedGradeLevel };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el nivel de grado', 500);
    }
  }

  async remove(id: string) {
    try {
      const gradeLevel = await this.repo.findOne({ where: { id } });
      if (!gradeLevel) {
        throw new ErrorHandler('Nivel de grado no encontrado', 404);
      }
      await this.repo.remove(gradeLevel);
      return { message: 'Nivel de grado eliminado correctamente', data: gradeLevel };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el nivel de grado', 500);
    }
  }
}
