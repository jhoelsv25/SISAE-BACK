import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token único de la sesión.',
  })
  @IsString({ message: 'El token de sesión debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'El token de sesión no debe exceder 255 caracteres.' })
  sessionToken: string;

  @ApiProperty({
    example: '2025-10-25T23:59:59.000Z',
    description: 'Fecha y hora de expiración de la sesión (ISO8601).',
  })
  @IsDateString({}, { message: 'La fecha de expiración debe estar en formato ISO8601.' })
  expiresAt: string;

  @ApiProperty({
    example: '2025-10-25T22:00:00.000Z',
    description: 'Última actividad de la sesión (ISO8601).',
  })
  @IsDateString({}, { message: 'La fecha de última actividad debe estar en formato ISO8601.' })
  lastActive: string;

  @ApiProperty({
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
    description: 'Agente de usuario del navegador.',
  })
  @IsString({ message: 'El agente de usuario debe ser una cadena de texto.' })
  @MaxLength(255, { message: 'El agente de usuario no debe exceder 255 caracteres.' })
  userAgent: string;

  @ApiProperty({ example: '192.168.1.1', description: 'Dirección IP del usuario.' })
  @IsString({ message: 'La dirección IP debe ser una cadena de texto.' })
  @MaxLength(45, { message: 'La dirección IP no debe exceder 45 caracteres.' })
  ipAddress: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID del usuario relacionado.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de usuario debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido.' })
  user: string;
}
