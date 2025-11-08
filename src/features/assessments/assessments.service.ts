import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentEntity } from './entities/assessment.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(AssessmentEntity)
    private readonly repo: Repository<AssessmentEntity>,
  ) {}

  async create(dto: CreateAssessmentDto) {
    try {
      // Convert 'period' and 'sectionCourse' to objects with id, assuming dto.period and dto.sectionCourse are their respective ids
      const assessment = this.repo.create({
        ...dto,
        period: { id: dto.period }, // Adjust if dto.period is not the id
        sectionCourse: { id: dto.sectionCourse }, // Adjust if dto.sectionCourse is not the id
      });
      await this.repo.save(assessment);
      return { message: 'Assessment creado correctamente', data: assessment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la assessment', 500);
    }
  }

  async findAll(filter: any) {
    try {
      return await this.repo.find({ where: filter });
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las assessments', 500);
    }
  }

  async findOne(id: string) {
    try {
      const assessment = await this.repo.findOne({ where: { id } });
      if (!assessment) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }
      return assessment;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la assessment', 500);
    }
  }

  async update(id: string, dto: UpdateAssessmentDto) {
    try {
      await this.repo.update(id, {
        ...dto,
        period: dto.period ? { id: dto.period } : undefined,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
      });
      const updatedAssessment = await this.repo.findOne({ where: { id } });
      if (!updatedAssessment) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }
      return updatedAssessment;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la assessment', 500);
    }
  }

  async remove(id: string) {
    try {
      const assessment = await this.repo.findOne({ where: { id } });
      if (!assessment) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }
      await this.repo.remove(assessment);
      return { message: 'Assessment eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la assessment', 500);
    }
  }
}
