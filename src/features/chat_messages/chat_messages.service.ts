import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateChatMessageDto } from './dto/create-chat_message.dto';
import { UpdateChatMessageDto } from './dto/update-chat_message.dto';
import { ChatMessageEntity } from './entities/chat_message.entity';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly repo: Repository<ChatMessageEntity>,
  ) {}

  async create(dto: CreateChatMessageDto) {
    try {
      // Ensure replyTo, chatRoom, and user are set as expected by ChatMessageEntity
      const { replyTo, chatRoom, user, ...rest } = dto;
      const chatMessage = this.repo.create({
        ...rest,
        chatRoom: chatRoom ? { id: chatRoom } : undefined,
        user: user ? { id: user } : undefined,
        replyTo: replyTo ? { id: replyTo } : undefined,
      });
      await this.repo.save(chatMessage);
      return chatMessage;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el chat message', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const chatMessages = await this.repo.find({ where: filter });
      return chatMessages;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los chat messages', 500);
    }
  }

  async findOne(id: string) {
    try {
      const chatMessage = await this.repo.findOne({ where: { id } });
      if (!chatMessage) {
        throw new ErrorHandler('Chat message no encontrado', 404);
      }
      return chatMessage;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el chat message', 500);
    }
  }

  async update(id: string, dto: UpdateChatMessageDto) {
    try {
      const chatMessage = await this.repo.findOne({ where: { id } });
      if (!chatMessage) {
        throw new ErrorHandler('Chat message no encontrado', 404);
      }
      const { replyTo, chatRoom, user, ...rest } = dto;
      this.repo.merge(chatMessage, {
        ...rest,
        chatRoom: chatRoom ? { id: chatRoom } : undefined,
        user: user ? { id: user } : undefined,
        replyTo: replyTo ? { id: replyTo } : undefined,
      });
      await this.repo.save(chatMessage);
      return chatMessage;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el chat message', 500);
    }
  }

  async remove(id: string) {
    try {
      const chatMessage = await this.repo.findOne({ where: { id } });
      if (!chatMessage) {
        throw new ErrorHandler('Chat message no encontrado', 404);
      }
      await this.repo.remove(chatMessage);
      return { message: 'Chat message eliminado con éxito' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el chat message', 500);
    }
  }
}
