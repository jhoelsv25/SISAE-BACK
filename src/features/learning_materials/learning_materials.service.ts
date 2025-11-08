import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateLearningMaterialDto } from './dto/create-learning_material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning_material.dto';
import { LearningMaterialEntity } from './entities/learning_material.entity';

@Injectable()
export class LearningMaterialsService {
  constructor(
    @InjectRepository(LearningMaterialEntity)
    private readonly repo: Repository<LearningMaterialEntity>,
  ) {}

  async create(dto: CreateLearningMaterialDto) {
    try {
      const { sectionCourse, module, teacher, ...restDto } = dto;
      const learningMaterial = this.repo.create({
        ...restDto,
        sectionCourse: sectionCourse ? { id: sectionCourse } : undefined,
        module: module ? { id: module } : undefined,
        teacher: teacher ? { id: teacher } : undefined,
      });
      const data = await this.repo.save(learningMaterial);
      return { message: 'Material de aprendizaje creado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el material de aprendizaje', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const data = await this.repo.find({ where: { ...filter } });
      return { message: 'Lista de materiales de aprendizaje', data };
    } catch (error) {
      throw new ErrorHandler(
        'Ocurrió un error al obtener la lista de materiales de aprendizaje',
        500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id } });
      if (!data) {
        throw new ErrorHandler('Material de aprendizaje no encontrado', 404);
      }
      return { message: 'Material de aprendizaje encontrado', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el material de aprendizaje', 500);
    }
  }

  async update(id: string, dto: UpdateLearningMaterialDto) {
    try {
      const learningMaterial = await this.repo.findOne({ where: { id } });
      if (!learningMaterial) {
        throw new ErrorHandler('Material de aprendizaje no encontrado', 404);
      }
      const { sectionCourse, module, ...restDto } = dto;
      this.repo.merge(learningMaterial, {
        ...restDto,
        sectionCourse: sectionCourse ? { id: sectionCourse } : undefined,
        module: module ? { id: module } : undefined,
        teacher: restDto.teacher ? { id: restDto.teacher } : undefined,
      });
      const data = await this.repo.save(learningMaterial);
      return { message: 'Material de aprendizaje actualizado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el material de aprendizaje', 500);
    }
  }

  async remove(id: string) {
    try {
      const learningMaterial = await this.repo.findOne({ where: { id } });
      if (!learningMaterial) {
        throw new ErrorHandler('Material de aprendizaje no encontrado', 404);
      }
      await this.repo.remove(learningMaterial);
      return { message: 'Material de aprendizaje eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el material de aprendizaje', 500);
    }
  }
}
