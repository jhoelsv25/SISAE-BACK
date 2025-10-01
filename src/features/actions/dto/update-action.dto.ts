import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateActionDto } from './create-action.dto';

export class UpdateActionDto extends PartialType(CreateActionDto) {
  @ApiProperty({
    example: 'create',
    description: 'Clave única de la acción (ej: create, update, delete)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El key de la acción debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El key de la acción no debe exceder 50 caracteres' })
  key?: string;

  @ApiProperty({
    example: 'Crear',
    description: 'Nombre descriptivo de la acción',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre de la acción debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre de la acción no debe exceder 100 caracteres' })
  name?: string;

  @ApiProperty({ example: 'Permite crear registros', required: false })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no debe exceder 255 caracteres' })
  description?: string;
}
