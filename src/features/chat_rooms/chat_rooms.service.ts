import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { ChatRoomEntity } from './entities/chat_room.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private readonly repo: Repository<ChatRoomEntity>,
  ) {}
  async create(dto: CreateChatRoomDto) {
    try {
      // Convert sectionCourse string to object if necessary
      const entityData: any = { ...dto };
      if (dto.sectionCourse) {
        entityData.sectionCourse = { id: dto.sectionCourse };
      }
      const chatRoom = this.repo.create(entityData);
      await this.repo.save(chatRoom);
      return { message: 'Chat room creado correctamente', data: chatRoom };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el chat room', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const chatRooms = await this.repo.find({ where: filter });
      return { message: 'Chat rooms retrieved successfully', data: chatRooms };
    } catch (error) {
      throw new ErrorHandler('Error retrieving chat rooms', 500);
    }
  }

  async findOne(id: string) {
    try {
      const chatRoom = await this.repo.findOne({ where: { id } });
      if (!chatRoom) {
        throw new ErrorHandler('Chat room not found', 404);
      }
      return { message: 'Chat room retrieved successfully', data: chatRoom };
    } catch (error) {
      throw new ErrorHandler('Error retrieving chat room', 500);
    }
  }

  async update(id: string, dto: UpdateChatRoomDto) {
    try {
      // Convert sectionCourse string to object if necessary
      const entityData: any = { ...dto };
      if (dto.sectionCourse) {
        entityData.sectionCourse = { id: dto.sectionCourse };
      }
      await this.repo.update(id, entityData);
      const updatedChatRoom = await this.repo.findOne({ where: { id } });
      return { message: 'Chat room updated successfully', data: updatedChatRoom };
    } catch (error) {
      throw new ErrorHandler('Error updating chat room', 500);
    }
  }

  async remove(id: string) {
    try {
      const chatRoom = await this.repo.findOne({ where: { id } });
      if (!chatRoom) {
        throw new ErrorHandler('Chat room not found', 404);
      }
      await this.repo.remove(chatRoom);
      return { message: 'Chat room removed successfully', data: chatRoom };
    } catch (error) {
      throw new ErrorHandler('Error removing chat room', 500);
    }
  }
}
