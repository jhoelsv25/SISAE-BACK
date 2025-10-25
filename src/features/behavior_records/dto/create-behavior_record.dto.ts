import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BehaviorSeverity, BehaviorType } from '../enums/behavior_record.enum';

export class CreateBehaviorRecordDto {
  @ApiProperty({
    example: BehaviorType.POSITIVE,
    enum: BehaviorType,
    description: 'Tipo de comportamiento',
  })
  @IsEnum(BehaviorType, { message: 'El tipo debe ser uno de: positive, negative.' })
  type: BehaviorType;

  @ApiProperty({ example: 'Respeto', description: 'Categoría del comportamiento' })
  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  category: string;

  @ApiProperty({
    example: 'El estudiante mostró respeto en clase',
    description: 'Descripción del comportamiento',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  description: string;

  @ApiProperty({ example: '2025-10-25', description: 'Fecha del registro' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida.' })
  recordDate: Date;

  @ApiProperty({
    example: BehaviorSeverity.LOW,
    enum: BehaviorSeverity,
    description: 'Severidad del comportamiento',
  })
  @IsEnum(BehaviorSeverity, { message: 'La severidad debe ser uno de: low, medium, high.' })
  severity: BehaviorSeverity;

  @ApiProperty({ example: 'ACT123', description: 'Token de acción' })
  @IsString({ message: 'El token de acción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El token de acción es obligatorio.' })
  actionToken: string;

  @ApiProperty({ example: false, description: '¿Se notificó al tutor?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  guardianNotified: boolean;

  @ApiProperty({
    example: '2025-10-26',
    description: 'Fecha de notificación al tutor',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de notificación debe ser una fecha válida.' })
  notificationDate?: Date;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del estudiante (UUID)',
  })
  @IsUUID('4', { message: 'El estudiante debe ser un UUID válido.' })
  student: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del periodo (UUID)',
  })
  @IsUUID('4', { message: 'El periodo debe ser un UUID válido.' })
  period: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del docente (UUID)',
  })
  @IsUUID('4', { message: 'El docente debe ser un UUID válido.' })
  teacher: string;
}
