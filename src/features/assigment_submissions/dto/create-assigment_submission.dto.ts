import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { AssigmentSubmissionStatus } from '../enums/assigment_submission.enum';

export class CreateAssigmentSubmissionDto {
  @ApiProperty({ example: 1, description: 'Número de intento de entrega' })
  @IsInt({ message: 'El número de intento debe ser un número entero.' })
  attemptNumber: number;

  @ApiProperty({ example: '2025-10-25T10:00:00Z', description: 'Fecha y hora de la entrega' })
  @IsDateString({}, { message: 'La fecha de entrega debe ser una fecha válida.' })
  submissionDate: Date;

  @ApiProperty({
    example: 'Texto de la entrega',
    description: 'Texto enviado en la entrega',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El texto de la entrega debe ser una cadena de texto.' })
  submissionText?: string;

  @ApiProperty({
    example: 'https://ejemplo.com/archivo.pdf',
    description: 'URL del archivo entregado',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del archivo debe ser válida.' })
  fileUrl?: string;

  @ApiProperty({
    example: 'archivo.pdf',
    description: 'Nombre del archivo entregado',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del archivo debe ser una cadena de texto.' })
  fileName?: string;

  @ApiProperty({
    example: 'https://ejemplo.com/link',
    description: 'URL de enlace entregado',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del enlace debe ser válida.' })
  linkUrl?: string;

  @ApiProperty({ example: 18, description: 'Puntaje obtenido', required: false })
  @IsOptional()
  @IsInt({ message: 'El puntaje debe ser un número entero.' })
  score?: number;

  @ApiProperty({
    example: 'Buen trabajo',
    description: 'Retroalimentación del docente',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La retroalimentación debe ser una cadena de texto.' })
  feedback?: string;

  @ApiProperty({
    example: '2025-10-26T10:00:00Z',
    description: 'Fecha de retroalimentación',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de retroalimentación debe ser una fecha válida.' })
  feedbackDate?: Date;

  @ApiProperty({
    example: 'https://ejemplo.com/feedback.pdf',
    description: 'URL del archivo de retroalimentación',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del archivo de retroalimentación debe ser válida.' })
  feedbackFileUrl?: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del docente que calificó (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del docente debe ser un UUID válido.' })
  gradedBy?: string;

  @ApiProperty({
    example: '2025-10-27T10:00:00Z',
    description: 'Fecha de calificación',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de calificación debe ser una fecha válida.' })
  gradedAt?: Date;

  @ApiProperty({
    example: AssigmentSubmissionStatus.PENDING,
    enum: AssigmentSubmissionStatus,
    description: 'Estado de la entrega',
  })
  @IsEnum(AssigmentSubmissionStatus, {
    message: 'El estado debe ser uno de: pending, graded, late.',
  })
  status: AssigmentSubmissionStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la asignación (UUID)',
  })
  @IsUUID('4', { message: 'La asignación debe ser un UUID válido.' })
  assigment: string;
}
