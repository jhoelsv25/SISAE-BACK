import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EmailLogStatus } from '../enums/email_log.enum';

export class CreateEmailLogDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del destinatario',
  })
  @IsString({ message: 'El destinatario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El destinatario es obligatorio.' })
  recipient: string;

  @ApiProperty({ example: 'Asunto del correo', description: 'Asunto del correo electrónico' })
  @IsString({ message: 'El asunto debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El asunto es obligatorio.' })
  subject: string;

  @ApiProperty({ example: 'Contenido del correo', description: 'Cuerpo del correo electrónico' })
  @IsString({ message: 'El cuerpo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El cuerpo es obligatorio.' })
  body: string;

  @ApiProperty({
    example: EmailLogStatus.SENT,
    enum: EmailLogStatus,
    description: 'Estado del envío del correo',
  })
  @IsEnum(EmailLogStatus, { message: 'El estado debe ser uno de: sent, failed.' })
  status: EmailLogStatus;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del usuario (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;
}
