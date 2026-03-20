import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionCourseEntity } from './entities/section-course.entity';
import { SectionCourseController } from './section-course.controller';
import { SectionCourseService } from './section-course.service';
import { VirtualClassroomEntity } from '../virtual_classrooms/entities/virtual_classroom.entity';

@Module({
  controllers: [SectionCourseController],
  providers: [SectionCourseService],
  imports: [TypeOrmModule.forFeature([SectionCourseEntity, VirtualClassroomEntity])],
})
export class SectionCourseModule {}
