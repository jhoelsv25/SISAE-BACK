import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { DateOrderValidator } from '../../../common/dtos/date-order-validate.dto';

export class CreatePeriodDto {
  @ApiProperty({ example: 'Primer Bimestre', description: 'Nombre del periodo' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-03-02', description: 'Fecha de inicio del periodo' })
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-05-03', description: 'Fecha de fin del periodo' })
  @IsDateString()
  @Type(() => Date)
  @Validate(DateOrderValidator, ['startDate'], {
    message: 'endDate debe ser mayor que startDate',
  })
  endDate: Date;
}

export class CreateAcademicYearWithPeriodsDto {
  @ApiProperty({ example: 2025, description: 'Año académico' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({ example: '2025-03-02', description: 'Fecha de inicio del año académico' })
  @IsDateString()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-12-20', description: 'Fecha de fin del año académico' })
  @IsDateString()
  @Type(() => Date)
  @Validate(DateOrderValidator, ['startDate'], {
    message: 'endDate debe ser mayor que startDate',
  })
  endDate: Date;

  @ApiProperty({ example: true, description: 'Indica si este año académico está activo' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: [CreatePeriodDto], description: 'Periodos asociados al año académico' })
  @ValidateNested({ each: true })
  @Type(() => CreatePeriodDto)
  @ArrayMinSize(1)
  periods: CreatePeriodDto[];

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID de la institución asociada',
    type: 'string',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El ID de la institución debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la institución debe ser un UUID válido.' })
  institution?: string;
}
