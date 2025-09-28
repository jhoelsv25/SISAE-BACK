import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterModuleDto {
  @ApiProperty({ required: false, description: 'Nombre del módulo para filtrar' })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({ required: false, description: 'Página para paginación', default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsNumber()
  readonly page?: number = 1;

  @ApiProperty({ required: false, description: 'Tamaño de página para paginación', default: 20 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 20))
  @IsNumber()
  readonly size?: number = 20;
}
