import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { CreateModuleDto } from './create-module.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @ApiProperty({
    description: 'Nombre del módulo del sistema',
    example: 'Gestión de Usuarios',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del módulo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del módulo debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del módulo no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Descripción detallada del módulo y su funcionalidad',
    example: 'Módulo para administrar usuarios del sistema, roles y permisos',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Código único identificador del módulo',
    example: 'USERS',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El código del módulo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El código del módulo debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El código del módulo no puede tener más de 100 caracteres' })
  @Matches(/^[A-Z_]+$/, {
    message: 'El código debe contener solo letras mayúsculas y guiones bajos',
  })
  @Transform(({ value }) => value?.toUpperCase()?.trim())
  code?: string;

  @ApiProperty({
    description: 'Ruta de navegación del módulo en la aplicación',
    example: '/admin/users',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La ruta debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La ruta no puede tener más de 255 caracteres' })
  @Matches(/^\/[a-zA-Z0-9\/_-]*$/, {
    message: 'La ruta debe comenzar con / y contener solo caracteres válidos para URLs',
  })
  @Transform(({ value }) => value?.trim())
  path?: string;

  @ApiProperty({
    description: 'Nombre del icono para mostrar en la interfaz',
    example: 'users',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'El icono debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre del icono no puede tener más de 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  icon?: string;

  @ApiProperty({
    description: 'ID del módulo padre si es un submódulo',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del módulo padre debe ser un UUID válido' })
  parentId?: string;
}
