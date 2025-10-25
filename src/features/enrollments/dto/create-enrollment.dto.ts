import { EnrollmentStatus } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EnrollmentType } from '../enums/enrollment.enum';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'ENR2025-001', description: 'Código único de la matrícula' })
  @IsString({ message: 'El código debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  code: string;

  @ApiProperty({ example: '2025-10-25', description: 'Fecha de matrícula' })
  @IsDateString({}, { message: 'La fecha de matrícula debe ser una fecha válida.' })
  enrollmentDate: Date;

  @ApiProperty({
    example: EnrollmentType.NEW,
    enum: EnrollmentType,
    description: 'Tipo de matrícula',
  })
  @IsEnum(EnrollmentType, {
    message: 'El tipo de matrícula debe ser uno de: new, returning, transfer.',
  })
  enrollmentType: EnrollmentType;

  @ApiProperty({
    example: EnrollmentStatus.ENROLLED,
    enum: EnrollmentStatus,
    description: 'Estado de la matrícula',
  })
  @IsEnum(EnrollmentStatus, {
    message: 'El estado debe ser uno de: enrolled, completed, dropped, graduated.',
  })
  status: EnrollmentStatus;

  @ApiProperty({ example: 1, description: 'Número de orden de matrícula' })
  @IsInt({ message: 'El número de orden debe ser un número entero.' })
  orderNumber: number;

  @ApiProperty({
    example: 'Observaciones sobre la matrícula',
    description: 'Observaciones',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observations?: string;

  @ApiProperty({
    example: 'Colegio Anterior',
    description: 'Nombre del colegio anterior',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El colegio anterior debe ser una cadena de texto.' })
  previusSchool?: string;

  @ApiProperty({ example: 'Quinto', description: 'Grado anterior', required: false })
  @IsOptional()
  @IsString({ message: 'El grado anterior debe ser una cadena de texto.' })
  previousGrade?: string;

  @ApiProperty({ example: 2024, description: 'Año anterior', required: false })
  @IsOptional()
  @IsInt({ message: 'El año anterior debe ser un número entero.' })
  previusYear?: number;

  @ApiProperty({ example: 16.5, description: 'Promedio anterior', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El promedio anterior debe ser un número.' })
  previusAverage?: number;

  @ApiProperty({ example: false, description: '¿El estudiante repite año?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isRepeating: boolean;

  @ApiProperty({ example: false, description: '¿El estudiante tiene necesidades especiales?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  hasSpecialNeeds: boolean;

  @ApiProperty({ example: false, description: '¿El estudiante tiene beca?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  hasScholarship: boolean;

  @ApiProperty({ example: 50, description: 'Porcentaje de beca', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El porcentaje de beca debe ser un número.' })
  scholarshipPercentage?: number;

  @ApiProperty({
    example: 'Detalles de la beca',
    description: 'Detalles de la beca',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Los detalles de la beca deben ser una cadena de texto.' })
  scholarshipDetails?: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del estudiante (UUID)',
  })
  @IsUUID('4', { message: 'El estudiante debe ser un UUID válido.' })
  student: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección (UUID)',
  })
  @IsUUID('4', { message: 'La sección debe ser un UUID válido.' })
  section: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del año académico (UUID)',
  })
  @IsUUID('4', { message: 'El año académico debe ser un UUID válido.' })
  academicYear: string;
}
