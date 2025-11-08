import { FilterBaseDto } from '@common/dtos/filter-base.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ContractType, EmployementStatus, LaborRegime, WorkloadType } from '../enums/teacher.enum';

export class FilterTeacherDto extends FilterBaseDto {
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsEnum(LaborRegime)
  laborRegime?: LaborRegime;

  @IsOptional()
  @IsEnum(WorkloadType)
  workloadType?: WorkloadType;

  @IsOptional()
  @IsEnum(EmployementStatus)
  employmentStatus?: EmployementStatus;
}
