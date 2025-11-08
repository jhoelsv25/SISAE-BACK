import { PartialType } from '@nestjs/swagger';
import { CreateChatParticipantDto } from './create-chat_participant.dto';

export class UpdateChatParticipantDto extends PartialType(CreateChatParticipantDto) {}
