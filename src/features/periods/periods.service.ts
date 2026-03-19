import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodStatus, PeriodType } from '@common/enums/global.enum';
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

  private getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  async create(dto: CreatePeriodDto): Promise<PeriodEntity> {
    try {
      const exists = await this.repo.findOne({ where: { name: dto.name } });
      if (exists) {
        return ErrorHandler.conflict(`El periodo '${dto.name}' ya existe`, 'Period');
      }
      const count = await this.repo.count({ where: { academicYear: { id: dto.academicYearId } } });
      const entity = this.repo.create({
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        periodNumber: count + 1,
        type: PeriodType.SEMESTER,
        status: PeriodStatus.PLANNED,
        academicYear: { id: dto.academicYearId },
      });
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
      if (dto.status && entity.status === PeriodStatus.COMPLETED && dto.status !== PeriodStatus.COMPLETED) {
        return ErrorHandler.validation('Un período completado ya no puede cambiar de estado', 'Period');
      }
      Object.assign(entity, dto);
      return await this.repo.save(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al actualizar periodo');
    }
  }

  async syncStatusesWithCalendar(): Promise<{ updated: number }> {
    try {
      const today = this.getTodayDateString();

      const previousResult = await this.repo
        .createQueryBuilder()
        .update(PeriodEntity)
        .set({ status: PeriodStatus.COMPLETED })
        .where('"end_date" < :today', { today })
        .andWhere('"status" IN (:...statuses)', { statuses: [PeriodStatus.PLANNED, PeriodStatus.IN_PROGRESS] })
        .execute();

      const currentResult = await this.repo
        .createQueryBuilder()
        .update(PeriodEntity)
        .set({ status: PeriodStatus.IN_PROGRESS })
        .where('"start_date" <= :today', { today })
        .andWhere('"end_date" >= :today', { today })
        .andWhere('"status" = :status', { status: PeriodStatus.PLANNED })
        .execute();

      const futureResult = await this.repo
        .createQueryBuilder()
        .update(PeriodEntity)
        .set({ status: PeriodStatus.PLANNED })
        .where('"start_date" > :today', { today })
        .andWhere('"status" = :status', { status: PeriodStatus.IN_PROGRESS })
        .execute();

      return {
        updated:
          (previousResult.affected ?? 0) +
          (currentResult.affected ?? 0) +
          (futureResult.affected ?? 0),
      };
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al sincronizar estados de periodos');
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
