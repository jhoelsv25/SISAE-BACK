import { ErrorHandler } from '@common/exceptions';
import { ExcelService } from '@common/services/excel.service';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { RedisService } from '../../infrastruture/redis/redis.service';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { ImportStartDto } from './dto/import-start.dto';

const IMPORT_TTL = 3600;
const IMPORT_KEY_PREFIX = 'users_import:';

export interface ImportUploadResult {
  uploadId: string;
  headers: string[];
  rowCount: number;
}

export interface ImportStartResult {
  jobId: string;
}

@Injectable()
export class UsersImportService {
  constructor(
    private readonly redis: RedisService,
    private readonly excelService: ExcelService,
    @InjectQueue(QUEUE.USERS_IMPORT)
    private readonly importQueue: Queue,
  ) {}

  async upload(file: Express.Multer.File): Promise<ImportUploadResult> {
    try {
      const { headers, rows } = this.excelService.parse(file.buffer);

      if (headers.length === 0 || rows.length === 0) {
        throw new ErrorHandler('El archivo debe tener encabezados y al menos una fila con datos', 400);
      }

      const uploadId = randomUUID();
      const key = `${IMPORT_KEY_PREFIX}${uploadId}`;
      await this.redis.getClient().setex(key, IMPORT_TTL, JSON.stringify({ headers, rows }));

      return { uploadId, headers, rowCount: rows.length };
    } catch (err) {
      if (err instanceof ErrorHandler) throw err;
      throw new ErrorHandler('Error al procesar el archivo de usuarios', 500);
    }
  }

  async startImport(dto: ImportStartDto, userId: string): Promise<ImportStartResult> {
    const key = `${IMPORT_KEY_PREFIX}${dto.uploadId}`;
    const data = await this.redis.getClient().get(key);

    if (!data) {
      throw new ErrorHandler('La sesión de importación expiró. Vuelva a subir el archivo.', 400);
    }

    const job = await this.importQueue.add(
      JOBS.IMPORT_USERS,
      {
        uploadId: dto.uploadId,
        columnMapping: dto.columnMapping,
        userId,
      },
      { removeOnComplete: 100 },
    );

    return { jobId: job.id ?? '' };
  }
}
