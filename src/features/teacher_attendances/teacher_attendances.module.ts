import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAttendanceEntity } from './entities/teacher_attendance.entity';
import { TeacherAttendancesController } from './teacher_attendances.controller';
import { TeacherAttendancesService } from './teacher_attendances.service';
import { DeviceAttendanceLogEntity } from '../attendance_device/infrastructure/persistence/entities/attendance-log.entity';
import { AttendanceDeviceModule } from '../attendance_device/attendance-device.module';

@Module({
  controllers: [TeacherAttendancesController],
  providers: [TeacherAttendancesService],
  imports: [TypeOrmModule.forFeature([TeacherAttendanceEntity, DeviceAttendanceLogEntity]), AttendanceDeviceModule],
})
export class TeacherAttendancesModule {}
