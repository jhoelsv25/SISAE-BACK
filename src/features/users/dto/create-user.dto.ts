import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiTags('users')
export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único para identificar al usuario',
    example: 'juan_perez',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
  })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  username: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario',
    example: 'juan.perez@example.com',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @MaxLength(100, { message: 'El correo electrónico no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123!',
    minLength: 8,
    maxLength: 100,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  password: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo en el sistema',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  isActive?: boolean;

  @ApiProperty({
    description: 'URL de la imagen de perfil del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La imagen de perfil debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La URL de la imagen no puede tener más de 255 caracteres' })
  profilePicture?: string;

  @ApiProperty({
    description: 'ID del rol asignado al usuario',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID(4, { message: 'El ID del rol debe ser un UUID válido' })
  roleId: string;
}
