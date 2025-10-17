import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeEntity } from './entities/grade.entity';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';

@Module({
  controllers: [GradesController],
  providers: [GradesService],
  imports: [TypeOrmModule.forFeature([GradeEntity])],
})
export class GradesModule {}
