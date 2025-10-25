import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeacherAttendancesService } from './teacher_attendances.service';
import { CreateTeacherAttendanceDto } from './dto/create-teacher_attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher_attendance.dto';

@Controller('teacher-attendances')
export class TeacherAttendancesController {
  constructor(private readonly teacherAttendancesService: TeacherAttendancesService) {}

  @Post()
  create(@Body() createTeacherAttendanceDto: CreateTeacherAttendanceDto) {
    return this.teacherAttendancesService.create(createTeacherAttendanceDto);
  }

  @Get()
  findAll() {
    return this.teacherAttendancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherAttendancesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherAttendanceDto: UpdateTeacherAttendanceDto) {
    return this.teacherAttendancesService.update(+id, updateTeacherAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherAttendancesService.remove(+id);
  }
}
