import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'Identificador único del permiso',
    example: 'users:read',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'Nombre descriptivo del permiso',
    example: 'Crear Usuario',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Descripción del permiso',
    example: 'Permiso para crear usuarios en el sistema',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Módulo al que pertenece el permiso',
    example: 'users',
  })
  @IsOptional()
  @IsString({ message: 'El módulo debe ser una cadena de texto' })
  module?: string;

  @ApiProperty({
    description: 'Alcance del permiso',
    example: 'shared',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === 'global' ? 'shared' : value))
  @IsIn(['system', 'shared', 'global'])
  scope?: string;
}
