import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Validate } from 'class-validator';
import { DateOrderValidator } from '../../../common/dtos/date-order-validate.dto';

export class CreatePeriodDto {
  @ApiProperty({ example: 'Primer Bimestre' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-03-02', description: 'Fecha en formato ISO 8601 (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date string' })
  startDate: string;

  @ApiProperty({ example: '2025-05-03', description: 'Fecha en formato ISO 8601 (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  @Validate(DateOrderValidator, ['startDate'], { message: 'endDate debe ser mayor que startDate' })
  endDate: string;

  @ApiProperty({ example: 'uuid-del-año-académico' })
  @IsString()
  academicYearId: string;
}
