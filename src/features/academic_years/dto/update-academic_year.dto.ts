import { PartialType } from '@nestjs/swagger';
import { CreateAcademicYearDto } from './create-academic_year.dto';

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {}
