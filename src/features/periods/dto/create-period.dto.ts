import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsString, Validate } from 'class-validator';
import { DateOrderValidator } from '../../../common/dtos/date-order-validate.dto';

export class CreatePeriodDto {
  @ApiProperty({ example: 'Primer Bimestre' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-03-02' })
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-05-03' })
  @IsDateString()
  @Type(() => Date)
  @Validate(DateOrderValidator, ['startDate'], { message: 'endDate debe ser mayor que startDate' })
  endDate: Date;

  @ApiProperty({ example: 'uuid-del-año-académico' })
  @IsString()
  academicYearId: string;
}
