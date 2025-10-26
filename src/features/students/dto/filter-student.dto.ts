import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StudentStatus, StudentType } from '../enums/student.enum';

export class FilterStudentDto extends FilterBaseDto {
  @IsOptional()
  @IsEnum(StudentType)
  studentType?: StudentType;

  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}
