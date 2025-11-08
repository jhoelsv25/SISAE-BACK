import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateForumThreadDto {
  @ApiProperty({
    example: '¿Cómo resolver el ejercicio 5?',
    description: 'Título del hilo del foro',
  })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    example: 'Tengo dudas sobre el ejercicio 5 del capítulo 2.',
    description: 'Contenido del hilo del foro',
  })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  content: string;

  @ApiProperty({ example: true, description: '¿El hilo está fijado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isPinned: boolean;

  @ApiProperty({ example: 0, description: 'Cantidad de respuestas', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de respuestas debe ser un número entero.' })
  replyCount?: number;

  @ApiProperty({ example: false, description: '¿El hilo está bloqueado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isLocked: boolean;

  @ApiProperty({ example: 0, description: 'Cantidad de vistas', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de vistas debe ser un número entero.' })
  viewCount?: number;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del usuario (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del foro (UUID)',
  })
  @IsUUID('4', { message: 'El foro debe ser un UUID válido.' })
  forum: string;
}
