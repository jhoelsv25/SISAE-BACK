import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicYearGradeScaleEntity } from '@features/academic_years/entities/academic_year_grade_scale.entity';
import { AssessmentEntity } from '@features/assessments/entities/assessment.entity';
import { PeriodCompetencyGradeEntity } from '@features/assessment_scores/entities/period-competency-grade.entity';
import { AssessmentScoreEntity } from '@features/assessment_scores/entities/assessment_score.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssessmentConsolidationService {
  constructor(
    @InjectRepository(AssessmentEntity)
    private readonly assessmentRepo: Repository<AssessmentEntity>,
    @InjectRepository(AssessmentScoreEntity)
    private readonly assessmentScoreRepo: Repository<AssessmentScoreEntity>,
    @InjectRepository(PeriodCompetencyGradeEntity)
    private readonly periodCompetencyGradeRepo: Repository<PeriodCompetencyGradeEntity>,
    @InjectRepository(AcademicYearGradeScaleEntity)
    private readonly gradeScaleRepo: Repository<AcademicYearGradeScaleEntity>,
  ) {}

  async syncForAssessment(assessmentId?: string) {
    if (!assessmentId) return;

    const assessment = await this.assessmentRepo.findOne({
      where: { id: assessmentId },
      relations: ['period', 'competency', 'sectionCourse', 'sectionCourse.academicYear'],
    });

    if (!assessment?.period?.id || !assessment?.sectionCourse?.id || !assessment?.competency?.id) {
      return;
    }

    const relatedAssessments = await this.assessmentRepo.find({
      where: {
        sectionCourse: { id: assessment.sectionCourse.id },
        period: { id: assessment.period.id },
        competency: { id: assessment.competency.id },
      },
      relations: ['sectionCourse', 'sectionCourse.academicYear'],
    });

    const relatedAssessmentIds = relatedAssessments.map((item) => item.id);
    if (!relatedAssessmentIds.length) return;

    const scores = await this.assessmentScoreRepo.find({
      where: relatedAssessmentIds.map((id) => ({ assessment: { id } })),
      relations: ['assessment', 'enrollment'],
    });

    const enrollmentIds = Array.from(
      new Set(scores.map((score) => score.enrollment?.id).filter((value): value is string => Boolean(value))),
    );

    if (!enrollmentIds.length) {
      await this.periodCompetencyGradeRepo.delete({
        period: { id: assessment.period.id },
        competency: { id: assessment.competency.id },
      });
      return;
    }

    const gradeScales = await this.gradeScaleRepo.find({
      where: { academicYear: { id: assessment.sectionCourse.academicYear?.id } },
      order: { orderIndex: 'ASC' },
    });
    const baseScaleMax =
      gradeScales.reduce((max, scale) => Math.max(max, Number(scale.maxScore ?? 0)), 0) || 20;

    for (const enrollmentId of enrollmentIds) {
      const enrollmentScores = scores.filter((score) => score.enrollment?.id === enrollmentId);
      const normalized = enrollmentScores.map((score) => {
        const maxScore = Number(score.assessment?.maxScore || 0);
        const rawScore = Number(score.score || 0);
        const normalizedScore = maxScore > 0 ? (rawScore / maxScore) * baseScaleMax : rawScore;
        return {
          value: normalizedScore,
          weight: Number(score.assessment?.weightPercentage || 0),
        };
      });

      const totalWeight = normalized.reduce((acc, item) => acc + Math.max(item.weight, 0), 0);
      const numericScore =
        totalWeight > 0
          ? normalized.reduce((acc, item) => acc + item.value * Math.max(item.weight, 0), 0) / totalWeight
          : normalized.reduce((acc, item) => acc + item.value, 0) / Math.max(normalized.length, 1);

      const roundedScore = Number(numericScore.toFixed(2));
      const literalScore =
        gradeScales.find(
          (scale) => roundedScore >= Number(scale.minScore) && roundedScore <= Number(scale.maxScore),
        )?.label ?? null;

      const existing = await this.periodCompetencyGradeRepo.findOne({
        where: {
          enrollment: { id: enrollmentId },
          period: { id: assessment.period.id },
          competency: { id: assessment.competency.id },
        },
      });

      const entity = existing ?? this.periodCompetencyGradeRepo.create();
      entity.enrollment = { id: enrollmentId } as any;
      entity.academicYear = { id: assessment.sectionCourse.academicYear?.id } as any;
      entity.period = { id: assessment.period.id } as any;
      entity.competency = { id: assessment.competency.id } as any;
      entity.sectionCourse = { id: assessment.sectionCourse.id } as any;
      entity.numericScore = roundedScore as any;
      entity.literalScore = literalScore;
      entity.totalWeight = Number(totalWeight.toFixed(2)) as any;
      entity.assessmentsCount = enrollmentScores.length;
      await this.periodCompetencyGradeRepo.save(entity);
    }
  }

  async findConsolidated(filter: {
    enrollment?: string;
    period?: string;
    competency?: string;
    sectionCourse?: string;
    academicYear?: string;
  }) {
    const where: Record<string, any> = {};
    if (filter.enrollment) where.enrollment = { id: filter.enrollment };
    if (filter.period) where.period = { id: filter.period };
    if (filter.competency) where.competency = { id: filter.competency };
    if (filter.sectionCourse) where.sectionCourse = { id: filter.sectionCourse };
    if (filter.academicYear) where.academicYear = { id: filter.academicYear };

    const data = await this.periodCompetencyGradeRepo.find({
      where,
      relations: [
        'enrollment',
        'enrollment.student',
        'enrollment.student.person',
        'academicYear',
        'period',
        'competency',
        'sectionCourse',
        'sectionCourse.course',
      ],
      order: {
        period: { periodNumber: 'ASC' },
        competency: { name: 'ASC' },
      },
    });

    return { data, total: data.length };
  }
}
