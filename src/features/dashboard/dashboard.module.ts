import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReadRepository } from '@features/users/repositories/user-read.repository';
import { AttendanceEntity } from '@features/attendances/entities/attendance.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { GradeEntity } from '@features/grades/entities/grade.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PaymentEntity } from '@features/payments/entities/payment.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StudentEntity,
      TeacherEntity,
      InstitutionEntity,
      PaymentEntity,
      AttendanceEntity,
      GradeEntity,
      EnrollmentEntity,
      SectionCourseEntity,
      GuardianEntity,
      StudentGuardianEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, UserReadRepository],
})
export class DashboardModule {}
