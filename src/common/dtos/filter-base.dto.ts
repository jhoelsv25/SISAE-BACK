import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterBaseDto {
  @ApiProperty({ required: false, description: 'Término de búsqueda para filtrar resultados' })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, description: 'Número de página para paginación' })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, description: 'Número de resultados por página' })
  @IsOptional()
  @Type(() => Number)
  size?: number;

  @ApiProperty({ required: false, description: 'Campo por el cual se ordenan los resultados' })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ required: false, description: 'Orden de clasificación (ASC o DESC)' })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
