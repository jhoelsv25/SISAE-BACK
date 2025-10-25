import { AttendanceStatus } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SessionType } from '../enums/attendance.enum';

export class CreateAttendanceDto {
  @ApiProperty({ example: '2025-10-25', description: 'Fecha de la asistencia' })
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida.' })
  date: Date;

  @ApiProperty({ example: SessionType.LECTURE, enum: SessionType, description: 'Tipo de sesión' })
  @IsEnum(SessionType, {
    message: 'El tipo de sesión debe ser uno de: lecture, lab, seminar, workshop.',
  })
  sessionType: SessionType;

  @ApiProperty({
    example: AttendanceStatus.PRESENT,
    enum: AttendanceStatus,
    description: 'Estado de la asistencia',
  })
  @IsEnum(AttendanceStatus, {
    message: 'El estado debe ser uno de: present, absent, late, excused.',
  })
  status: AttendanceStatus;

  @ApiProperty({ example: '08:00', description: 'Hora de entrada' })
  @IsString({ message: 'La hora de entrada debe ser una cadena de texto.' })
  checkInTime: string;

  @ApiProperty({ example: '12:00', description: 'Hora de salida', required: false })
  @IsOptional()
  @IsString({ message: 'La hora de salida debe ser una cadena de texto.' })
  checkOutTime?: string;

  @ApiProperty({
    example: 'Observaciones sobre la asistencia',
    description: 'Observaciones',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observations?: string;

  @ApiProperty({
    example: 'https://ejemplo.com/documento.pdf',
    description: 'Documento de justificación',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El documento de justificación debe ser una cadena de texto.' })
  justificationDocument?: string;

  @ApiProperty({
    example: 'Motivo de la justificación',
    description: 'Justificación',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La justificación debe ser una cadena de texto.' })
  justification?: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID de la matrícula (UUID)',
  })
  @IsUUID('4', { message: 'La matrícula debe ser un UUID válido.' })
  enrollment: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
  })
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse: string;
}
