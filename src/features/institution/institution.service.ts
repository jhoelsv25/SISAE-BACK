import { ErrorHandler } from '@common/exceptions';
import { Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionEntity } from './entities/institution.entity';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(InstitutionEntity)
    private repo: Repository<InstitutionEntity>,
  ) {}
  async create(dto: CreateInstitutionDto): Promise<Response<InstitutionEntity>> {
    try {
      const institution = this.repo.create(dto);
      await this.repo.save(institution);
      return {
        message: 'Institucion creada correctamente',
        data: institution,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear la institucion', 500);
    }
  }

  async findAll(): Promise<InstitutionEntity[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al buscar las instituciones', 500);
    }
  }

  async findOne(id: string): Promise<InstitutionEntity> {
    try {
      const institution = await this.repo.findOne({ where: { id } });
      if (!institution) throw new ErrorHandler('La institucion no fue encontrada', 404);
      return institution;
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al buscar la institucion', 500);
    }
  }

  async update(id: string, dto: UpdateInstitutionDto): Promise<Response<InstitutionEntity>> {
    try {
      const institution = await this.repo.findOne({ where: { id } });
      if (!institution) throw new ErrorHandler('La institucion no fue encontrada', 404);
      Object.assign(institution, dto);
      await this.repo.save(institution);
      return {
        message: 'Institucion actualizada correctamente',
        data: institution,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar la institucion', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const institution = await this.repo.findOne({ where: { id } });
      if (!institution) throw new ErrorHandler('La institucion no fue encontrada', 404);
      await this.repo.remove(institution);
      return {
        message: 'Institucion eliminada correctamente',
        data: null,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar la institucion', 500);
    }
  }
}
