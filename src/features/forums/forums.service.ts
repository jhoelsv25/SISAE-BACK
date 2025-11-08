import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumEntity } from './entities/forum.entity';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(ForumEntity)
    private readonly forumRepository: Repository<ForumEntity>,
  ) {}

  async create(dto: CreateForumDto) {
    try {
      const forum = this.forumRepository.create({
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        module: dto.module ? { id: dto.module } : undefined,
      });
      await this.forumRepository.save(forum);
      return { message: 'Foro creado correctamente', data: forum };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el foro', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const forums = await this.forumRepository.find({ where: filter });
      return forums;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los foros', 500);
    }
  }

  async findOne(id: string) {
    try {
      const forum = await this.forumRepository.findOne({ where: { id } });
      if (!forum) {
        throw new ErrorHandler('Foro no encontrado', 404);
      }
      return { message: 'Foro encontrado correctamente', data: forum };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el foro', 500);
    }
  }

  async update(id: string, dto: UpdateForumDto) {
    try {
      const forum = await this.forumRepository.findOne({ where: { id } });
      if (!forum) {
        throw new ErrorHandler('Foro no encontrado', 404);
      }
      this.forumRepository.merge(forum, {
        ...dto,
        sectionCourse: dto.sectionCourse ? { id: dto.sectionCourse } : undefined,
        module: dto.module ? { id: dto.module } : undefined,
      });
      await this.forumRepository.save(forum);
      return { message: 'Foro actualizado correctamente', data: forum };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el foro', 500);
    }
  }

  async remove(id: string) {
    try {
      const forum = await this.forumRepository.findOne({ where: { id } });
      if (!forum) {
        throw new ErrorHandler('Foro no encontrado', 404);
      }
      await this.forumRepository.remove(forum);
      return { message: 'Foro eliminado correctamente', data: forum };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el foro', 500);
    }
  }
}
