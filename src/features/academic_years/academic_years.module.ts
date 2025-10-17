import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYearsController } from './academic_years.controller';
import { AcademicYearService } from './academic_years.service';
import { AcademicYearEntity } from './entities/academic_year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicYearEntity])],
  providers: [AcademicYearService],
  controllers: [AcademicYearsController],
  exports: [AcademicYearService],
})
export class AcademicYearModule {}
