import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesController } from './chat_messages.controller';
import { ChatMessagesService } from './chat_messages.service';
import { ChatMessageEntity } from './entities/chat_message.entity';

@Module({
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  imports: [TypeOrmModule.forFeature([ChatMessageEntity])],
})
export class ChatMessagesModule {}
