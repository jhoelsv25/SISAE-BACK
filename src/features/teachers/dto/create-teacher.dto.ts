import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ContractType, EmployementStatus, LaborRegime, WorkloadType } from '../enums/teacher.enum';

export class CreateTeacherDto {
  @ApiProperty({ example: 'T20250001', description: 'Código único del docente.' })
  @IsString({ message: 'El código del docente debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El código no debe exceder 100 caracteres.' })
  teacherCode: string;

  @ApiProperty({ example: 'Matemáticas', description: 'Especialidad del docente.' })
  @IsString({ message: 'La especialidad debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'La especialidad no debe exceder 100 caracteres.' })
  specialization: string;

  @ApiProperty({
    example: 'Licenciado en Educación',
    description: 'Título profesional del docente.',
  })
  @IsString({ message: 'El título profesional debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El título profesional no debe exceder 100 caracteres.' })
  professionalTitle: string;

  @ApiProperty({ example: 'Universidad Nacional', description: 'Universidad de graduación.' })
  @IsString({ message: 'La universidad debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'La universidad no debe exceder 100 caracteres.' })
  university: string;

  @ApiProperty({ example: 2010, description: 'Año de graduación.' })
  @IsInt({ message: 'El año de graduación debe ser un número entero.' })
  @Min(1900, { message: 'El año de graduación debe ser mayor o igual a 1900.' })
  graduationYear: number;

  @ApiProperty({ example: '123456', description: 'Número de licencia profesional.' })
  @IsString({ message: 'La licencia profesional debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'La licencia profesional no debe exceder 100 caracteres.' })
  professionalLicense: string;

  @ApiProperty({
    example: 'CONTRATO_INDEFINIDO',
    enum: ContractType,
    description: 'Tipo de contrato.',
  })
  @IsEnum(ContractType, { message: 'El tipo de contrato debe ser válido.' })
  contractType: ContractType;

  @ApiProperty({ example: 'REGIMEN_GENERAL', enum: LaborRegime, description: 'Régimen laboral.' })
  @IsEnum(LaborRegime, { message: 'El régimen laboral debe ser válido.' })
  laborRegime: LaborRegime;

  @ApiProperty({ example: '2025-03-01', description: 'Fecha de contratación (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha de contratación debe estar en formato ISO8601.' })
  hireDate: string;

  @ApiProperty({
    example: '2025-10-25',
    description: 'Fecha de terminación (YYYY-MM-DD).',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de terminación debe estar en formato ISO8601.' })
  terminationDate?: string;

  @ApiProperty({
    example: 'TIEMPO_COMPLETO',
    enum: WorkloadType,
    description: 'Tipo de carga laboral.',
  })
  @IsEnum(WorkloadType, { message: 'El tipo de carga laboral debe ser válido.' })
  workloadType: WorkloadType;

  @ApiProperty({ example: 40, description: 'Horas semanales de trabajo.' })
  @IsInt({ message: 'Las horas semanales deben ser un número entero.' })
  weeklyHours: number;

  @ApiProperty({ example: 'Secundaria', description: 'Nivel de enseñanza.' })
  @IsString({ message: 'El nivel de enseñanza debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nivel de enseñanza no debe exceder 100 caracteres.' })
  teachingLevel: string;

  @ApiProperty({
    example: 'ACTIVO',
    enum: EmployementStatus,
    description: 'Estado laboral del docente.',
  })
  @IsEnum(EmployementStatus, { message: 'El estado laboral debe ser válido.' })
  employmentStatus: EmployementStatus;

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
