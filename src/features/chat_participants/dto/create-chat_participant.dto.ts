import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ChatParticipantRole } from '../enums/chat_participant.enum';

export class CreateChatParticipantDto {
  @ApiProperty({ example: '2025-10-25T10:00:00Z', description: 'Fecha de ingreso al chat' })
  @IsDateString({}, { message: 'La fecha de ingreso debe ser una fecha válida.' })
  joinDate: Date;

  @ApiProperty({
    example: '2025-10-26T10:00:00Z',
    description: 'Fecha de última lectura',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de última lectura debe ser una fecha válida.' })
  lastReadAt?: Date;

  @ApiProperty({ example: false, description: '¿El participante está silenciado?' })
  @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
  isMuted: boolean;

  @ApiProperty({
    example: ChatParticipantRole.MEMBER,
    enum: ChatParticipantRole,
    description: 'Rol del participante',
  })
  @IsEnum(ChatParticipantRole, { message: 'El rol debe ser uno de: admin, member.' })
  role: ChatParticipantRole;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la sala de chat (UUID)',
  })
  @IsUUID('4', { message: 'La sala de chat debe ser un UUID válido.' })
  chatRoom: string;

  @ApiProperty({
    example: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    description: 'ID del usuario (UUID)',
  })
  @IsUUID('4', { message: 'El usuario debe ser un UUID válido.' })
  user: string;
}
