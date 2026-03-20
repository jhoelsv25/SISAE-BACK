import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly repo: Repository<ReportEntity>,
  ) {}

  async create(dto: CreateReportDto) {
    try {
      const report = this.repo.create({
        ...dto,
        generatedAt: new Date(),
      });
      await this.repo.save(report);
      return { message: 'Reporte creado correctamente', data: report };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el reporte', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const reports = await this.repo.find({ where: filter, order: { createdAt: 'DESC' } });
      return { message: 'Reportes obtenidos correctamente', data: reports };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los reportes', 500);
    }
  }

  async findOne(id: string) {
    try {
      const report = await this.repo.findOne({ where: { id } });
      if (!report) {
        throw new ErrorHandler('Reporte no encontrado', 404);
      }
      return { message: 'Reporte obtenido correctamente', data: report };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al obtener el reporte', 500);
    }
  }

  async update(id: string, dto: UpdateReportDto) {
    try {
      const report = await this.repo.findOne({ where: { id } });
      if (!report) {
        throw new ErrorHandler('Reporte no encontrado', 404);
      }
      this.repo.merge(report, dto);
      await this.repo.save(report);
      return { message: 'Reporte actualizado correctamente', data: report };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al actualizar el reporte', 500);
    }
  }

  async remove(id: string) {
    try {
      const report = await this.repo.findOne({ where: { id } });
      if (!report) {
        throw new ErrorHandler('Reporte no encontrado', 404);
      }
      await this.repo.remove(report);
      return { message: 'Reporte eliminado correctamente', data: report };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al eliminar el reporte', 500);
    }
  }
}
