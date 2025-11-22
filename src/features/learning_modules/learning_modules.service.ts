import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateLearningModuleDto } from './dto/create-learning_module.dto';
import { UpdateLearningModuleDto } from './dto/update-learning_module.dto';
import { LearningModuleEntity } from './entities/learning_module.entity';

@Injectable()
export class LearningModulesService {
  constructor(
    @InjectRepository(LearningModuleEntity)
    private readonly repo: Repository<LearningModuleEntity>,
  ) {}
  async create(dto: CreateLearningModuleDto) {
    try {
      const learningModule = this.repo.create({
        ...dto,
        sectionCourse: { id: dto.sectionCourseId },
      });
      const data = await this.repo.save(learningModule);
      return { message: 'Módulo de aprendizaje creado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el módulo de aprendizaje', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const data = await this.repo.find({ where: { ...filter } });
      return { message: 'Módulos de aprendizaje recuperados correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al recuperar los módulos de aprendizaje', 500);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id } });
      if (!data) throw new ErrorHandler('Módulo de aprendizaje no encontrado', 404);
      return { message: 'Módulo de aprendizaje recuperado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al recuperar el módulo de aprendizaje', 500);
    }
  }

  async update(id: string, dto: UpdateLearningModuleDto) {
    try {
      const learningModule = await this.repo.findOne({ where: { id } });
      if (!learningModule) throw new ErrorHandler('Módulo de aprendizaje no encontrado', 404);
      this.repo.merge(learningModule, dto);
      const data = await this.repo.save(learningModule);
      return { message: 'Módulo de aprendizaje actualizado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el módulo de aprendizaje', 500);
    }
  }

  async remove(id: string) {
    try {
      const learningModule = await this.repo.findOne({ where: { id } });
      if (!learningModule) throw new ErrorHandler('Módulo de aprendizaje no encontrado', 404);
      await this.repo.remove(learningModule);
      return { message: 'Módulo de aprendizaje eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el módulo de aprendizaje', 500);
    }
  }
}
