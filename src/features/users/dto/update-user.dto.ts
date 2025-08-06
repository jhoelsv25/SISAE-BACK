import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
  @ApiProperty({
    description: 'Nombre de usuario único para identificar al usuario',
    example: 'juan_perez',
    minLength: 3,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre de usuario no puede tener más de 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos',
  })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  username?: string;

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
    description: 'Indica si el usuario está activo en el sistema',
    example: true,
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
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del rol debe ser un UUID válido' })
  roleId?: string;

  @ApiProperty({
    description: 'Fecha y hora del último login',
    example: '2025-08-06T14:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de último login debe ser una fecha válida' })
  lastLogin?: Date;
}
