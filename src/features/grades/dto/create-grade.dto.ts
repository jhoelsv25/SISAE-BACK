import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { GradeStatus } from '../enums/grade.enum';

export class CreateGradeDto {
  @ApiProperty({ example: 15.5, description: 'Calificación acumulativa.' })
  @IsNumber({}, { message: 'La calificación acumulativa debe ser un número.' })
  cumulativeGrade: number;

  @ApiProperty({ example: 18.0, description: 'Calificación de examen final.' })
  @IsNumber({}, { message: 'La calificación de examen final debe ser un número.' })
  examGrade: number;

  @ApiProperty({ example: 16.2, description: 'Calificación final del curso.' })
  @IsNumber({}, { message: 'La calificación final debe ser un número.' })
  finalGrade: number;

  @ApiProperty({ example: 2, description: 'Número de tardanzas permitidas.' })
  @IsInt({ message: 'El número de tardanzas debe ser un número entero.' })
  @Min(0, { message: 'El número de tardanzas no puede ser negativo.' })
  tardies: number;

  @ApiProperty({ example: 1, description: 'Número de ausencias permitidas.' })
  @IsInt({ message: 'El número de ausencias debe ser un número entero.' })
  @Min(0, { message: 'El número de ausencias no puede ser negativo.' })
  absences: number;

  @ApiProperty({
    example: 'Buen desempeño en el curso.',
    description: 'Observaciones sobre el estudiante.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observations?: string;

  @ApiProperty({ example: 'admin', description: 'Usuario que modificó la calificación.' })
  @IsString({ message: 'El usuario debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El usuario no debe exceder 100 caracteres.' })
  modifiedBy: string;

  @ApiProperty({ example: 'ACTIVE', enum: GradeStatus, description: 'Estado de la calificación.' })
  @IsEnum(GradeStatus, { message: 'El estado debe ser válido.' })
  status: GradeStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID de la matrícula.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de la matrícula debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la matrícula debe ser un UUID válido.' })
  enrollment: string;

  @ApiProperty({
    example: 'b7e6c8a2-1d2f-4c3b-9e2a-123456789abc',
    description: 'ID de la relación sección-curso.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de la sección-curso debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la sección-curso debe ser un UUID válido.' })
  sectionCourse: string;

  @ApiProperty({
    example: 'c1d2e3f4-5g6h-7i8j-9k0l-123456789abc',
    description: 'ID del periodo.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del periodo debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del periodo debe ser un UUID válido.' })
  period: string;

  @ApiProperty({
    example: 'd1e2f3g4-5h6i-7j8k-9l0m-0987654321ab',
    description: 'ID del docente.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del docente debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del docente debe ser un UUID válido.' })
  teacher: string;
}
