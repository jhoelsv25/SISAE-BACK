import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterPermissionDto {
  @ApiProperty({ required: false, description: 'Nombre del permiso para filtrar' })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({
    required: false,
    description: 'Fecha de creación desde',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  readonly createdAtFrom?: string;

  @ApiProperty({
    required: false,
    description: 'Fecha de creación hasta',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  readonly createdAtTo?: string;

  @ApiProperty({ required: false, description: 'Página para paginación', default: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  readonly page?: number = 1;

  @ApiProperty({ required: false, description: 'Tamaño de página para paginación', default: 20 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 20))
  readonly size?: number = 20;
}
