import { StatusType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { SectionShift } from '../enums/section.enum';

export class CreateSectionDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value == null) return undefined;
    const n = Number(value);
    if (Number.isNaN(n)) return undefined;
    const int = Math.floor(n);
    return int >= 1 && int <= 100 ? int : undefined;
  })
  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  @Min(1, { message: 'La capacidad debe ser al menos 1.' })
  @Max(100, { message: 'La capacidad no puede ser mayor a 100.' })
  capacity?: number;

  @ApiProperty({
    example: 'activo',
    enum: StatusType,
    description: 'Estado de la sección',
    default: StatusType.ACTIVE,
  })
  @IsEnum(StatusType, { message: 'El estado debe ser válido.' })
  @IsOptional()
  status?: StatusType;

  @ApiProperty({
    example: 'morning',
    enum: SectionShift,
    description: 'Turno de la sección',
    default: SectionShift.MORNING,
  })
  @IsEnum(SectionShift, { message: 'El turno debe ser válido.' })
  @IsOptional()
  shift?: SectionShift;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del tutor de la sección',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del tutor debe ser una cadena de texto.' })
  tutor?: string;

  @ApiProperty({ example: 'Aula 101', description: 'Nombre del aula asignada', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre del aula debe ser una cadena de texto.' })
  classroom?: string;

  @ApiProperty({
    example: 10,
    description: 'Cantidad de espacios disponibles en la sección',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value == null) return 0;
    const n = Number(value);
    return Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
  })
  @IsInt({ message: 'Los espacios disponibles deben ser un número entero.' })
  @Min(0, { message: 'Los espacios disponibles no pueden ser negativos.' })
  availableSlots?: number;

  @ApiProperty({
    example: 'b7e6c8a2-1d2f-4c3b-9e2a-123456789abc',
    description: 'ID del grado académico',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del grado debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del grado debe ser un UUID válido.' })
  grade: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID del año académico',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID del año académico debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID del año académico debe ser un UUID válido.' })
  yearAcademic: string;
}
