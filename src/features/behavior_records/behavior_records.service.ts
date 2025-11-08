import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateBehaviorRecordDto } from './dto/create-behavior_record.dto';
import { UpdateBehaviorRecordDto } from './dto/update-behavior_record.dto';
import { BehaviorRecordEntity } from './entities/behavior_record.entity';

@Injectable()
export class BehaviorRecordsService {
  constructor(
    @InjectRepository(BehaviorRecordEntity)
    private readonly repo: Repository<BehaviorRecordEntity>,
  ) {}

  async create(dto: CreateBehaviorRecordDto) {
    try {
      // Convert related entity IDs to objects as required by TypeORM
      const behaviorRecord = this.repo.create({
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        period: dto.period ? { id: dto.period } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
      });
      await this.repo.save(behaviorRecord);
      return { message: 'Behavior record creado correctamente', data: behaviorRecord };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el behavior record', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const behaviorRecords = await this.repo.find({ where: filter });
      return behaviorRecords;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los behavior records', 500);
    }
  }

  async findOne(id: string) {
    try {
      const behaviorRecord = await this.repo.findOne({ where: { id } });
      if (!behaviorRecord) {
        throw new ErrorHandler('Behavior record no encontrado', 404);
      }
      return behaviorRecord;
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el behavior record', 500);
    }
  }

  async update(id: string, dto: UpdateBehaviorRecordDto) {
    try {
      const behaviorRecord = await this.repo.findOne({ where: { id } });
      if (!behaviorRecord) {
        throw new ErrorHandler('Behavior record no encontrado', 404);
      }
      this.repo.merge(behaviorRecord, {
        ...dto,
        student: dto.student ? { id: dto.student } : undefined,
        period: dto.period ? { id: dto.period } : undefined,
        teacher: dto.teacher ? { id: dto.teacher } : undefined,
      });
      await this.repo.save(behaviorRecord);
      return { message: 'Behavior record actualizado correctamente', data: behaviorRecord };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el behavior record', 500);
    }
  }

  async remove(id: string) {
    try {
      const behaviorRecord = await this.repo.findOne({ where: { id } });
      if (!behaviorRecord) {
        throw new ErrorHandler('Behavior record no encontrado', 404);
      }
      await this.repo.remove(behaviorRecord);
      return { message: 'Behavior record eliminado correctamente', data: behaviorRecord };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el behavior record', 500);
    }
  }
}
