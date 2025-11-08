import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AssessmentStatus, AssessmentType } from '../enums/assessment.enum';

export class CreateAssessmentDto {
  @ApiProperty({ example: 'Examen Final', description: 'Nombre de la evaluación' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({
    example: 'Evaluación de conocimientos finales',
    description: 'Descripción de la evaluación',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: '2025-11-10', description: 'Fecha de la evaluación' })
  @IsDateString({}, { message: 'La fecha de la evaluación debe ser una fecha válida.' })
  assessmentDate: Date;

  @ApiProperty({ example: 30, description: 'Porcentaje de peso de la evaluación' })
  @IsInt({ message: 'El porcentaje de peso debe ser un número entero.' })
  weightPercentage: number;

  @ApiProperty({ example: 20, description: 'Puntaje máximo de la evaluación' })
  @IsInt({ message: 'El puntaje máximo debe ser un número entero.' })
  maxScore: number;

  @ApiProperty({
    example: AssessmentType.FORMATIVE,
    enum: AssessmentType,
    description: 'Tipo de evaluación',
  })
  @IsEnum(AssessmentType, {
    message: 'El tipo de evaluación debe ser uno de: formative, summative, diagnostic.',
  })
  type: AssessmentType;

  @ApiProperty({
    example: AssessmentStatus.PENDING,
    enum: AssessmentStatus,
    description: 'Estado de la evaluación',
  })
  @IsEnum(AssessmentStatus, { message: 'El estado debe ser uno de: pending, completed, reviewed.' })
  status: AssessmentStatus;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del periodo (UUID)',
  })
  @IsUUID('4', { message: 'El periodo debe ser un UUID válido.' })
  period: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
  })
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse: string;
}
