import { PartialType } from '@nestjs/swagger';
import { CreateTeacherAttendanceDto } from './create-teacher_attendance.dto';

export class UpdateTeacherAttendanceDto extends PartialType(CreateTeacherAttendanceDto) {}
