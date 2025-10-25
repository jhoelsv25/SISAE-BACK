import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { AttendanceStatus } from '../enums/teacher_attendance.enum';

export class CreateTeacherAttendanceDto {
  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la asistencia (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO8601.' })
  date: string;

  @ApiProperty({ example: '08:00:00', description: 'Hora de entrada (HH:mm:ss).' })
  @IsString({ message: 'La hora de entrada debe ser una cadena de texto.' })
  checkInTime: string;

  @ApiProperty({ example: '14:00:00', description: 'Hora de salida (HH:mm:ss).', required: false })
  @IsOptional()
  @IsString({ message: 'La hora de salida debe ser una cadena de texto.' })
  checkOutTime?: string;

  @ApiProperty({
    example: 'PRESENTE',
    enum: AttendanceStatus,
    description: 'Estado de la asistencia.',
  })
  @IsEnum(AttendanceStatus, { message: 'El estado de la asistencia debe ser válido.' })
  status: AttendanceStatus;

  @ApiProperty({ example: 'Permiso médico', description: 'Tipo de permiso.', maxLength: 100 })
  @IsString({ message: 'El tipo de permiso debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El tipo de permiso no debe exceder 100 caracteres.' })
  leaveType: string;

  @ApiProperty({
    example: 'Motivo de la ausencia',
    description: 'Motivo de la ausencia.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto.' })
  reason?: string;

  @ApiProperty({
    example: 'Observaciones adicionales',
    description: 'Observaciones sobre la asistencia.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observations?: string;

  @ApiProperty({
    example: 'URL o referencia de documentos',
    description: 'Documentos de respaldo.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Los documentos de respaldo deben ser una cadena de texto.' })
  supportingDocuments?: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID del docente.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del docente debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del docente debe ser un UUID válido.' })
  teacher: string;
}
