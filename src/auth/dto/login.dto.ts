import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'El nombre de usuario del usuario',
    example: 'john_doe',
  })
  @IsNotEmpty({ message: 'El campo username es obligatorio' })
  @IsString({ message: 'El campo username debe ser una cadena de texto' })
  username: string;

  @ApiProperty({
    description: 'La contraseña del usuario',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  @IsString({ message: 'El campo password debe ser una cadena de texto' })
  password: string;
}
