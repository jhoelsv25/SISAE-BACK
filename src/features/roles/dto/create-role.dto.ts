import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre único del rol',
    example: 'Administrador',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del rol debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del rol no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del rol y sus responsabilidades',
    example: 'Rol con acceso completo al sistema para administrar usuarios y configuraciones',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Lista de IDs de permisos asignados al rol',
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479', 'e47ac10b-58cc-4372-a567-0e02b2c3d480'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Los permisos deben ser una lista' })
  @IsUUID(4, { each: true, message: 'Cada permiso debe ser un UUID válido' })
  permissionIds?: string[];
}
