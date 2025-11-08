import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { AssigmentStatus, AssigmentType } from '../enums/assigment.enum';

export class CreateAssigmentDto {
  @ApiProperty({ example: 'Tarea de matemáticas', description: 'Título de la asignación' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: 'Resuelve los ejercicios del capítulo 5',
    description: 'Descripción de la asignación',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({
    example: 'Lee el capítulo antes de resolver',
    description: 'Instrucciones para la asignación',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las instrucciones deben ser una cadena de texto.' })
  instructions?: string;

  @ApiProperty({ example: 20, description: 'Puntaje máximo de la asignación' })
  @IsInt({ message: 'El puntaje máximo debe ser un número entero.' })
  maxScore: number;

  @ApiProperty({ example: '2025-10-25T10:00:00Z', description: 'Fecha de asignación' })
  @IsDateString({}, { message: 'La fecha de asignación debe ser una fecha válida.' })
  assignedDate: Date;

  @ApiProperty({ example: '2025-10-30T23:59:59Z', description: 'Fecha límite de entrega' })
  @IsDateString({}, { message: 'La fecha límite debe ser una fecha válida.' })
  dueDate: Date;

  @ApiProperty({ example: true, description: '¿Se permite entrega tardía?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  lateSubmissionAllowed: boolean;

  @ApiProperty({
    example: 10,
    description: 'Porcentaje de penalización por entrega tardía',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El porcentaje de penalización debe ser un número entero.' })
  latePenaltyPercentage?: number;

  @ApiProperty({
    example: AssigmentType.HOMEWORK,
    enum: AssigmentType,
    description: 'Tipo de asignación',
  })
  @IsEnum(AssigmentType, { message: 'El tipo debe ser uno de: homework, project, quiz, exam.' })
  type: AssigmentType;

  @ApiProperty({ example: 5, description: 'Tamaño máximo de archivo en MB', required: false })
  @IsOptional()
  @IsInt({ message: 'El tamaño máximo debe ser un número entero.' })
  maxFileSizeMB?: number;

  @ApiProperty({
    example: ['pdf', 'docx'],
    description: 'Tipos de archivo permitidos',
    required: false,
  })
  @IsOptional()
  allowedFileTypes?: string[];

  @ApiProperty({ example: 3, description: 'Cantidad máxima de intentos', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad máxima de intentos debe ser un número entero.' })
  maxAttempts?: number;

  @ApiProperty({ example: false, description: '¿Es una asignación grupal?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  groupAssignment: boolean;

  @ApiProperty({
    example: 'https://ejemplo.com/rubrica.pdf',
    description: 'URL de la rúbrica',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la rúbrica debe ser válida.' })
  rubricUrl?: string;

  @ApiProperty({
    example: AssigmentStatus.DRAFT,
    enum: AssigmentStatus,
    description: 'Estado de la asignación',
  })
  @IsEnum(AssigmentStatus, { message: 'El estado debe ser uno de: draft, published, closed.' })
  status: AssigmentStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
  })
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del docente (UUID)',
  })
  @IsUUID('4', { message: 'El docente debe ser un UUID válido.' })
  teacher: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del módulo de aprendizaje (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El módulo debe ser un UUID válido.' })
  module?: string;
}
