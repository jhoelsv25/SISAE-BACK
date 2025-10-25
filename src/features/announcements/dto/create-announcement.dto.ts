import { PriorityType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { AnnouncementStatus, RecipientType } from '../enums/announcement.enum';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Título del anuncio', description: 'Título del anuncio', minLength: 1 })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: 'Contenido del anuncio',
    description: 'Contenido del anuncio',
    minLength: 1,
  })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  content: string;

  @ApiProperty({
    example: RecipientType.STUDENTS,
    enum: RecipientType,
    description: 'Tipo de destinatario del anuncio',
  })
  @IsEnum(RecipientType, { message: 'El destinatario debe ser uno de: students, teachers, all.' })
  recipient: RecipientType;

  @ApiProperty({ example: '2025-10-25T10:00:00Z', description: 'Fecha y hora de publicación' })
  @IsDateString({}, { message: 'La fecha de publicación debe ser una fecha válida.' })
  publishedAt: Date;

  @ApiProperty({ example: '2025-11-01T23:59:59Z', description: 'Fecha y hora de expiración' })
  @IsDateString({}, { message: 'La fecha de expiración debe ser una fecha válida.' })
  expireAt: Date;

  @ApiProperty({
    example: 'https://ejemplo.com/archivo.pdf',
    description: 'URL del archivo adjunto',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del archivo adjunto debe ser válida.' })
  attachmentUrl?: string;

  @ApiProperty({
    example: PriorityType.HIGH,
    enum: PriorityType,
    description: 'Prioridad del anuncio',
  })
  @IsEnum(PriorityType, { message: 'La prioridad debe ser uno de: high, medium, low.' })
  priority: PriorityType;

  @ApiProperty({
    example: AnnouncementStatus.DRAFT,
    enum: AnnouncementStatus,
    description: 'Estado del anuncio',
  })
  @IsEnum(AnnouncementStatus, { message: 'El estado debe ser uno de: draft, published, expired.' })
  status: AnnouncementStatus;

  @ApiProperty({ example: 0, description: 'Cantidad de vistas', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de vistas debe ser un número entero.' })
  view?: number;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del usuario creador (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del grado (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El grado debe ser un UUID válido.' })
  grade?: string;
}
