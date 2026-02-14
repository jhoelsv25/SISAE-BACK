import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export const PAGINATION_MODE = {
  OFFSET: 'offset',
  CURSOR: 'cursor',
} as const;
export type PaginationMode = (typeof PAGINATION_MODE)[keyof typeof PAGINATION_MODE];

export class FilterModuleDto {
  @ApiProperty({ required: false, description: 'Nombre del módulo para filtrar' })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({ required: false, description: 'Modo de paginación: offset (páginas) o cursor (ideal para muchos datos)', enum: Object.values(PAGINATION_MODE), default: 'offset' })
  @IsOptional()
  @IsIn(Object.values(PAGINATION_MODE))
  readonly mode?: PaginationMode = 'offset';

  @ApiProperty({ required: false, description: 'Página (solo modo offset)', default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  @IsNumber()
  readonly page?: number = 1;

  @ApiProperty({ required: false, description: 'Tamaño de página (offset) o cantidad por página (cursor)', default: 20 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 20))
  @IsNumber()
  readonly size?: number = 20;

  @ApiProperty({ required: false, description: 'Cursor para siguiente página (solo modo cursor). ID del último ítem recibido.' })
  @IsOptional()
  @IsString()
  readonly cursor?: string;
}
