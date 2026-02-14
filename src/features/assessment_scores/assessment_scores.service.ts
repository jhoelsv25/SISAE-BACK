import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAssessmentScoreDto } from './dto/create-assessment_score.dto';
import { UpdateAssessmentScoreDto } from './dto/update-assessment_score.dto';
import { AssessmentScoreEntity } from './entities/assessment_score.entity';

@Injectable()
export class AssessmentScoresService {
  constructor(
    @InjectRepository(AssessmentScoreEntity)
    private readonly repo: Repository<AssessmentScoreEntity>,
  ) {}
  async create(dto: CreateAssessmentScoreDto) {
    try {
      const assessmentScore = this.repo.create({
        ...dto,
        enrollment: dto.enrollment ? { id: dto.enrollment } : undefined,
        assessment: dto.assessment ? { id: dto.assessment } : undefined,
      });
      await this.repo.save(assessmentScore);
      return { message: 'Assessment score creado correctamente', data: assessmentScore };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el assessment score', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const assessmentScores = await this.repo.find({ where: filter });
      return { message: 'Lista de assessment scores', data: assessmentScores };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la lista de assessment scores', 500);
    }
  }

  async findOne(id: string) {
    try {
      const assessmentScore = await this.repo.findOne({ where: { id } });
      if (!assessmentScore) {
        throw new ErrorHandler('Assessment score no encontrado', 404);
      }
      return { message: 'Detalle del assessment score', data: assessmentScore };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el assessment score', 500);
    }
  }

  async update(id: string, dto: UpdateAssessmentScoreDto) {
    try {
      const assessmentScore = await this.repo.findOne({ where: { id } });
      if (!assessmentScore) {
        throw new ErrorHandler('Assessment score no encontrado', 404);
      }
      this.repo.merge(assessmentScore, {
        ...dto,
        enrollment: dto.enrollment ? { id: dto.enrollment } : undefined,
        assessment: dto.assessment ? { id: dto.assessment } : undefined,
      });
      await this.repo.save(assessmentScore);
      return { message: 'Assessment score actualizado correctamente', data: assessmentScore };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el assessment score', 500);
    }
  }

  async remove(id: string) {
    try {
      const assessmentScore = await this.repo.findOne({ where: { id } });
      if (!assessmentScore) {
        throw new ErrorHandler('Assessment score no encontrado', 404);
      }
      await this.repo.remove(assessmentScore);
      return { message: 'Assessment score eliminado correctamente', data: assessmentScore };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el assessment score', 500);
    }
  }

  async registerBulk(data: any) {
    try {
      const result = await this.repo.query('SELECT register_bulk_assessment_scores($1) as result', [JSON.stringify(data)]);
      return result[0].result;
    } catch (error) {
      throw new ErrorHandler('Error al registrar notas masivas: ' + error.message, 500);
    }
  }
}
