import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { CompetencyEntity } from './entities/competency.entity';

@Injectable()
export class CompetenciesService {
  constructor(
    @InjectRepository(CompetencyEntity)
    private readonly repo: Repository<CompetencyEntity>,
  ) {}

  async create(dto: CreateCompetencyDto) {
    try {
      const competency = this.repo.create({
        ...dto,
        course: dto.course ? { id: dto.course } : undefined,
      });
      await this.repo.save(competency);
      return { message: 'Competencia creada correctamente', data: competency };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la competencia', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const competencies = await this.repo.find({
        where: {
          ...filter,
        },
      });
      return { message: 'Competencias encontradas correctamente', data: competencies };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las competencias', 500);
    }
  }

  async findOne(id: string) {
    try {
      const competency = await this.repo.findOne({ where: { id } });
      if (!competency) {
        throw new ErrorHandler('Competencia no encontrada', 404);
      }
      return { message: 'Competencia encontrada correctamente', data: competency };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la competencia', 500);
    }
  }

  async update(id: string, dto: UpdateCompetencyDto) {
    try {
      const updatedCompetency = await this.repo.findOne({ where: { id } });
      if (!updatedCompetency) {
        throw new ErrorHandler('Competencia no encontrada', 404);
      }
      await this.repo.merge(updatedCompetency, {
        ...dto,
        course: dto.course ? { id: dto.course } : undefined,
      });
      await this.repo.save(updatedCompetency);
      return { message: 'Competencia actualizada correctamente', data: updatedCompetency };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la competencia', 500);
    }
  }

  async remove(id: string) {
    try {
      const competency = await this.repo.findOne({ where: { id } });
      if (!competency) {
        throw new ErrorHandler('Competencia no encontrada', 404);
      }
      await this.repo.remove(competency);
      return { message: 'Competencia eliminada correctamente', data: competency };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la competencia', 500);
    }
  }
}
