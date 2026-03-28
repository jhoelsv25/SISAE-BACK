import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentScoresModule } from '../assessment_scores/assessment_scores.module';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { ReportEntity } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsProcessor } from './reports.processor';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    AssessmentScoresModule,
    BullModule.registerQueue({ name: QUEUE.REPORTS }),
    TypeOrmModule.forFeature([ReportEntity]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsProcessor],
})
export class ReportsModule {}
