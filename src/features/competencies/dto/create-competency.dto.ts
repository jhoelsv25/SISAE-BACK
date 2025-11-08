import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompetencyDto {
  @ApiProperty({ example: 'COMP001', description: 'Código único de la competencia' })
  @IsString({ message: 'El código debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  code: string;

  @ApiProperty({ example: 'Pensamiento crítico', description: 'Nombre de la competencia' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({
    example: 'Capacidad para analizar y evaluar información',
    description: 'Descripción de la competencia',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({
    example: 'Analiza información y toma decisiones fundamentadas',
    description: 'Nivel esperado de logro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nivel esperado debe ser una cadena de texto.' })
  expectedAchievement?: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del curso (UUID)',
  })
  @IsUUID('4', { message: 'El curso debe ser un UUID válido.' })
  course: string;
}
