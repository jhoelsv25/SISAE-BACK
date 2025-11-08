import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateSubjectAreaDto } from './dto/create-subject_area.dto';
import { UpdateSubjectAreaDto } from './dto/update-subject_area.dto';
import { SubjectAreaEntity } from './entities/subject_area.entity';

@Injectable()
export class SubjectAreaService {
  constructor(
    @InjectRepository(SubjectAreaEntity)
    private readonly repo: Repository<SubjectAreaEntity>,
  ) {}

  async create(dto: CreateSubjectAreaDto) {
    try {
      const subjectArea = this.repo.create(dto);
      const data = await this.repo.save(subjectArea);
      return { message: 'Área de materia creada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el área de materia', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const [data, total] = await this.repo.findAndCount({
        where: filter,
      });
      return { message: 'Áreas de materia encontradas correctamente', data, total };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar las áreas de materia', 500);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.repo.findOne({ where: { id } });
      if (!data) {
        throw new ErrorHandler('Área de materia no encontrada', 404);
      }
      return { message: 'Área de materia encontrada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar el área de materia', 500);
    }
  }

  async update(id: string, dto: UpdateSubjectAreaDto) {
    try {
      await this.repo.update(id, dto);
      return { message: 'Área de materia actualizada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el área de materia', 500);
    }
  }

  async remove(id: string) {
    try {
      await this.repo.delete(id);
      return { message: 'Área de materia eliminada correctamente' };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el área de materia', 500);
    }
  }
}
