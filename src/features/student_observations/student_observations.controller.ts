import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentObservationsService } from './student_observations.service';
import { CreateStudentObservationDto } from './dto/create-student_observation.dto';
import { UpdateStudentObservationDto } from './dto/update-student_observation.dto';

@Controller('student-observations')
export class StudentObservationsController {
  constructor(private readonly studentObservationsService: StudentObservationsService) {}

  @Post()
  create(@Body() createStudentObservationDto: CreateStudentObservationDto) {
    return this.studentObservationsService.create(createStudentObservationDto);
  }

  @Get()
  findAll() {
    return this.studentObservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentObservationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentObservationDto: UpdateStudentObservationDto) {
    return this.studentObservationsService.update(+id, updateStudentObservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentObservationsService.remove(+id);
  }
}
