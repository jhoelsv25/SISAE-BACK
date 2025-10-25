import { StatusType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsUUID } from 'class-validator';
import { Modality } from '../enums/section_course.enum';

export class CreateSectionCourseDto {
  @ApiProperty({ example: Modality.ONLINE, enum: Modality, description: 'Modalidad del curso' })
  @IsEnum(Modality, { message: 'La modalidad debe ser uno de: online, offline, hybrid.' })
  modality: Modality;

  @ApiProperty({ example: 30, description: 'Cantidad máxima de estudiantes' })
  @IsInt({ message: 'La cantidad máxima debe ser un número entero.' })
  maxStudents: number;

  @ApiProperty({ example: 25, description: 'Cantidad de estudiantes matriculados' })
  @IsInt({ message: 'La cantidad de estudiantes matriculados debe ser un número entero.' })
  enrolledStudents: number;

  @ApiProperty({
    example: StatusType.ACTIVE,
    enum: StatusType,
    description: 'Estado del curso-sección',
  })
  @IsEnum(StatusType, {
    message: 'El estado debe ser uno de: active, inactive, pending, suspended.',
  })
  status: StatusType;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID del año académico (UUID)',
  })
  @IsUUID('4', { message: 'El año académico debe ser un UUID válido.' })
  academicYear: string;

  @ApiProperty({
    example: 'b3e1c2d4-5f6a-4a7b-8c9d-0e1f2a3b4c5d',
    description: 'ID de la sección (UUID)',
  })
  @IsUUID('4', { message: 'La sección debe ser un UUID válido.' })
  section: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del curso (UUID)',
  })
  @IsUUID('4', { message: 'El curso debe ser un UUID válido.' })
  course: string;
}
