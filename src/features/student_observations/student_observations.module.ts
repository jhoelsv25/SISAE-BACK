import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentObservationEntity } from './entities/student_observation.entity';
import { StudentObservationsController } from './student_observations.controller';
import { StudentObservationsService } from './student_observations.service';

@Module({
  controllers: [StudentObservationsController],
  providers: [StudentObservationsService],
  imports: [TypeOrmModule.forFeature([StudentObservationEntity])],
})
export class StudentObservationsModule {}
