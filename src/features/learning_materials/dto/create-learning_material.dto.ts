import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { LearningMaterialType } from '../enums/learning_material.enum';

export class CreateLearningMaterialDto {
  @ApiProperty({ example: 'Guía de matemáticas', description: 'Título del material educativo' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: LearningMaterialType.DOCUMENT,
    enum: LearningMaterialType,
    description: 'Tipo de material educativo',
  })
  @IsEnum(LearningMaterialType, {
    message: 'El tipo debe ser uno de: video, document, audio, presentation, other.',
  })
  type: LearningMaterialType;

  @ApiProperty({
    example: 'Material para el tema de fracciones',
    description: 'Descripción del material',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({
    example: 'https://ejemplo.com/material.pdf',
    description: 'URL del material educativo',
  })
  @IsUrl({}, { message: 'La URL debe ser válida.' })
  url: string;

  @ApiProperty({ example: 60, description: 'Duración en minutos', required: false })
  @IsOptional()
  @IsInt({ message: 'La duración debe ser un número entero.' })
  durationMinutes?: number;

  @ApiProperty({
    example: 'https://ejemplo.com/thumbnail.jpg',
    description: 'URL de la miniatura',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La miniatura debe ser una cadena de texto.' })
  thumbnail?: string;

  @ApiProperty({ example: 0, description: 'Cantidad de vistas', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de vistas debe ser un número entero.' })
  viewCount?: number;

  @ApiProperty({ example: 0, description: 'Cantidad de likes', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de likes debe ser un número entero.' })
  likeCount?: number;

  @ApiProperty({ example: 0, description: 'Cantidad de dislikes', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de dislikes debe ser un número entero.' })
  dislikeCount?: number;

  @ApiProperty({ example: true, description: '¿El material es visible?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isVisible: boolean;

  @ApiProperty({ example: false, description: '¿Se permite la descarga?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  downloadEnabled: boolean;

  @ApiProperty({ example: 1, description: 'Orden de visualización', required: false })
  @IsOptional()
  @IsInt({ message: 'El orden de visualización debe ser un número entero.' })
  displayOrder?: number;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse?: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del módulo de aprendizaje (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El módulo debe ser un UUID válido.' })
  module?: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del docente (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El docente debe ser un UUID válido.' })
  teacher?: string;
}
