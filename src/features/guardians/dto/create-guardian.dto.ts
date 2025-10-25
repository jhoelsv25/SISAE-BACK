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
import { GuardianRelationship } from '../enums/guardian.enum';

export class CreateGuardianDto {
  @ApiProperty({ example: 'Ingeniero', description: 'Ocupación del tutor' })
  @IsString({ message: 'La ocupación debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La ocupación es obligatoria.' })
  occupation: string;

  @ApiProperty({ example: 'Empresa XYZ', description: 'Lugar de trabajo del tutor' })
  @IsString({ message: 'El lugar de trabajo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El lugar de trabajo es obligatorio.' })
  workplace: string;

  @ApiProperty({
    example: 'Av. Principal 123',
    description: 'Dirección del lugar de trabajo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  workplaceAddress?: string;

  @ApiProperty({
    example: '555-1234',
    description: 'Teléfono del lugar de trabajo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  workplacePhone?: string;

  @ApiProperty({ example: 'Universitario', description: 'Nivel educativo del tutor' })
  @IsString({ message: 'El nivel educativo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nivel educativo es obligatorio.' })
  educationLevel: string;

  @ApiProperty({ example: 2500, description: 'Ingreso mensual en moneda local' })
  @IsInt({ message: 'El ingreso mensual debe ser un número entero.' })
  monthlyIncome: number;

  @ApiProperty({ example: true, description: '¿Vive con el estudiante?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  livesWithStudent: boolean;

  @ApiProperty({ example: true, description: '¿Es el tutor principal?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isPrimaryGuardian: boolean;

  @ApiProperty({
    example: GuardianRelationship.PARENT,
    enum: GuardianRelationship,
    description: 'Relación con el estudiante',
  })
  @IsEnum(GuardianRelationship, {
    message: 'La relación debe ser uno de: parent, guardian, other.',
  })
  relationship: GuardianRelationship;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la persona (UUID)',
  })
  @IsUUID('4', { message: 'La persona debe ser un UUID válido.' })
  person: string;
}
