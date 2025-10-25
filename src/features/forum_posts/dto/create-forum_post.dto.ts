import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateForumPostDto {
  @ApiProperty({ example: 'Este es el contenido del post', description: 'Contenido del post' })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  content: string;

  @ApiProperty({
    example: 'https://ejemplo.com/archivo.pdf',
    description: 'URL del archivo adjunto',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del archivo adjunto debe ser válida.' })
  attachmentUrl?: string;

  @ApiProperty({ example: 0, description: 'Cantidad de likes', required: false })
  @IsOptional()
  @IsInt({ message: 'La cantidad de likes debe ser un número entero.' })
  likes?: number;

  @ApiProperty({ example: false, description: '¿Es solución al hilo?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isSolution: boolean;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID del post padre (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El post padre debe ser un UUID válido.' })
  parentPost?: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del hilo del foro (UUID)',
  })
  @IsUUID('4', { message: 'El hilo del foro debe ser un UUID válido.' })
  forumThread: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del usuario (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;
}
