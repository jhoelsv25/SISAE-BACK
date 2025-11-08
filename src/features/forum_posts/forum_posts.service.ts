import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateForumPostDto } from './dto/create-forum_post.dto';
import { UpdateForumPostDto } from './dto/update-forum_post.dto';
import { ForumPostEntity } from './entities/forum_post.entity';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPostEntity)
    private readonly repo: Repository<ForumPostEntity>,
  ) {}

  async create(dto: CreateForumPostDto) {
    try {
      const forumPost = this.repo.create({
        ...dto,
        parentPost: dto.parentPost ? { id: dto.parentPost } : undefined,
        forumThread: dto.forumThread ? { id: dto.forumThread } : undefined,
        user: dto.user ? { id: dto.user } : undefined,
      });
      await this.repo.save(forumPost);
      return { message: 'Publicación del foro creada correctamente', data: forumPost };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la publicación del foro', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const forumPosts = await this.repo.find({ where: filter });
      return forumPosts;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las publicaciones del foro', 500);
    }
  }

  async findOne(id: string) {
    try {
      const forumPost = await this.repo.findOne({ where: { id } });
      if (!forumPost) {
        throw new ErrorHandler('Publicación del foro no encontrada', 404);
      }
      return forumPost;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la publicación del foro', 500);
    }
  }

  async update(id: string, dto: UpdateForumPostDto) {
    try {
      const forumPost = await this.repo.findOne({ where: { id } });
      if (!forumPost) {
        throw new ErrorHandler('Publicación del foro no encontrada', 404);
      }
      this.repo.merge(forumPost, {
        ...dto,
        parentPost: dto.parentPost ? { id: dto.parentPost } : undefined,
        forumThread: dto.forumThread ? { id: dto.forumThread } : undefined,
        user: dto.user ? { id: dto.user } : undefined,
      });
      await this.repo.save(forumPost);
      return { message: 'Publicación del foro actualizada correctamente', data: forumPost };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la publicación del foro', 500);
    }
  }

  async remove(id: string) {
    try {
      const forumPost = await this.repo.findOne({ where: { id } });
      if (!forumPost) {
        throw new ErrorHandler('Publicación del foro no encontrada', 404);
      }
      await this.repo.remove(forumPost);
      return { message: 'Publicación del foro eliminada correctamente', data: forumPost };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la publicación del foro', 500);
    }
  }
}
