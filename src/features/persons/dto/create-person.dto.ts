import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentType, Gender, MaterialStatus } from '../enums/person.enum';

export class CreatePersonDto {
  @ApiProperty({ example: DocumentType.DNI, enum: DocumentType, description: 'Tipo de documento' })
  @IsEnum(DocumentType, { message: 'El tipo de documento debe ser uno de: dni, passport, other.' })
  documentType: DocumentType;

  @ApiProperty({ example: 'Juan', description: 'Nombres de la persona' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos de la persona' })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  lastName: string;

  @ApiProperty({ example: '2000-01-01', description: 'Fecha de nacimiento' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida.' })
  birthDate: Date;

  @ApiProperty({ example: Gender.MALE, enum: Gender, description: 'Género de la persona' })
  @IsEnum(Gender, { message: 'El género debe ser uno de: MALE, FEMALE, OTHER.' })
  gender: Gender;

  @ApiProperty({ example: 'Lima', description: 'Lugar de nacimiento' })
  @IsString({ message: 'El lugar de nacimiento debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El lugar de nacimiento es obligatorio.' })
  birthPlace: string;

  @ApiProperty({ example: 'Peruana', description: 'Nacionalidad' })
  @IsString({ message: 'La nacionalidad debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La nacionalidad es obligatoria.' })
  nationality: string;

  @ApiProperty({ example: 'Av. Principal 123', description: 'Dirección de la persona' })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  address: string;

  @ApiProperty({ example: 'Miraflores', description: 'Distrito de la persona' })
  @IsString({ message: 'El distrito debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El distrito es obligatorio.' })
  district: string;

  @ApiProperty({ example: 'Lima', description: 'Provincia de la persona' })
  @IsString({ message: 'La provincia debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La provincia es obligatoria.' })
  province: string;

  @ApiProperty({ example: 'Lima', description: 'Departamento de la persona' })
  @IsString({ message: 'El departamento debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El departamento es obligatorio.' })
  department: string;

  @ApiProperty({ example: '555-1234', description: 'Teléfono de la persona' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @ApiProperty({ example: '999-999999', description: 'Celular de la persona' })
  @IsString({ message: 'El celular debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El celular es obligatorio.' })
  mobile: string;

  @ApiProperty({ example: 'persona@ejemplo.com', description: 'Correo electrónico de la persona' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  @ApiProperty({
    example: 'https://ejemplo.com/foto.jpg',
    description: 'URL de la foto',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL de la foto debe ser una cadena de texto.' })
  photoUrl?: string;

  @ApiProperty({
    example: MaterialStatus.SINGLE,
    enum: MaterialStatus,
    description: 'Estado civil de la persona',
  })
  @IsEnum(MaterialStatus, {
    message: 'El estado civil debe ser uno de: SINGLE, MARRIED, DIVORCED, WIDOWED.',
  })
  materialStatus: MaterialStatus;
}
