import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateChatParticipantDto } from './dto/create-chat_participant.dto';
import { UpdateChatParticipantDto } from './dto/update-chat_participant.dto';
import { ChatParticipantEntity } from './entities/chat_participant.entity';

@Injectable()
export class ChatParticipantsService {
  constructor(
    @InjectRepository(ChatParticipantEntity)
    private readonly repo: Repository<ChatParticipantEntity>,
  ) {}

  async create(dto: CreateChatParticipantDto) {
    try {
      // Convert chatRoom from string (ID) to object reference
      const { chatRoom, ...rest } = dto;
      const chatParticipant = this.repo.create({
        ...rest,
        chatRoom: { id: chatRoom }, // assumes chatRoom is an ID string
        user: { id: rest.user }, // assumes user is an ID string
      });
      await this.repo.save(chatParticipant);
      return { message: 'Chat participant creado correctamente', data: chatParticipant };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el chat participant', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const chatParticipants = await this.repo.find({ where: filter });
      return { message: 'Chat participants retrieved successfully', data: chatParticipants };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los chat participants', 500);
    }
  }

  async findOne(id: string) {
    try {
      const chatParticipant = await this.repo.findOne({ where: { id } });
      if (!chatParticipant) {
        throw new ErrorHandler('Chat participant no encontrado', 404);
      }
      return { message: 'Chat participant retrieved successfully', data: chatParticipant };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el chat participant', 500);
    }
  }

  async update(id: string, dto: UpdateChatParticipantDto) {
    try {
      const chatParticipant = await this.repo.findOne({ where: { id } });
      if (!chatParticipant) {
        throw new ErrorHandler('Chat participant no encontrado', 404);
      }
      this.repo.merge(chatParticipant, {
        ...dto,
        chatRoom: dto.chatRoom ? { id: dto.chatRoom } : undefined,
        user: dto.user ? { id: dto.user } : undefined,
      });
      await this.repo.save(chatParticipant);
      return { message: 'Chat participant updated successfully', data: chatParticipant };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el chat participant', 500);
    }
  }

  async remove(id: string) {
    try {
      const chatParticipant = await this.repo.findOne({ where: { id } });
      if (!chatParticipant) {
        throw new ErrorHandler('Chat participant no encontrado', 404);
      }
      await this.repo.remove(chatParticipant);
      return { message: 'Chat participant removed successfully', data: chatParticipant };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el chat participant', 500);
    }
  }
}
