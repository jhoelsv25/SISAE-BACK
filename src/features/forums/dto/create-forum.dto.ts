import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ForumModerationLevel, ForumStatus, ForumType } from '../enums/forum.enum';

export class CreateForumDto {
  @ApiProperty({ example: 'Foro de Matemáticas', description: 'Título del foro' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({ example: ForumType.PUBLIC, enum: ForumType, description: 'Tipo de foro' })
  @IsEnum(ForumType, { message: 'El tipo debe ser uno de: public, private.' })
  type: ForumType;

  @ApiProperty({
    example: 'Foro para discutir temas de matemáticas',
    description: 'Descripción del foro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: false, description: '¿El foro es moderado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isModerated: boolean;

  @ApiProperty({ example: true, description: '¿Se permiten publicaciones anónimas?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  allowAnonymousPosts: boolean;

  @ApiProperty({ example: 500, description: 'Longitud máxima de publicación', required: false })
  @IsOptional()
  @IsInt({ message: 'La longitud máxima debe ser un número entero.' })
  maxPostLength?: number;

  @ApiProperty({
    example: ForumModerationLevel.NONE,
    enum: ForumModerationLevel,
    description: 'Nivel de moderación',
  })
  @IsEnum(ForumModerationLevel, {
    message: 'El nivel de moderación debe ser uno de: none, low, high.',
  })
  moderationLevel: ForumModerationLevel;

  @ApiProperty({ example: ForumStatus.ACTIVE, enum: ForumStatus, description: 'Estado del foro' })
  @IsEnum(ForumStatus, { message: 'El estado debe ser uno de: active, inactive.' })
  status: ForumStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse?: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del módulo de aprendizaje (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El módulo debe ser un UUID válido.' })
  module?: string;
}
