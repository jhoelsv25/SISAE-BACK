import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'MAT101', description: 'Código único del curso.', maxLength: 20 })
  @IsString({ message: 'El código debe ser una cadena de texto.' })
  @MaxLength(20, { message: 'El código no debe exceder 20 caracteres.' })
  code: string;

  @ApiProperty({ example: 'Matemática I', description: 'Nombre del curso.', maxLength: 100 })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no debe exceder 100 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Curso de matemáticas básicas.', description: 'Descripción del curso.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description: string;

  @ApiProperty({ example: 4, description: 'Horas semanales.' })
  @IsInt({ message: 'Las horas semanales deben ser un número entero.' })
  @Min(0, { message: 'Las horas semanales no pueden ser negativas.' })
  weeklyHours: number;

  @ApiProperty({ example: 64, description: 'Total de horas del curso.' })
  @IsInt({ message: 'El total de horas debe ser un número entero.' })
  @Min(0, { message: 'El total de horas no puede ser negativo.' })
  totalHours: number;

  @ApiProperty({ example: 4, description: 'Créditos del curso.' })
  @IsInt({ message: 'Los créditos deben ser un número entero.' })
  @Min(0, { message: 'Los créditos no pueden ser negativos.' })
  credits: number;

  @ApiProperty({
    example: 'Trabajo en equipo, Pensamiento crítico',
    description: 'Competencias del curso.',
  })
  @IsOptional()
  @IsString({ message: 'Las competencias deben ser una cadena de texto.' })
  competencies?: string;

  @ApiProperty({ example: true, description: 'Indica si el curso es obligatorio.' })
  @IsBoolean({ message: 'isMandatory debe ser un booleano.' })
  isMandatory: boolean;

  @ApiProperty({ example: 'https://...', description: 'URL del syllabus.', maxLength: 255 })
  @IsOptional()
  @IsString({ message: 'La URL del syllabus debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'La URL no debe exceder 255 caracteres.' })
  syllabusUrl?: string;

  @ApiProperty({ description: 'ID del área curricular.' })
  @IsUUID('4', { message: 'El ID del área curricular debe ser un UUID válido.' })
  subjectAreaId: string;

  @ApiProperty({ description: 'ID del grado.' })
  @IsUUID('4', { message: 'El ID del grado debe ser un UUID válido.' })
  gradeId: string;
}
