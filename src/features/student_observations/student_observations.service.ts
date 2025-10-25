import { Injectable } from '@nestjs/common';
import { CreateStudentObservationDto } from './dto/create-student_observation.dto';
import { UpdateStudentObservationDto } from './dto/update-student_observation.dto';

@Injectable()
export class StudentObservationsService {
  create(createStudentObservationDto: CreateStudentObservationDto) {
    return 'This action adds a new studentObservation';
  }

  findAll() {
    return `This action returns all studentObservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentObservation`;
  }

  update(id: number, updateStudentObservationDto: UpdateStudentObservationDto) {
    return `This action updates a #${id} studentObservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentObservation`;
  }
}
