import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentGuardiansService } from './student_guardians.service';
import { CreateStudentGuardianDto } from './dto/create-student_guardian.dto';
import { UpdateStudentGuardianDto } from './dto/update-student_guardian.dto';

@Controller('student-guardians')
export class StudentGuardiansController {
  constructor(private readonly studentGuardiansService: StudentGuardiansService) {}

  @Post()
  create(@Body() createStudentGuardianDto: CreateStudentGuardianDto) {
    return this.studentGuardiansService.create(createStudentGuardianDto);
  }

  @Get()
  findAll() {
    return this.studentGuardiansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentGuardiansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentGuardianDto: UpdateStudentGuardianDto) {
    return this.studentGuardiansService.update(+id, updateStudentGuardianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentGuardiansService.remove(+id);
  }
}
