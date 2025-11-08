import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { FilterPersonDto } from './dto/filter.person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonEntity } from './entities/person.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly personsRepository: Repository<PersonEntity>,
  ) {}

  async create(dto: CreatePersonDto): Promise<Response<PersonEntity>> {
    try {
      const person = this.personsRepository.create(dto);
      const data = await this.personsRepository.save(person);
      return { message: 'Persona creada correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear la persona', 500);
    }
  }

  async findAll(filter: FilterPersonDto): Promise<PaginatedResponse<PersonEntity>> {
    try {
      const { page = 1, size = 10, ...rest } = filter;
      const where: FindOptionsWhere<PersonEntity> = {};

      for (const key of Object.keys(rest)) {
        if (rest[key] !== undefined && rest[key] !== null) {
          where[key] = rest[key];
        }
      }

      const [data, total] = await this.personsRepository.findAndCount({
        where,
        take: size,
        skip: (page - 1) * size,
      });

      return {
        data,
        total,
        page,
        size,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al buscar las personas', 500);
    }
  }

  async findOne(id: string): Promise<Response<PersonEntity>> {
    try {
      const person = await this.personsRepository.findOne({ where: { id } });
      if (!person) {
        throw new ErrorHandler('Persona no encontrada', 404);
      }
      return { message: 'Persona encontrada', data: person };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al buscar la persona', 500);
    }
  }

  async update(id: string, dto: UpdatePersonDto): Promise<Response<PersonEntity>> {
    try {
      const person = await this.personsRepository.findOne({ where: { id } });
      if (!person) {
        throw new ErrorHandler('Persona no encontrada', 404);
      }
      await this.personsRepository.update(id, dto);
      return { message: 'Persona actualizada correctamente', data: person };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar la persona', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.personsRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Persona no encontrada', 404);
      }
      return { message: 'Persona eliminada correctamente', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar la persona', 500);
    }
  }
}
