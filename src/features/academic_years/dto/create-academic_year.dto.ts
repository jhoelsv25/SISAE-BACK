import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateAcademicYearDto {
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
  endDate: Date;

  @ApiProperty({ example: true, description: 'Indica si este año académico está activo' })
  @IsBoolean()
  isActive: boolean;
}
