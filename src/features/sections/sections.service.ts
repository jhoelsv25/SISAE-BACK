import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionEntity } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(SectionEntity)
    private readonly repo: Repository<SectionEntity>,
  ) {}
  async create(dto: CreateSectionDto) {
    try {
      // Map grade string to object if necessary
      const entityLike: any = { ...dto };
      if (typeof dto.grade === 'string') {
        entityLike.grade = { id: dto.grade };
      }
      const section = this.repo.create(entityLike);
      const data = await this.repo.save(section);
      return { message: 'Sección creada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la sección', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const sections = await this.repo.find({ where: filter });
      return { message: 'Secciones encontradas correctamente', data: sections };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las secciones', 500);
    }
  }

  async findOne(id: string) {
    try {
      const section = await this.repo.findOne({ where: { id } });
      if (!section) {
        throw new ErrorHandler('Sección no encontrada', 404);
      }
      return { message: 'Sección encontrada correctamente', data: section };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la sección', 500);
    }
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    try {
      // Map grade string to object if necessary
      const entityLike: any = { ...updateSectionDto };
      if (typeof updateSectionDto.grade === 'string') {
        entityLike.grade = { id: updateSectionDto.grade };
      }
      await this.repo.update(id, entityLike);
      return { message: 'Sección actualizada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la sección', 500);
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
      return { message: 'Sección eliminada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la sección', 500);
    }
  }
}
