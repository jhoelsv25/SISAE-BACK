import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateStudentGuardianDto } from './dto/create-student_guardian.dto';
import { UpdateStudentGuardianDto } from './dto/update-student_guardian.dto';
import { StudentGuardiansService } from './student_guardians.service';

@Controller('student-guardians')
export class StudentGuardiansController {
  constructor(private readonly studentGuardiansService: StudentGuardiansService) {}

  @Post()
  create(@Body() dto: CreateStudentGuardianDto) {
    return this.studentGuardiansService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.studentGuardiansService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentGuardiansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentGuardianDto) {
    return this.studentGuardiansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentGuardiansService.remove(id);
  }
}
