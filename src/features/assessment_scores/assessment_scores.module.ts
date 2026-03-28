import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYearGradeScaleEntity } from '@features/academic_years/entities/academic_year_grade_scale.entity';
import { AssessmentEntity } from '@features/assessments/entities/assessment.entity';
import { AssessmentScoresController } from './assessment_scores.controller';
import { AssessmentConsolidationService } from './assessment-consolidation.service';
import { AssessmentScoresService } from './assessment_scores.service';
import { AssessmentScoreEntity } from './entities/assessment_score.entity';
import { PeriodCompetencyGradeEntity } from './entities/period-competency-grade.entity';

@Module({
  controllers: [AssessmentScoresController],
  providers: [AssessmentScoresService, AssessmentConsolidationService],
  imports: [TypeOrmModule.forFeature([AssessmentScoreEntity, AssessmentEntity, AcademicYearGradeScaleEntity, PeriodCompetencyGradeEntity])],
  exports: [AssessmentScoresService, AssessmentConsolidationService],
})
export class AssessmentScoresModule {}
