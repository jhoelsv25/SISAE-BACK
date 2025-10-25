import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { StudentStatus, StudentType } from '../enums/student.enum';

export class CreateStudentDto {
  @ApiProperty({ example: '20250001', description: 'Código único del estudiante.' })
  @IsString({ message: 'El código del estudiante debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El código del estudiante no debe exceder 100 caracteres.' })
  studentCode: string;

  @ApiProperty({ example: 'REGULAR', enum: StudentType, description: 'Tipo de estudiante.' })
  @IsEnum(StudentType, { message: 'El tipo de estudiante debe ser válido.' })
  studentType: StudentType;

  @ApiProperty({ example: 'Católica', description: 'Religión del estudiante.' })
  @IsString({ message: 'La religión debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'La religión no debe exceder 100 caracteres.' })
  religion: string;

  @ApiProperty({ example: 'Español', description: 'Lengua nativa del estudiante.' })
  @IsString({ message: 'La lengua nativa debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'La lengua nativa no debe exceder 100 caracteres.' })
  nativeLanguage: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el estudiante tiene alguna discapacidad.',
  })
  @IsBoolean({ message: 'El campo hasDisability debe ser booleano.' })
  hasDisability: boolean;

  @ApiProperty({
    example: ['asma', 'diabetes'],
    description: 'Problemas de salud del estudiante.',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'El campo healthIssues debe ser un arreglo de cadenas.' })
  @IsString({ each: true, message: 'Cada problema de salud debe ser una cadena de texto.' })
  healthIssues?: string[];

  @ApiProperty({ example: '123456789', description: 'Número de seguro del estudiante.' })
  @IsString({ message: 'El número de seguro debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El número de seguro no debe exceder 100 caracteres.' })
  insunranceNumber: string;

  @ApiProperty({ example: 'O+', description: 'Tipo de sangre del estudiante.' })
  @IsString({ message: 'El tipo de sangre debe ser una cadena de texto.' })
  @MaxLength(10, { message: 'El tipo de sangre no debe exceder 10 caracteres.' })
  bloodType: string;

  @ApiProperty({ example: 'Penicilina', description: 'Alergias del estudiante.' })
  @IsString({ message: 'Las alergias deben ser una cadena de texto.' })
  @MaxLength(255, { message: 'Las alergias no deben exceder 255 caracteres.' })
  allergies: string;

  @ApiProperty({ example: 'Hipertensión', description: 'Condiciones médicas del estudiante.' })
  @IsString({ message: 'Las condiciones médicas deben ser una cadena de texto.' })
  medicalConditions: string;

  @ApiProperty({ example: '2025-03-01', description: 'Fecha de admisión (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha de admisión debe estar en formato ISO8601.' })
  admisionDate: string;

  @ApiProperty({
    example: '2025-10-25',
    description: 'Fecha de retiro (YYYY-MM-DD).',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de retiro debe estar en formato ISO8601.' })
  withdrawalDate?: string;

  @ApiProperty({
    example: 'Cambio de residencia',
    description: 'Motivo de retiro.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El motivo de retiro debe ser una cadena de texto.' })
  withdrawalReason?: string;

  @ApiProperty({ example: 'ACTIVO', enum: StudentStatus, description: 'Estado del estudiante.' })
  @IsEnum(StudentStatus, { message: 'El estado del estudiante debe ser válido.' })
  status: StudentStatus;

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
    example: 'b7e6c8a2-1d2f-4c3b-9e2a-123456789abc',
    description: 'ID de la persona.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de la persona debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido.' })
  person: string;
}
