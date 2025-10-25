import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty({ example: 'Colegio Nacional', description: 'Nombre de la institución' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({ example: 'MOD12345', description: 'Código modular único' })
  @IsString({ message: 'El código modular debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El código modular es obligatorio.' })
  modularCode: string;

  @ApiProperty({ example: 'Pública', description: 'Tipo de gestión' })
  @IsString({ message: 'El tipo de gestión debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de gestión es obligatorio.' })
  managementType: string;

  @ApiProperty({ example: 'UGEL Lima', description: 'UGEL de la institución' })
  @IsString({ message: 'La UGEL debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La UGEL es obligatoria.' })
  ugel: string;

  @ApiProperty({ example: 'DRE Lima', description: 'DRE de la institución' })
  @IsString({ message: 'La DRE debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La DRE es obligatoria.' })
  dre: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del director' })
  @IsString({ message: 'El nombre del director debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del director es obligatorio.' })
  principal: string;

  @ApiProperty({ example: 'Av. Principal 123', description: 'Dirección de la institución' })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  address: string;

  @ApiProperty({ example: 'Miraflores', description: 'Distrito de la institución' })
  @IsString({ message: 'El distrito debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El distrito es obligatorio.' })
  district: string;

  @ApiProperty({ example: 'Lima', description: 'Provincia de la institución' })
  @IsString({ message: 'La provincia debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La provincia es obligatoria.' })
  province: string;

  @ApiProperty({ example: 'Lima', description: 'Departamento de la institución' })
  @IsString({ message: 'El departamento debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El departamento es obligatorio.' })
  department: string;

  @ApiProperty({ example: '555-1234', description: 'Teléfono de la institución' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  phone: string;

  @ApiProperty({
    example: 'colegio@ejemplo.com',
    description: 'Correo electrónico de la institución',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  @ApiProperty({ example: 'activo', description: 'Estado de la institución' })
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El estado es obligatorio.' })
  status: string;

  @ApiProperty({
    example: 'https://ejemplo.com/logo.png',
    description: 'URL del logo de la institución',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL del logo debe ser una cadena de texto.' })
  logoUrl?: string;

  @ApiProperty({
    example: 'Institución educativa de prestigio',
    description: 'Descripción de la institución',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;
}
