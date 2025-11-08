import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatMessagesService } from './chat_messages.service';
import { CreateChatMessageDto } from './dto/create-chat_message.dto';
import { UpdateChatMessageDto } from './dto/update-chat_message.dto';

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Post()
  create(@Body() dto: CreateChatMessageDto) {
    return this.chatMessagesService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.chatMessagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatMessagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChatMessageDto) {
    return this.chatMessagesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatMessagesService.remove(id);
  }
}
