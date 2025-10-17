import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions/error-handler';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { PeriodEntity } from './entities/period.entity';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(PeriodEntity)
    private readonly repo: Repository<PeriodEntity>,
  ) {}

  async create(dto: CreatePeriodDto): Promise<PeriodEntity> {
    try {
      const exists = await this.repo.findOne({ where: { name: dto.name } });
      if (exists) {
        return ErrorHandler.conflict(`El periodo '${dto.name}' ya existe`, 'Period');
      }
      const entity = this.repo.create(dto);
      return await this.repo.save(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al crear periodo');
    }
  }

  async findAll(): Promise<PeriodEntity[]> {
    try {
      return await this.repo.find({ order: { name: 'ASC' } });
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al obtener periodos');
    }
  }

  async findOne(id: string): Promise<PeriodEntity> {
    try {
      const entity = await this.repo.findOne({ where: { id } });
      if (!entity) {
        return ErrorHandler.notFound('Periodo no encontrado', 'Period');
      }
      return entity;
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al buscar periodo');
    }
  }

  async update(id: string, dto: UpdatePeriodDto): Promise<PeriodEntity> {
    try {
      const entity = await this.findOne(id);
      Object.assign(entity, dto);
      return await this.repo.save(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al actualizar periodo');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const entity = await this.findOne(id);
      await this.repo.remove(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al eliminar periodo');
    }
  }
}
