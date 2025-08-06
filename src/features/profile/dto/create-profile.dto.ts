import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BloodType, Gender, MaritalStatus } from '../entities/profile.entity';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Nombre(s) de la persona',
    example: 'Juan Carlos',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({
    description: 'Apellido(s) de la persona',
    example: 'Pérez González',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({
    description: 'Segundo nombre o nombres intermedios',
    example: 'Eduardo',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El segundo nombre no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  middleName?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({
    description: 'Género de la persona',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'El género debe ser uno de los valores permitidos' })
  gender?: Gender;

  @ApiProperty({
    description: 'Número de documento de identidad',
    example: '12345678',
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @MaxLength(20, { message: 'El número de documento no puede tener más de 20 caracteres' })
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'El número de documento solo puede contener letras, números y guiones',
  })
  @Transform(({ value }) => value?.trim())
  documentNumber?: string;

  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: 'DNI',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El tipo de documento no puede tener más de 50 caracteres' })
  @Transform(({ value }) => value?.trim())
  documentType?: string;

  @ApiProperty({
    description: 'Número de teléfono principal',
    example: '+51987654321',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El teléfono no puede tener más de 50 caracteres' })
  @Matches(/^[\+]?[0-9\s\-\(\)]+$/, {
    message: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y el signo +',
  })
  @Transform(({ value }) => value?.trim())
  phoneNumber?: string;

  @ApiProperty({
    description: 'Dirección de residencia',
    example: 'Av. Principal 123, San Isidro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @ApiProperty({
    description: 'Ciudad de residencia',
    example: 'Lima',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La ciudad no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @ApiProperty({
    description: 'País de residencia',
    example: 'Perú',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El país no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @ApiProperty({
    description: 'Tipo de sangre',
    enum: BloodType,
    example: BloodType.O_POSITIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(BloodType, { message: 'El tipo de sangre debe ser uno de los valores permitidos' })
  bloodType?: BloodType;

  @ApiProperty({
    description: 'Estado civil',
    enum: MaritalStatus,
    example: MaritalStatus.SINGLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'El estado civil debe ser uno de los valores permitidos' })
  maritalStatus?: MaritalStatus;

  @ApiProperty({
    description: 'Nombre del contacto de emergencia',
    example: 'María Pérez',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del contacto debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre del contacto no puede tener más de 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  emergencyContactName?: string;

  @ApiProperty({
    description: 'Teléfono del contacto de emergencia',
    example: '+51987654321',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono del contacto debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El teléfono del contacto no puede tener más de 50 caracteres' })
  @Matches(/^[\+]?[0-9\s\-\(\)]+$/, {
    message: 'El teléfono debe contener solo números, espacios, guiones, paréntesis y el signo +',
  })
  @Transform(({ value }) => value?.trim())
  emergencyContactPhone?: string;

  @ApiProperty({
    description: 'Indica si el perfil es público',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'La visibilidad del perfil debe ser verdadero o falso' })
  isPublic?: boolean;

  @ApiProperty({
    description: 'Permite recibir notificaciones',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Las notificaciones deben ser verdadero o falso' })
  allowNotifications?: boolean;

  @ApiProperty({
    description: 'ID del usuario asociado al perfil',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID(4, { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;
}
