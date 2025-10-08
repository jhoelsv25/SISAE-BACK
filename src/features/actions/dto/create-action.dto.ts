import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateActionDto {
  @ApiProperty({
    example: 'create',
    description: 'Clave única de la acción (ej: create, update, delete)',
  })
  @IsString({ message: 'El key de la acción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El key de la acción es obligatorio' })
  @MaxLength(50, { message: 'El key de la acción no debe exceder 50 caracteres' })
  key: string;

  @ApiProperty({ example: 'Crear', description: 'Nombre descriptivo de la acción' })
  @IsString({ message: 'El nombre de la acción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la acción es obligatorio' })
  @MaxLength(100, { message: 'El nombre de la acción no debe exceder 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'Permite crear registros', required: false })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no debe exceder 255 caracteres' })
  description?: string;

  @ApiProperty({ example: true, description: '¿Es la acción por defecto?' })
  @IsOptional()
  @IsBoolean({ message: 'El campo isDefault debe ser un booleano' })
  isDefault?: boolean;
}
