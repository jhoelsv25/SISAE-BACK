import { PartialType } from '@nestjs/swagger';
import { CreateStudentObservationDto } from './create-student_observation.dto';

export class UpdateStudentObservationDto extends PartialType(CreateStudentObservationDto) {}
