import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciesController } from './competencies.controller';
import { CompetenciesService } from './competencies.service';
import { CompetencyEntity } from './entities/competency.entity';

@Module({
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
  imports: [TypeOrmModule.forFeature([CompetencyEntity])],
})
export class CompetenciesModule {}
