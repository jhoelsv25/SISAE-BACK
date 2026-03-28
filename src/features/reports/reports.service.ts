import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { ErrorHandler } from '../../common/exceptions';
import { AppGateway } from '../../infrastruture/sockets/app.gatewat';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { AssessmentScoresService } from '../assessment_scores/assessment_scores.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportEntity } from './entities/report.entity';
import { ReportFormat, ReportType } from './enums/report.enum';

export interface GenerateReportJobPayload {
  reportId: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly repo: Repository<ReportEntity>,
    @InjectQueue(QUEUE.REPORTS)
    private readonly reportsQueue: Queue,
    private readonly assessmentScoresService: AssessmentScoresService,
    private readonly appGateway: AppGateway,
  ) {}

  private buildMeta(report: ReportEntity, patch: Record<string, unknown>) {
    const parameters = (report.parameters ?? {}) as Record<string, unknown>;
    const currentMeta = (parameters.__meta ?? {}) as Record<string, unknown>;
    return {
      ...parameters,
      __meta: {
        ...currentMeta,
        ...patch,
      },
    };
  }

  private emitReportStatus(report: ReportEntity) {
    if (!report.createdBy) return;
    this.appGateway.server.to(`user:${report.createdBy}`).emit('report:status', report);
  }

  async create(dto: CreateReportDto, user?: { id?: string }) {
    try {
      const report = this.repo.create({
        ...dto,
        generatedAt: null,
        createdBy: user?.id ?? null,
        parameters: {
          ...(dto.parameters ?? {}),
          __meta: {
            status: 'pending',
            queuedAt: new Date().toISOString(),
            error: null,
          },
        },
      });
      await this.repo.save(report);
      await this.reportsQueue.add(
        JOBS.GENERATE_REPORT,
        { reportId: report.id } as GenerateReportJobPayload,
        { jobId: `report:${report.id}`, removeOnComplete: 20, removeOnFail: 20 },
      );
      this.emitReportStatus(report);
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

  async processQueuedReport(payload: GenerateReportJobPayload) {
    const report = await this.repo.findOne({ where: { id: payload.reportId } });
    if (!report) {
      throw new ErrorHandler('Reporte no encontrado para procesar', 404);
    }

    try {
      report.parameters = this.buildMeta(report, {
        status: 'processing',
        startedAt: new Date().toISOString(),
        error: null,
      });
      await this.repo.save(report);
      this.emitReportStatus(report);

      if (report.type !== ReportType.ACADEMIC) {
        throw new ErrorHandler('Solo el reporte académico está soportado en cola por ahora', 400);
      }

      if (![ReportFormat.CSV, ReportFormat.XLSX].includes((report.format ?? ReportFormat.XLSX) as ReportFormat)) {
        throw new ErrorHandler('Formato aún no soportado para procesamiento en cola', 400);
      }

      const rawParams = (report.parameters ?? {}) as Record<string, unknown>;
      const studentId = typeof rawParams['student'] === 'string' ? rawParams['student'] : undefined;
      const consolidated = await this.assessmentScoresService.findConsolidated({
        sectionCourse: typeof rawParams['sectionCourse'] === 'string' ? rawParams['sectionCourse'] : undefined,
        period: typeof rawParams['period'] === 'string' ? rawParams['period'] : undefined,
        competency: typeof rawParams['competency'] === 'string' ? rawParams['competency'] : undefined,
      });

      const rows = (consolidated.data ?? [])
        .filter((row: any) => !studentId || row.enrollment?.student?.id === studentId)
        .map((row: any) => ({
          estudiante:
            [row.enrollment?.student?.person?.firstName, row.enrollment?.student?.person?.lastName]
              .filter(Boolean)
              .join(' ')
              .trim() || row.enrollment?.student?.studentCode || 'Estudiante',
          codigo: row.enrollment?.student?.studentCode ?? '',
          curso: row.sectionCourse?.course?.name ?? '',
          periodo: row.period?.name ?? '',
          competencia: row.competency?.name ?? '',
          competenciaCodigo: row.competency?.code ?? '',
          notaNumerica: row.numericScore,
          notaLiteral: row.literalScore ?? '',
          pesoTotal: row.totalWeight,
          evaluaciones: row.assessmentsCount,
        }));

      const reportsDir = path.resolve(process.cwd(), 'uploads', 'reports');
      await fs.mkdir(reportsDir, { recursive: true });

      const baseName = `report-${report.id}`;
      let fileName = '';
      let buffer: Buffer;
      let mimeType = '';

      if ((report.format ?? ReportFormat.XLSX) === ReportFormat.CSV) {
        fileName = `${baseName}.csv`;
        const headers = rows.length ? Object.keys(rows[0]) : ['estudiante', 'notaNumerica', 'notaLiteral'];
        const csv = [
          headers.join(','),
          ...rows.map((row) =>
            headers
              .map((key) => `"${String((row as Record<string, unknown>)[key] ?? '').replaceAll('"', '""')}"`)
              .join(','),
          ),
        ].join('\n');
        buffer = Buffer.from(csv, 'utf-8');
        mimeType = 'text/csv';
      } else {
        fileName = `${baseName}.xlsx`;
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Consolidado');
        buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }) as Buffer;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      await fs.writeFile(path.join(reportsDir, fileName), buffer);

      report.downloadUrl = `/uploads/reports/${fileName}`;
      report.generatedAt = new Date();
      report.parameters = this.buildMeta(report, {
        status: 'completed',
        completedAt: report.generatedAt.toISOString(),
        error: null,
        mimeType,
        rows: rows.length,
      });
      await this.repo.save(report);
      this.emitReportStatus(report);
      return report;
    } catch (error) {
      report.parameters = this.buildMeta(report, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      });
      await this.repo.save(report);
      this.emitReportStatus(report);
      throw error;
    }
  }
}
