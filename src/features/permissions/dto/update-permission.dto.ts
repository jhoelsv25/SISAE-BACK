import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    description: 'Nombre descriptivo del permiso',
    example: 'Crear Usuario',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del permiso debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Acción que representa el permiso',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true, message: 'La acción debe ser un UUID válido' })
  actionIds: string[];

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
    description: 'ID del módulo al que pertenece el permiso',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del módulo debe ser un UUID válido' })
  moduleId: string;
}
