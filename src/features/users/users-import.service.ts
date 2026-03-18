import { ErrorHandler } from '@common/exceptions';
import { ExcelService } from '@common/services/excel.service';
import { ExcelColumn } from '@common/services/excel.service';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { RedisService } from '../../infrastruture/redis/redis.service';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { ImportStartDto } from './dto/import-start.dto';
import { UserImportHistoryEntity, UserImportHistoryStatus } from './entities/user-import-history.entity';

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

export interface ImportTemplateResult {
  buffer: Buffer;
  fileName: string;
}

const USER_IMPORT_TEMPLATE_COLUMNS: ExcelColumn[] = [
  { key: 'username', label: 'Usuario' },
  { key: 'email', label: 'Correo' },
  { key: 'firstName', label: 'Nombres' },
  { key: 'lastName', label: 'Apellidos' },
  { key: 'role', label: 'Rol' },
  { key: 'institution', label: 'Institucion' },
  { key: 'password', label: 'Contrasena' },
  { key: 'status', label: 'Estado' },
  { key: 'isActive', label: 'Activo' },
  { key: 'studentCode', label: 'Codigo Estudiante' },
  { key: 'studentType', label: 'Tipo Estudiante' },
  { key: 'studentStatus', label: 'Estado Estudiante' },
  { key: 'admissionDate', label: 'Fecha Admision' },
  { key: 'teacherCode', label: 'Codigo Docente' },
  { key: 'specialization', label: 'Especialidad' },
  { key: 'professionalTitle', label: 'Titulo Profesional' },
  { key: 'university', label: 'Universidad' },
  { key: 'graduationYear', label: 'Anio Graduacion' },
  { key: 'professionalLicense', label: 'Licencia Profesional' },
  { key: 'contractType', label: 'Tipo Contrato' },
  { key: 'laborRegime', label: 'Regimen Laboral' },
  { key: 'hireDate', label: 'Fecha Contratacion' },
  { key: 'workloadType', label: 'Carga Horaria' },
  { key: 'weeklyHours', label: 'Horas Semanales' },
  { key: 'teachingLevel', label: 'Nivel Ensenanza' },
  { key: 'employmentStatus', label: 'Estado Laboral' },
];

const USER_IMPORT_TEMPLATE_EXAMPLE = {
  username: 'jperez',
  email: 'juan.perez@colegio.edu.pe',
  firstName: 'Juan',
  lastName: 'Perez Soto',
  role: 'Estudiante',
  institution: 'Colegio Carmelinas',
  password: 'Temp12345!',
  status: 'ACTIVE',
  isActive: 'true',
  studentCode: '20260001',
  studentType: 'regular',
  studentStatus: 'active',
  admissionDate: '2026-03-01',
  teacherCode: 'D-20260001',
  specialization: 'Matematicas',
  professionalTitle: 'Licenciado en Educacion',
  university: 'UNMSM',
  graduationYear: '2018',
  professionalLicense: 'CMP-123456',
  contractType: 'full_time',
  laborRegime: 'private',
  hireDate: '2026-03-01',
  workloadType: '40_hours',
  weeklyHours: '40',
  teachingLevel: 'Secundaria',
  employmentStatus: 'active',
};

@Injectable()
export class UsersImportService {
  constructor(
    private readonly redis: RedisService,
    private readonly excelService: ExcelService,
    @InjectRepository(UserImportHistoryEntity)
    private readonly historyRepo: Repository<UserImportHistoryEntity>,
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
      await this.redis.getClient().setex(
        key,
        IMPORT_TTL,
        JSON.stringify({ headers, rows, fileName: file.originalname }),
      );

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

    const parsed = JSON.parse(data) as { headers: string[]; rows: Record<string, unknown>[]; fileName?: string };

    const job = await this.importQueue.add(
      JOBS.IMPORT_USERS,
      {
        uploadId: dto.uploadId,
        columnMapping: dto.columnMapping,
        userId,
      },
      { removeOnComplete: 100 },
    );

    const jobId = String(job.id ?? '');
    await this.historyRepo.save(
      this.historyRepo.create({
        jobId,
        fileName: parsed.fileName ?? 'archivo_importacion.xlsx',
        totalRows: parsed.rows.length,
        processedRows: 0,
        createdRows: 0,
        failedRows: 0,
        status: UserImportHistoryStatus.QUEUED,
        user: userId ? ({ id: userId } as any) : undefined,
      }),
    );

    return { jobId };
  }

  getTemplate(): ImportTemplateResult {
    const fileName = 'plantilla_usuarios.xlsx';
    const buffer = this.excelService.generateTemplate(
      USER_IMPORT_TEMPLATE_COLUMNS,
      USER_IMPORT_TEMPLATE_EXAMPLE,
      {
        sheetName: 'Usuarios',
        fileName,
      },
    );

    return { buffer, fileName };
  }

  async getHistory(userId?: string): Promise<UserImportHistoryEntity[]> {
    return this.historyRepo.find({
      where: userId ? { user: { id: userId } as any } : {},
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 15,
    });
  }
}
