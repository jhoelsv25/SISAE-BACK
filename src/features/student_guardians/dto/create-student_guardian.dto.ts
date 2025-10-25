import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStudentGuardianDto {
  @ApiProperty({ example: true, description: 'Indica si es el tutor principal.' })
  @IsBoolean({ message: 'El campo isPrimary debe ser booleano.' })
  isPrimary: boolean;

  @ApiProperty({ example: true, description: 'Autorización para recoger al estudiante.' })
  @IsBoolean({ message: 'El campo pickupAuthorization debe ser booleano.' })
  pickupAuthorization: boolean;

  @ApiProperty({
    example: 'email, teléfono',
    description: 'Medios por los cuales recibe notificaciones.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El campo receivesNotifications debe ser una cadena de texto.' })
  receivesNotifications?: string;

  @ApiProperty({ example: true, description: 'Indica si es contacto de emergencia.' })
  @IsBoolean({ message: 'El campo emergencyContact debe ser booleano.' })
  emergencyContact: boolean;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID del estudiante.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del estudiante debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del estudiante debe ser un UUID válido.' })
  student: string;

  @ApiProperty({
    example: 'b7e6c8a2-1d2f-4c3b-9e2a-123456789abc',
    description: 'ID del tutor.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del tutor debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del tutor debe ser un UUID válido.' })
  guardian: string;
}
