import { DayOfWeek } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 'Clase de Matemáticas', description: 'Título del horario' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({ example: DayOfWeek.MONDAY, enum: DayOfWeek, description: 'Día de la semana' })
  @IsEnum(DayOfWeek, {
    message:
      'El día debe ser uno de: sunday, monday, tuesday, wednesday, thursday, friday, saturday.',
  })
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: 'Clase de álgebra en el aula 101',
    description: 'Descripción del horario',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  description?: string;

  @ApiProperty({ example: '08:00', description: 'Hora de inicio' })
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  startAt: string;

  @ApiProperty({ example: '10:00', description: 'Hora de fin' })
  @IsString({ message: 'La hora de fin debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria.' })
  endAt: string;

  @ApiProperty({ example: 'Aula 101', description: 'Aula asignada' })
  @IsString({ message: 'El aula debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El aula es obligatoria.' })
  classroom: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sección-curso (UUID)',
  })
  @IsUUID('4', { message: 'La sección-curso debe ser un UUID válido.' })
  sectionCourse: string;
}
