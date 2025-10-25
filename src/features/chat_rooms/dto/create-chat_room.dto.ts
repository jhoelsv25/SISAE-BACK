import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ChatRoomType } from '../enums/chat_room.enum';

export class CreateChatRoomDto {
  @ApiProperty({ example: 'Sala de Matemáticas', description: 'Nombre de la sala de chat' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({
    example: ChatRoomType.GROUP,
    enum: ChatRoomType,
    description: 'Tipo de sala de chat',
  })
  @IsEnum(ChatRoomType, { message: 'El tipo debe ser uno de: private, group.' })
  type: ChatRoomType;

  @ApiProperty({
    example: 'Sala para discutir ejercicios de matemáticas',
    description: 'Descripción de la sala',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: 30, description: 'Cantidad máxima de miembros', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad máxima de miembros debe ser un número entero.' })
  maxMembers?: number;

  @ApiProperty({ example: true, description: '¿La sala está activa?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isActive: boolean;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse?: string;
}
