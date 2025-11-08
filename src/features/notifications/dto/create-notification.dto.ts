import { PriorityType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationType } from '../enums/notification.enum';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Nueva tarea disponible', description: 'Título de la notificación' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: 'Se ha publicado una nueva tarea en el curso de matemáticas.',
    description: 'Contenido de la notificación',
  })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  content: string;

  @ApiProperty({ example: false, description: '¿La notificación ha sido leída?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isRead: boolean;

  @ApiProperty({
    example: 'https://ejemplo.com/tarea',
    description: 'URL de enlace',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El enlace debe ser una cadena de texto.' })
  linkUrl?: string;

  @ApiProperty({ example: '2025-10-25T10:00:00Z', description: 'Fecha y hora de envío' })
  @IsDateString({}, { message: 'La fecha de envío debe ser una fecha válida.' })
  sendAt: Date;

  @ApiProperty({
    example: '2025-10-25T12:00:00Z',
    description: 'Fecha y hora de lectura',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de lectura debe ser una fecha válida.' })
  readAt?: Date;

  @ApiProperty({
    example: NotificationType.INFO,
    enum: NotificationType,
    description: 'Tipo de notificación',
  })
  @IsEnum(NotificationType, {
    message: 'El tipo debe ser uno de: info, warning, alert, success, error.',
  })
  type: NotificationType;

  @ApiProperty({
    example: PriorityType.MEDIUM,
    enum: PriorityType,
    description: 'Prioridad de la notificación',
  })
  @IsEnum(PriorityType, { message: 'La prioridad debe ser uno de: low, medium, high, urgent.' })
  priority: PriorityType;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del destinatario (UUID)',
  })
  @IsUUID('4', { message: 'El destinatario debe ser un UUID válido.' })
  recipientId: string;
}
