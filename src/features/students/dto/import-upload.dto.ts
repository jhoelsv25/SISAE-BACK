import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

/** Mapeo: campo interno -> encabezado de columna del Excel */
export class ColumnMappingDto {
  @ApiProperty({ example: 'Nombre', description: 'Columna para nombre' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Email', description: 'Columna para email' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'Edad', required: false })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiProperty({ example: 'Grado', required: false })
  @IsOptional()
  @IsString()
  grade?: string;
}

export class StartImportDto {
  @ApiProperty({ description: 'ID del upload (devuelto por /upload)' })
  @IsString()
  uploadId: string;

  @ApiProperty({ type: ColumnMappingDto })
  @IsObject()
  columnMapping: ColumnMappingDto;
}
