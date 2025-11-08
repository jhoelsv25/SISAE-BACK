import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatRoomsService } from './chat_rooms.service';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Post()
  create(@Body() dto: CreateChatRoomDto) {
    return this.chatRoomsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.chatRoomsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatRoomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChatRoomDto) {
    return this.chatRoomsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatRoomsService.remove(id);
  }
}
