import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateModuleDto {
  //
  @IsOptional() // Permitir que sea opcional para creación y actualización
  id?: string | null;

  @ApiProperty({
    description: 'Nombre del módulo del sistema',
    example: 'Gestión de Usuarios',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del módulo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del módulo debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del módulo no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

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
  })
  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número' })
  order: number;

  @ApiProperty({
    description: 'Ruta de navegación del módulo en la aplicación',
    example: '/admin/users',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La ruta debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La ruta no puede tener más de 255 caracteres' })
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

  @IsOptional()
  @IsString({ message: 'La visibilidad debe ser una cadena de texto' })
  @IsIn(['private', 'public'], { message: 'La visibilidad debe ser private o public' })
  visibility: 'private' | 'public';

  @ApiProperty({
    description: 'ID del módulo padre si es un submódulo',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @ApiProperty({ required: false, type: [CreateModuleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  children?: CreateModuleDto[];

  @ApiProperty({
    description: 'Clave única del módulo (ej: users, dashboard)',
    example: 'users',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El key del módulo debe ser una cadena de texto' })
  @MinLength(2, { message: 'El key del módulo debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El key del módulo no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  key: string;

  @ApiProperty({
    description: 'Indica si es un módulo del sistema (protección especial)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsIn([true, false], { message: 'isSystem debe ser true o false' })
  isSystem?: boolean; // Indica si es un módulo del sistema (protección especial)

  @ApiProperty({
    description: 'Indica si es un módulo del sistema (protección especial)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsIn([true, false], { message: 'isActive debe ser true o false' })
  isActive?: boolean; // Indica si es un módulo activo
}
