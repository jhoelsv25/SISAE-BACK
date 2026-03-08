import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

/** Mapeo: campo nuestro -> columna del Excel (header) */
export class ImportStartDto {
  @ApiProperty({ example: 'imp-uuid-123' })
  @IsString()
  uploadId: string;

  @ApiProperty({
    example: { name: 'Nombre', email: 'Email', age: 'Edad', grade: 'Grado' },
    description: 'Mapeo de campos a columnas del Excel',
  })
  @IsObject()
  columnMapping: Record<string, string>;
}
