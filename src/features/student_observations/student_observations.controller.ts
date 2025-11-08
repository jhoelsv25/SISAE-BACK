import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateStudentObservationDto } from './dto/create-student_observation.dto';
import { UpdateStudentObservationDto } from './dto/update-student_observation.dto';
import { StudentObservationsService } from './student_observations.service';

@Controller('student-observations')
export class StudentObservationsController {
  constructor(private readonly studentObservationsService: StudentObservationsService) {}

  @Post()
  create(@Body() dto: CreateStudentObservationDto) {
    return this.studentObservationsService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.studentObservationsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentObservationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentObservationDto) {
    return this.studentObservationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentObservationsService.remove(id);
  }
}
