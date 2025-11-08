import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateForumThreadDto } from './dto/create-forum_thread.dto';
import { UpdateForumThreadDto } from './dto/update-forum_thread.dto';
import { ForumThreadEntity } from './entities/forum_thread.entity';

@Injectable()
export class ForumThreadsService {
  constructor(
    @InjectRepository(ForumThreadEntity)
    private readonly forumThreadRepository: Repository<ForumThreadEntity>,
  ) {}

  async create(dto: CreateForumThreadDto) {
    try {
      // Map 'user' and 'forum' from string (IDs) to objects with id property
      const { user, forum, ...rest } = dto;
      const forumThread = this.forumThreadRepository.create({
        ...rest,
        user: user ? { id: user } : undefined,
        forum: forum ? { id: forum } : undefined,
      });
      await this.forumThreadRepository.save(forumThread);
      return { message: 'Hilo del foro creado correctamente', data: forumThread };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el hilo del foro', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const forumThreads = await this.forumThreadRepository.find({ where: filter });
      return forumThreads;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los hilos del foro', 500);
    }
  }

  async findOne(id: string) {
    try {
      const forumThread = await this.forumThreadRepository.findOne({ where: { id } });
      if (!forumThread) {
        throw new ErrorHandler('Hilo del foro no encontrado', 404);
      }
      return forumThread;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el hilo del foro', 500);
    }
  }

  async update(id: string, dto: UpdateForumThreadDto) {
    try {
      const forumThread = await this.forumThreadRepository.findOne({ where: { id } });
      if (!forumThread) {
        throw new ErrorHandler('Hilo del foro no encontrado', 404);
      }
      const { user, forum, ...restDto } = dto;
      this.forumThreadRepository.merge(forumThread, {
        ...restDto,
        user: user ? { id: user } : undefined,
        forum: forum ? { id: forum } : undefined,
      });
      await this.forumThreadRepository.save(forumThread);
      return { message: 'Hilo del foro actualizado correctamente', data: forumThread };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el hilo del foro', 500);
    }
  }

  async remove(id: string) {
    try {
      const forumThread = await this.forumThreadRepository.findOne({ where: { id } });
      if (!forumThread) {
        throw new ErrorHandler('Hilo del foro no encontrado', 404);
      }
      await this.forumThreadRepository.remove(forumThread);
      return { message: 'Hilo del foro eliminado correctamente', data: forumThread };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el hilo del foro', 500);
    }
  }
}
