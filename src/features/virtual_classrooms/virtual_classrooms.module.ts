import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { UserEntity } from '../users/entities/user.entity';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';
import { VirtualClassroomsController } from './virtual_classrooms.controller';
import { VirtualClassroomsService } from './virtual_classrooms.service';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';

@Module({
  controllers: [VirtualClassroomsController],
  providers: [VirtualClassroomsService],
  imports: [
    TypeOrmModule.forFeature([
      VirtualClassroomEntity,
      SectionCourseEntity,
      UserEntity,
      StudentEntity,
      GuardianEntity,
      StudentGuardianEntity,
      EnrollmentEntity,
    ]),
  ],
})
export class VirtualClassroomsModule {}
