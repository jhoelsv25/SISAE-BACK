import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLearningModuleDto {
  @ApiProperty({ example: 'Módulo de Álgebra', description: 'Título del módulo de aprendizaje' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: 'Contenido sobre álgebra básica',
    description: 'Descripción del módulo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: 1, description: 'Orden de visualización' })
  @IsInt({ message: 'El orden de visualización debe ser un número entero.' })
  displayOrder: number;

  @ApiProperty({ example: '2025-10-25', description: 'Fecha de inicio del módulo' })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida.' })
  startDate: Date;

  @ApiProperty({ example: '2025-11-25', description: 'Fecha de fin del módulo' })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida.' })
  endDate: Date;

  @ApiProperty({ example: true, description: '¿El módulo está publicado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isPublished: boolean;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
  })
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourseId: string;
}
