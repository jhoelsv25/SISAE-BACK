import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Level } from '../enums/grade_level.enum';

export class CreateGradeLevelDto {
  @ApiProperty({ example: Level.PRIMARY, enum: Level, description: 'Nivel educativo' })
  @IsEnum(Level, { message: 'El nivel debe ser uno de: primary, secondary, higher.' })
  level: Level;

  @ApiProperty({ example: 1, description: 'Número de grado' })
  @IsInt({ message: 'El número de grado debe ser un número entero.' })
  gradeNumber: number;

  @ApiProperty({ example: 'Primer Grado', description: 'Nombre del grado' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({
    example: 'Primer grado de educación primaria',
    description: 'Descripción del grado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: 30, description: 'Capacidad máxima de estudiantes' })
  @IsInt({ message: 'La capacidad máxima debe ser un número entero.' })
  maxCapacity: number;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la institución (UUID)',
  })
  @IsUUID('4', { message: 'La institución debe ser un UUID válido.' })
  institution: string;
}
