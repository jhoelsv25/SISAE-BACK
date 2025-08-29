import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'La nueva contraseña del usuario',
    example: 'NuevaContraseña123!',
    minLength: 6,
  })
  @IsString({ message: 'La nueva contraseña es requerida' })
  @MinLength(6)
  newPassword: string;

  @ApiProperty({
    description: 'La contraseña actual del usuario',
    example: 'ContraseñaActual123!',
    minLength: 6,
  })
  @IsString({ message: 'La contraseña actual es requerida' })
  currentPassword: string;
}
