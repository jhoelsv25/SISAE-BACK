import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetencyEntity } from '@features/competencies/entities/competency.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { AssessmentEntity } from './entities/assessment.entity';

@Module({
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  imports: [TypeOrmModule.forFeature([AssessmentEntity, CompetencyEntity, SectionCourseEntity])],
})
export class AssessmentsModule {}
