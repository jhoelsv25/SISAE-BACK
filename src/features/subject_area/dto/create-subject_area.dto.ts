import { StatusType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubjectAreaType } from '../enums/subject_area.enum';

export class CreateSubjectAreaDto {
  @ApiProperty({ example: 'Matemáticas', description: 'Nombre del área de conocimiento.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MaxLength(100, { message: 'El nombre no debe exceder 100 caracteres.' })
  name: string;

  @ApiProperty({ example: 'MAT', description: 'Código único del área.', maxLength: 20 })
  @IsString({ message: 'El código debe ser una cadena de texto.' })
  @MaxLength(20, { message: 'El código no debe exceder 20 caracteres.' })
  code: string;

  @ApiProperty({
    example: 'Área dedicada al estudio de las matemáticas.',
    description: 'Descripción del área.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({
    example: 'CIENCIAS',
    enum: SubjectAreaType,
    description: 'Tipo de área de conocimiento.',
  })
  @IsEnum(SubjectAreaType, { message: 'El tipo de área debe ser válido.' })
  type: SubjectAreaType;

  @ApiProperty({
    example: 'activo',
    enum: StatusType,
    description: 'Estado del área de conocimiento.',
    default: StatusType.ACTIVE,
  })
  @IsEnum(StatusType, { message: 'El estado debe ser válido.' })
  @IsOptional()
  status?: StatusType;
}
