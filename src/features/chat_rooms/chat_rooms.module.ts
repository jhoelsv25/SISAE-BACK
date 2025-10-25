import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsController } from './chat_rooms.controller';
import { ChatRoomsService } from './chat_rooms.service';
import { ChatRoomEntity } from './entities/chat_room.entity';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  imports: [TypeOrmModule.forFeature([ChatRoomEntity])],
})
export class ChatRoomsModule {}
