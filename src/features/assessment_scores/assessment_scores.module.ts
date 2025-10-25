import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentScoresController } from './assessment_scores.controller';
import { AssessmentScoresService } from './assessment_scores.service';
import { AssessmentScoreEntity } from './entities/assessment_score.entity';

@Module({
  controllers: [AssessmentScoresController],
  providers: [AssessmentScoresService],
  imports: [TypeOrmModule.forFeature([AssessmentScoreEntity])],
})
export class AssessmentScoresModule {}
