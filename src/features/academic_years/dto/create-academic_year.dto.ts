import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from 'class-validator';
import { AcademicYearStatus, GradingSystem, Modality } from '../enums/academic_year.enum';

export class AcademicYearGradeScaleDto {
  @ApiProperty({ example: 'A', description: 'Etiqueta literal de la escala.' })
  @IsString()
  @MaxLength(20)
  label: string;

  @ApiProperty({ example: 18, description: 'Valor mínimo del rango.' })
  minScore: number;

  @ApiProperty({ example: 20, description: 'Valor máximo del rango.' })
  maxScore: number;

  @ApiProperty({ example: 1, description: 'Orden visual de la escala.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;
}

export class CreateAcademicYearDto {
  @ApiProperty({ example: 2025, description: 'Año académico.' })
  @IsInt({ message: 'El año académico debe ser un número entero.' })
  @Min(1900, { message: 'El año académico debe ser mayor o igual a 1900.' })
  year: number;

  @ApiProperty({ example: 'Año Escolar 2025', description: 'Nombre del año académico.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no debe exceder 100 caracteres.' })
  name: string;

  @ApiProperty({ example: '2025-03-01', description: 'Fecha de inicio (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha de inicio debe estar en formato ISO8601.' })
  startDate: string;

  @ApiProperty({ example: '2026-02-28', description: 'Fecha de fin (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha de fin debe estar en formato ISO8601.' })
  endDate: string;

  @ApiProperty({
    example: 'in-person',
    enum: Modality,
    description: 'Modalidad del año académico.',
  })
  @IsEnum(Modality, { message: 'La modalidad debe ser válida.' })
  modality: Modality;

  @ApiProperty({
    example: 'percentage',
    enum: GradingSystem,
    description: 'Sistema de calificación.',
  })
  @IsEnum(GradingSystem, { message: 'El sistema de calificación debe ser válido.' })
  gradingSystem: GradingSystem;

  @ApiProperty({
    example: '2026-02-28',
    description: 'Fecha límite para aprobar el año académico (YYYY-MM-DD).',
  })
  @IsDateString({}, { message: 'La fecha límite debe estar en formato ISO8601.' })
  passingDate: string;

  @ApiProperty({
    example: '11',
    description: 'Regla mínima para aprobar el año académico. Puede ser numérica, letra o rango.',
  })
  @IsString({ message: 'La regla mínima aprobatoria debe ser una cadena de texto.' })
  @MaxLength(50, { message: 'La regla mínima aprobatoria no debe exceder 50 caracteres.' })
  passingGrade: string;

  @ApiProperty({
    example: 'https://colegio.edu/calendario2025.pdf',
    description: 'URL del calendario académico.',
  })
  @IsString({ message: 'La URL del calendario académico debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'La URL no debe exceder 255 caracteres.' })
  academicCalendarUrl: string;

  @ApiProperty({
    example: 'planned',
    enum: AcademicYearStatus,
    description: 'Estado del año académico.',
  })
  @IsEnum(AcademicYearStatus, { message: 'El estado debe ser válido.' })
  status: AcademicYearStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID de la institución.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de la institución debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la institución debe ser un UUID válido.' })
  institution: string;

  @ApiProperty({
    example: 4,
    description: 'Cantidad de periodos a generar automáticamente para este año académico.',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'La cantidad de periodos debe ser un número entero.' })
  @Min(0, { message: 'La cantidad de periodos no puede ser negativa.' })
  periodCount?: number;

  @ApiProperty({
    required: false,
    type: [AcademicYearGradeScaleDto],
    description: 'Escala de equivalencias cuando el sistema de calificación es literal.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicYearGradeScaleDto)
  gradeScales?: AcademicYearGradeScaleDto[];
}
