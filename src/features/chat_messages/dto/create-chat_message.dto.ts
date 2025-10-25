import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ChatMessageType } from '../enums/chat_message.enum';

export class CreateChatMessageDto {
  @ApiProperty({ example: 'Hola, ¿cómo estás?', description: 'Contenido del mensaje' })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  content: string;

  @ApiProperty({
    example: ChatMessageType.TEXT,
    enum: ChatMessageType,
    description: 'Tipo de mensaje',
  })
  @IsEnum(ChatMessageType, { message: 'El tipo debe ser uno de: text, image, video.' })
  type: ChatMessageType;

  @ApiProperty({
    example: 'https://ejemplo.com/archivo.jpg',
    description: 'URL del archivo adjunto',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del archivo debe ser válida.' })
  fileUrl?: string;

  @ApiProperty({
    example: 'archivo.jpg',
    description: 'Nombre del archivo adjunto',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del archivo debe ser una cadena de texto.' })
  fileName?: string;

  @ApiProperty({ example: 1.5, description: 'Tamaño del archivo en MB', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El tamaño del archivo debe ser un número.' })
  fileSizeMB?: number;

  @ApiProperty({ example: false, description: '¿El mensaje fue editado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isEdited: boolean;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del mensaje al que responde (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de respuesta debe ser un UUID válido.' })
  replyTo?: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sala de chat (UUID)',
  })
  @IsUUID('4', { message: 'La sala de chat debe ser un UUID válido.' })
  chatRoom: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del usuario (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;
}
