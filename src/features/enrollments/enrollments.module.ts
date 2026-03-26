import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentEntity } from './entities/enrollment.entity';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [TypeOrmModule.forFeature([EnrollmentEntity, SectionCourseEntity])],
})
export class EnrollmentsModule {}
