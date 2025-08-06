import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'Nombre descriptivo del permiso',
    example: 'Crear Usuario',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del permiso debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del permiso no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Código único del permiso en formato MODULE.ACTION',
    example: 'USERS.CREATE',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El código del permiso debe ser una cadena de texto' })
  @MinLength(3, { message: 'El código del permiso debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El código del permiso no puede tener más de 100 caracteres' })
  @Matches(/^[A-Z_]+\.[A-Z_]+$/, {
    message: 'El código debe seguir el formato MODULO.ACCION (ej: USERS.CREATE)',
  })
  @Transform(({ value }) => value?.toUpperCase()?.trim())
  code?: string;

  @ApiProperty({
    description: 'ID del módulo al que pertenece el permiso',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del módulo debe ser un UUID válido' })
  moduleId?: string;

  @ApiProperty({
    description: 'ID de la acción que define el permiso',
    example: 'e47ac10b-58cc-4372-a567-0e02b2c3d480',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID de la acción debe ser un UUID válido' })
  actionId?: string;
}
