import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAttendanceEntity } from './entities/teacher_attendance.entity';
import { TeacherAttendancesController } from './teacher_attendances.controller';
import { TeacherAttendancesService } from './teacher_attendances.service';

@Module({
  controllers: [TeacherAttendancesController],
  providers: [TeacherAttendancesService],
  imports: [TypeOrmModule.forFeature([TeacherAttendanceEntity])],
})
export class TeacherAttendancesModule {}
