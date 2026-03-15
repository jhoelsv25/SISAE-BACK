import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Identificador único del permiso (ej. module:read)',
    example: 'users:create',
    required: true,
  })
  @IsString({ message: 'El slug del permiso debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El slug del permiso no puede estar vacío' })
  slug: string;

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
    description: 'Descripción del permiso',
    example: 'Permiso para crear usuarios en el sistema',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Módulo al que pertenece el permiso',
    example: 'users',
    required: true,
  })
  @IsString({ message: 'El módulo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El módulo no puede estar vacío' })
  module: string;

  @ApiProperty({
    description: 'Alcance del permiso, defecto shared',
    example: 'shared',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === 'global' ? 'shared' : value))
  @IsIn(['system', 'shared', 'global'])
  scope?: string = 'shared';
}
