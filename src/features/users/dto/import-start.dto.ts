import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class ImportStartDto {
  @ApiProperty({ example: 'imp-uuid-123' })
  @IsString()
  uploadId: string;

  @ApiProperty({
    example: {
      username: 'Usuario',
      email: 'Correo',
      firstName: 'Nombres',
      lastName: 'Apellidos',
      role: 'Rol',
    },
    description: 'Mapeo de campos internos hacia columnas del Excel',
  })
  @IsObject()
  columnMapping: Record<string, string>;
}
