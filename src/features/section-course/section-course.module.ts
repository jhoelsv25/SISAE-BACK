import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionCourseEntity } from './entities/section-course.entity';
import { SectionCourseController } from './section-course.controller';
import { SectionCourseService } from './section-course.service';

@Module({
  controllers: [SectionCourseController],
  providers: [SectionCourseService],
  imports: [TypeOrmModule.forFeature([SectionCourseEntity])],
})
export class SectionCourseModule {}
