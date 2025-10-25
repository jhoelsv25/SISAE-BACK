import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssessmentScoreDto {
  @ApiProperty({ example: 18.5, description: 'Puntaje obtenido en la evaluación' })
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'El puntaje debe ser un número decimal con hasta dos decimales.' },
  )
  @IsNotEmpty({ message: 'El puntaje es obligatorio.' })
  score: number;

  @ApiProperty({
    example: 'Buen desempeño',
    description: 'Observación sobre el puntaje',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La observación debe ser una cadena de texto.' })
  observation?: string;

  @ApiProperty({
    example: '2025-10-25T10:00:00Z',
    description: 'Fecha y hora de registro del puntaje',
  })
  @IsDateString({}, { message: 'La fecha de registro debe ser una fecha válida.' })
  registerAt: Date;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID de la matrícula (UUID)',
  })
  @IsUUID('4', { message: 'La matrícula debe ser un UUID válido.' })
  enrollment: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la evaluación (UUID)',
  })
  @IsUUID('4', { message: 'La evaluación debe ser un UUID válido.' })
  assessment: string;
}
