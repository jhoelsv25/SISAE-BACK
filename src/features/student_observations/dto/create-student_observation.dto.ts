import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { ObservationType } from '../enums/student_observation.enum';

export class CreateStudentObservationDto {
  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la observación (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO8601.' })
  date: string;

  @ApiProperty({
    example: 'El estudiante mostró gran interés en clase.',
    description: 'Detalle de la observación.',
  })
  @IsString({ message: 'La observación debe ser una cadena de texto.' })
  observation: string;

  @ApiProperty({ example: 'CONDUCTA', enum: ObservationType, description: 'Tipo de observación.' })
  @IsEnum(ObservationType, { message: 'El tipo de observación debe ser válido.' })
  type: ObservationType;

  @ApiProperty({
    example: 'Se recomienda seguimiento semanal.',
    description: 'Acciones de seguimiento.',
    required: false,
  })
  @IsString({ message: 'El seguimiento debe ser una cadena de texto.' })
  followUp: string;

  @ApiProperty({
    example: 'Derivado al departamento de psicología.',
    description: 'Derivación realizada.',
    required: false,
  })
  @IsString({ message: 'La derivación debe ser una cadena de texto.' })
  referral: string;

  @ApiProperty({ example: false, description: 'Indica si la observación es confidencial.' })
  @IsBoolean({ message: 'El campo isConfidential debe ser booleano.' })
  isConfidential: boolean;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID del estudiante.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del estudiante debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del estudiante debe ser un UUID válido.' })
  student: string;

  @ApiProperty({
    example: 'b7e6c8a2-1d2f-4c3b-9e2a-123456789abc',
    description: 'ID del docente.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del docente debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del docente debe ser un UUID válido.' })
  teacher: string;
}
