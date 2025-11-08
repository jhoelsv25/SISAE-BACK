import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly repo: Repository<AnnouncementEntity>,
  ) {}
  async create(dto: CreateAnnouncementDto) {
    try {
      const { user, grade, ...rest } = dto;
      const announcement = this.repo.create({
        ...rest,
        user: user ? { id: user } : undefined, // user should be an object with id
        grade: grade ? { id: grade } : undefined, // grade should be an object with id
      });
      await this.repo.save(announcement);
      return { message: 'Anuncio creado correctamente', data: announcement };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el anuncio', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const announcements = await this.repo.find({ where: filter });
      return { message: 'Anuncios obtenidos correctamente', data: announcements };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los anuncios', 500);
    }
  }

  async findOne(id: string) {
    try {
      const announcement = await this.repo.findOne({ where: { id } });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      return { message: 'Anuncio obtenido correctamente', data: announcement };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el anuncio', 500);
    }
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    try {
      const announcement = await this.repo.findOne({ where: { id } });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      this.repo.merge(announcement, {
        ...dto,
        user: dto.user ? { id: dto.user } : undefined,
        grade: dto.grade ? { id: dto.grade } : undefined,
      });
      await this.repo.save(announcement);
      return { message: 'Anuncio actualizado correctamente', data: announcement };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el anuncio', 500);
    }
  }

  async remove(id: string) {
    try {
      const announcement = await this.repo.findOne({ where: { id } });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      await this.repo.remove(announcement);
      return { message: 'Anuncio eliminado correctamente', data: announcement };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el anuncio', 500);
    }
  }
}
