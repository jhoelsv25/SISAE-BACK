import { Injectable } from '@nestjs/common';
import { CreateTeacherAttendanceDto } from './dto/create-teacher_attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher_attendance.dto';

@Injectable()
export class TeacherAttendancesService {
  create(createTeacherAttendanceDto: CreateTeacherAttendanceDto) {
    return 'This action adds a new teacherAttendance';
  }

  findAll() {
    return `This action returns all teacherAttendances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacherAttendance`;
  }

  update(id: number, updateTeacherAttendanceDto: UpdateTeacherAttendanceDto) {
    return `This action updates a #${id} teacherAttendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacherAttendance`;
  }
}
