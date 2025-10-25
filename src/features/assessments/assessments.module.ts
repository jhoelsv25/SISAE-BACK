import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { AssessmentEntity } from './entities/assessment.entity';

@Module({
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  imports: [TypeOrmModule.forFeature([AssessmentEntity])],
})
export class AssessmentsModule {}
