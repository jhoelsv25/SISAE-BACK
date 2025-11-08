import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatParticipantsController } from './chat_participants.controller';
import { ChatParticipantsService } from './chat_participants.service';
import { ChatParticipantEntity } from './entities/chat_participant.entity';

@Module({
  controllers: [ChatParticipantsController],
  providers: [ChatParticipantsService],
  imports: [TypeOrmModule.forFeature([ChatParticipantEntity])],
})
export class ChatParticipantsModule {}
