import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CompetencyEntity } from '@features/competencies/entities/competency.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
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
    @InjectRepository(CompetencyEntity)
    private readonly competencyRepo: Repository<CompetencyEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateAssessmentDto) {
    try {
      await this.validateCompetencyBelongsToSectionCourse(dto.sectionCourse, dto.competency);
      const assessment = this.repo.create({
        ...dto,
        period: { id: dto.period },
        sectionCourse: { id: dto.sectionCourse },
        competency: dto.competency ? { id: dto.competency } : undefined,
      });
      await this.repo.save(assessment);
      this.eventEmitter.emit('assessments.created', {
        id: assessment.id,
        name: assessment.name,
        description: assessment.description ?? null,
        sectionCourseId: dto.sectionCourse,
      });
      return { message: 'Assessment creado correctamente', data: assessment };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Ocurrió un error al crear la assessment');
    }
  }

  async findAll(filter: any) {
    try {
      const { sectionCourse, period, ...rest } = filter;
      const where: Record<string, any> = { ...rest };

      if (sectionCourse) {
        where['sectionCourse'] = { id: sectionCourse };
      }
      if (period) {
        where['period'] = { id: period };
      }

      const assessments = await this.repo.find({
        where,
        relations: ['period', 'sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'competency'],
      });
      return { data: assessments, total: assessments.length };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Ocurrió un error al obtener las assessments');
    }
  }

  async findOne(id: string) {
    try {
      const assessment = await this.repo.findOne({
        where: { id },
        relations: ['period', 'sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'competency'],
      });
      if (!assessment) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }
      return assessment;
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Ocurrió un error al obtener la assessment');
    }
  }

  async update(id: string, dto: UpdateAssessmentDto) {
    try {
      const current = await this.repo.findOne({
        where: { id },
        relations: ['sectionCourse', 'sectionCourse.course', 'competency'],
      });
      if (!current) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }

      await this.validateCompetencyBelongsToSectionCourse(
        dto.sectionCourse ?? current.sectionCourse?.id,
        dto.competency !== undefined ? dto.competency : current.competency?.id,
      );

      await this.repo.update(id, {
        ...dto,
        period: dto.period ? { id: dto.period } : undefined,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        competency: dto.competency ? { id: dto.competency } : null,
      });
      const updatedAssessment = await this.repo.findOne({
        where: { id },
        relations: ['period', 'sectionCourse', 'sectionCourse.course', 'sectionCourse.section', 'competency'],
      });
      if (!updatedAssessment) {
        throw new ErrorHandler('Assessment no encontrado', 404);
      }
      return updatedAssessment;
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Ocurrió un error al actualizar la assessment');
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
      ErrorHandler.handleUnknownError(error, 'Ocurrió un error al eliminar la assessment');
    }
  }

  private async validateCompetencyBelongsToSectionCourse(sectionCourseId?: string, competencyId?: string) {
    if (!sectionCourseId || !competencyId) return;

    const [sectionCourse, competency] = await Promise.all([
      this.sectionCourseRepo.findOne({
        where: { id: sectionCourseId },
        relations: ['course'],
      }),
      this.competencyRepo.findOne({
        where: { id: competencyId },
        relations: ['course'],
      }),
    ]);

    ErrorHandler.validateExists(sectionCourse, 'SectionCourse', sectionCourseId);
    ErrorHandler.validateExists(competency, 'Competency', competencyId);

    if (!sectionCourse.course?.id || !competency.course?.id || sectionCourse.course.id !== competency.course.id) {
      ErrorHandler.validation(
        'La competencia seleccionada no pertenece al curso de la sección asignada.',
        'AssessmentCompetencyValidation',
      );
    }
  }
}
