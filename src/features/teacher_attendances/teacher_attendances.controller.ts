import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTeacherAttendanceDto } from './dto/create-teacher_attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher_attendance.dto';
import { TeacherAttendancesService } from './teacher_attendances.service';

@Controller('teacher-attendances')
export class TeacherAttendancesController {
  constructor(private readonly teacherAttendancesService: TeacherAttendancesService) {}

  @Post()
  create(@Body() dto: CreateTeacherAttendanceDto) {
    return this.teacherAttendancesService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.teacherAttendancesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherAttendancesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherAttendanceDto) {
    return this.teacherAttendancesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherAttendancesService.remove(id);
  }
}
