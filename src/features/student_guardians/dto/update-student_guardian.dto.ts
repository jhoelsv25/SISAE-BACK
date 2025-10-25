import { PartialType } from '@nestjs/swagger';
import { CreateStudentGuardianDto } from './create-student_guardian.dto';

export class UpdateStudentGuardianDto extends PartialType(CreateStudentGuardianDto) {}
