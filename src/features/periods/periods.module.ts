import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodEntity } from './entities/period.entity';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { PeriodStatusScheduler } from './period-status.scheduler';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService, PeriodStatusScheduler],
  imports: [TypeOrmModule.forFeature([PeriodEntity])],
})
export class PeriodsModule {}
