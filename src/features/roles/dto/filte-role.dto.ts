import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterRoleDto {
  @ApiProperty({ required: false, description: 'Nombre del rol para filtrar' })
  @IsOptional()
  readonly search: string;

  @ApiProperty({ required: false, description: 'Página para paginación', default: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  readonly page?: number = 1;

  @ApiProperty({ required: false, description: 'Tamaño de página para paginación', default: 20 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  readonly size?: number = 20;
}
