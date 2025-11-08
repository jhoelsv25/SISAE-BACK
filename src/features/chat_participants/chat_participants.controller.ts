import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ChatParticipantsService } from './chat_participants.service';
import { CreateChatParticipantDto } from './dto/create-chat_participant.dto';
import { UpdateChatParticipantDto } from './dto/update-chat_participant.dto';

@Controller('chat-participants')
export class ChatParticipantsController {
  constructor(private readonly chatParticipantsService: ChatParticipantsService) {}

  @Post()
  create(@Body() dto: CreateChatParticipantDto) {
    return this.chatParticipantsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.chatParticipantsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatParticipantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChatParticipantDto) {
    return this.chatParticipantsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatParticipantsService.remove(id);
  }
}
