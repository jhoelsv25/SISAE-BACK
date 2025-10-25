import { StatusType } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PlatformType, VirtualClassroomType } from '../enums/virtual_classroom.enum';

export class CreateVirtualClassroomDto {
  @ApiProperty({
    example: 'ZOOM',
    enum: PlatformType,
    description: 'Plataforma de la aula virtual.',
  })
  @IsEnum(PlatformType, { message: 'La plataforma debe ser válida.' })
  platform: PlatformType;

  @ApiProperty({
    example: 'https://zoom.us/j/123456789',
    description: 'URL de acceso a la aula virtual.',
  })
  @IsString({ message: 'La URL de acceso debe ser una cadena de texto.' })
  accessUrl: string;

  @ApiProperty({ example: '123456', description: 'Código de acceso a la aula virtual.' })
  @IsString({ message: 'El código de acceso debe ser una cadena de texto.' })
  accessCode: string;

  @ApiProperty({ example: 'abc123', description: 'Contraseña de acceso a la aula virtual.' })
  @IsString({ message: 'La contraseña de acceso debe ser una cadena de texto.' })
  accessPassword: string;

  @ApiProperty({
    example: 'CLASE',
    enum: VirtualClassroomType,
    description: 'Tipo de aula virtual.',
  })
  @IsEnum(VirtualClassroomType, { message: 'El tipo de aula virtual debe ser válido.' })
  type: VirtualClassroomType;

  @ApiProperty({ example: '987654321', description: 'ID de la reunión.' })
  @IsString({ message: 'El ID de la reunión debe ser una cadena de texto.' })
  meetingId: string;

  @ApiProperty({
    example: { waitingRoom: true },
    description: 'Configuraciones adicionales de la aula virtual.',
    required: false,
  })
  @IsOptional()
  settings?: any;

  @ApiProperty({
    example: 'activo',
    enum: StatusType,
    description: 'Estado de la aula virtual.',
    default: StatusType.ACTIVE,
  })
  @IsEnum(StatusType, { message: 'El estado debe ser válido.' })
  @IsOptional()
  status?: StatusType;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-0987654321ab',
    description: 'ID de la relación sección-curso.',
    type: 'string',
    format: 'uuid',
  })
  @IsString({ message: 'El ID de la sección-curso debe ser una cadena UUID.' })
  @IsUUID('4', { message: 'El ID de la sección-curso debe ser un UUID válido.' })
  sectionCourse: string;
}
