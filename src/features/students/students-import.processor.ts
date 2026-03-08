import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DataSource } from 'typeorm';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { StudentStatus, StudentType } from './enums/student.enum';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { RedisService } from '../../infrastruture/redis/redis.service';
import { AppGateway } from '../../infrastruture/sockets/app.gatewat';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { StudentEntity } from './entities/student.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';

const IMPORT_KEY_PREFIX = 'students_import:';

export interface ImportStudentsJobPayload {
  uploadId: string;
  columnMapping: Record<string, string>;
  userId: string;
}

export interface ImportProgressPayload {
  jobId: string;
  processed: number;
  total: number;
  percentage: number;
  created: number;
  errors: { row: number; message: string }[];
}

@Processor(QUEUE.STUDENTS_IMPORT, { concurrency: 1 })
export class StudentsImportProcessor extends WorkerHost {
  private readonly logger = new Logger(StudentsImportProcessor.name);

  constructor(
    private readonly redis: RedisService,
    private readonly dataSource: DataSource,
    private readonly appGateway: AppGateway,
  ) {
    super();
  }

  async process(job: Job<ImportStudentsJobPayload, ImportProgressPayload>): Promise<ImportProgressPayload> {
    if (job.name !== JOBS.IMPORT_STUDENTS) {
      this.logger.warn(`Unknown job: ${job.name}`);
      return { jobId: job.id!, processed: 0, total: 0, percentage: 0, created: 0, errors: [] };
    }
    return this.handleImport(job);
  }

  private async handleImport(job: Job<ImportStudentsJobPayload>): Promise<ImportProgressPayload> {
    const { uploadId, columnMapping, userId } = job.data;
    const key = `${IMPORT_KEY_PREFIX}${uploadId}`;
    const data = await this.redis.getClient().get(key);
    if (!data) {
      throw new Error('Sesión de importación expirada');
    }

    const { rows } = JSON.parse(data) as { headers: string[]; rows: Record<string, unknown>[] };
    const total = rows.length;
    let created = 0;
    const errors: { row: number; message: string }[] = [];
    const prefix = `imp-${Date.now()}`;

    const [firstInstitution] = await this.dataSource.getRepository(InstitutionEntity).find({ take: 1 });
    const institutionId = firstInstitution?.id ?? null;

    const emitProgress = (processed: number) => {
      const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
      const payload: ImportProgressPayload = {
        jobId: job.id!,
        processed,
        total,
        percentage,
        created,
        errors,
      };
      this.appGateway.server.to(`user:${userId}`).emit('import:progress', payload);
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const getVal = (field: string) => {
        const col = columnMapping[field];
        if (!col) return '';
        const v = row[col];
        return typeof v === 'number' ? String(v) : String(v ?? '').trim();
      };

      try {
        const name = getVal('name') || getVal('Nombre');
        const email = getVal('email') || getVal('Email');
        const ageVal = getVal('age') || getVal('Edad');
        const grade = getVal('grade') || getVal('Grado');

        if (!name || !email) {
          errors.push({ row: i + 1, message: 'Nombre y email requeridos' });
          emitProgress(i + 1);
          continue;
        }

        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || 'Sin nombre';
        const lastName = nameParts.slice(1).join(' ') || 'Importado';
        const uniqueSuffix = `${prefix}-${i}`;
        const finalEmail = email.includes('@') ? email : `${uniqueSuffix}@import.local`;

        const personRepo = this.dataSource.getRepository(PersonEntity);
        const person = personRepo.create({
          documentType: DocumentType.DNI,
          firstName,
          lastName,
          birthDate: new Date(2010, 0, 1),
          gender: Gender.OTHER,
          birthPlace: uniqueSuffix,
          nationality: 'Peruana',
          address: uniqueSuffix,
          district: uniqueSuffix,
          province: uniqueSuffix,
          department: uniqueSuffix,
          phone: uniqueSuffix,
          mobile: uniqueSuffix,
          email: finalEmail,
          photoUrl: '',
          materialStatus: MaterialStatus.SINGLE,
        });
        const savedPerson = await personRepo.save(person);

        const studentRepo = this.dataSource.getRepository(StudentEntity);
        const student = studentRepo.create({
          studentCode: `EST-${uniqueSuffix}`,
          studentType: StudentType.REGULAR,
          religion: 'No especificada',
          nativeLanguage: 'Español',
          hasDisability: false,
          healthIssues: [],
          insunranceNumber: uniqueSuffix,
          bloodType: 'O+',
          allergies: 'Ninguna',
          medicalConditions: 'Ninguna',
          admisionDate: new Date(),
          withdrawalReason: '',
          status: StudentStatus.ACTIVE,
          institution: institutionId ? { id: institutionId } : undefined,
          person: { id: savedPerson.id },
        });
        await studentRepo.save(student);
        created++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        errors.push({ row: i + 1, message: msg });
      }
      emitProgress(i + 1);
    }

    const result: ImportProgressPayload = {
      jobId: job.id!,
      processed: total,
      total,
      percentage: 100,
      created,
      errors,
    };
    this.appGateway.server.to(`user:${userId}`).emit('import:complete', result);
    await this.redis.getClient().del(key);
    return result;
  }
}
