import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Nombre descriptivo del permiso',
    example: 'Crear Usuario',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del permiso debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del permiso no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Acción que representa el permiso',
    example: 'create',
    enum: ['create', 'read', 'update', 'delete'],
  })
  @IsString({ message: 'La acción del permiso debe ser una cadena de texto' })
  @MinLength(2, { message: 'La acción del permiso debe tener al menos 2 caracteres' })
  @MaxLength(10, { message: 'La acción del permiso no puede tener más de 10 caracteres' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  action: 'create' | 'read' | 'update' | 'delete';

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permiso para crear usuarios en el sistema',
    required: false,
    maxLength: 255,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'ID del módulo al que pertenece el permiso',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID(4, { message: 'El ID del módulo debe ser un UUID válido' })
  moduleId: string;
}
