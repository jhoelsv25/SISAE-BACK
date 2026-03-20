import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';
import { VirtualClassroomsController } from './virtual_classrooms.controller';
import { VirtualClassroomsService } from './virtual_classrooms.service';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';

@Module({
  controllers: [VirtualClassroomsController],
  providers: [VirtualClassroomsService],
  imports: [TypeOrmModule.forFeature([VirtualClassroomEntity, SectionCourseEntity])],
})
export class VirtualClassroomsModule {}
