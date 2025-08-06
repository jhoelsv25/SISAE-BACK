import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateActionDto } from './create-action.dto';

export class UpdateActionDto extends PartialType(CreateActionDto) {
  @ApiProperty({
    description: 'Nombre de la acción del sistema',
    example: 'Crear',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre de la acción debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre de la acción debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre de la acción no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    description: 'Descripción de lo que hace la acción',
    example: 'Permite crear nuevos registros en el sistema',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(2, { message: 'La descripción debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La descripción no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;
}
