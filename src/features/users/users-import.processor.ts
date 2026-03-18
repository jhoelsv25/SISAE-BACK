import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DataSource, ILike } from 'typeorm';
import { hashPassword } from '@common/utils/password.util';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RoleEntity } from '@features/roles/entities/role.entity';
import { RedisService } from '../../infrastruture/redis/redis.service';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { AppGateway } from '../../infrastruture/sockets/app.gatewat';
import { UserEntity, UserStatus } from './entities/user.entity';

const IMPORT_KEY_PREFIX = 'users_import:';
const DEFAULT_PASSWORD = 'Temp12345!';
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface ImportUsersJobPayload {
  uploadId: string;
  columnMapping: Record<string, string>;
  userId: string;
}

export interface ImportUsersProgressPayload {
  jobId: string;
  processed: number;
  total: number;
  percentage: number;
  created: number;
  errors: { row: number; message: string }[];
}

@Processor(QUEUE.USERS_IMPORT, { concurrency: 1 })
export class UsersImportProcessor extends WorkerHost {
  private readonly logger = new Logger(UsersImportProcessor.name);

  constructor(
    private readonly redis: RedisService,
    private readonly dataSource: DataSource,
    private readonly appGateway: AppGateway,
  ) {
    super();
  }

  async process(job: Job<ImportUsersJobPayload, ImportUsersProgressPayload>): Promise<ImportUsersProgressPayload> {
    if (job.name !== JOBS.IMPORT_USERS) {
      this.logger.warn(`Unknown job: ${job.name}`);
      return { jobId: job.id!, processed: 0, total: 0, percentage: 0, created: 0, errors: [] };
    }

    return this.handleImport(job);
  }

  private async handleImport(job: Job<ImportUsersJobPayload>): Promise<ImportUsersProgressPayload> {
    const { uploadId, columnMapping, userId } = job.data;
    const key = `${IMPORT_KEY_PREFIX}${uploadId}`;
    const rawData = await this.redis.getClient().get(key);

    if (!rawData) {
      throw new Error('Sesión de importación expirada');
    }

    const { rows } = JSON.parse(rawData) as { headers: string[]; rows: Record<string, unknown>[] };
    const total = rows.length;
    let created = 0;
    const errors: { row: number; message: string }[] = [];
    const usernamesInFile = new Set<string>();
    const emailsInFile = new Set<string>();

    const emitProgress = (processed: number) => {
      const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
      const payload: ImportUsersProgressPayload = {
        jobId: job.id!,
        processed,
        total,
        percentage,
        created,
        errors,
      };
      this.appGateway.server.to(`user:${userId}`).emit('import:progress', payload);
    };

    const userRepo = this.dataSource.getRepository(UserEntity);
    const personRepo = this.dataSource.getRepository(PersonEntity);
    const roleRepo = this.dataSource.getRepository(RoleEntity);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1;
      const getVal = (field: string) => {
        const column = columnMapping[field];
        if (!column) return '';
        const value = row[column];
        return typeof value === 'number' ? String(value) : String(value ?? '').trim();
      };

      try {
        const username = getVal('username').toLowerCase();
        const email = getVal('email').toLowerCase();
        const firstName = getVal('firstName');
        const lastName = getVal('lastName');
        const roleInput = getVal('role');
        const password = getVal('password') || DEFAULT_PASSWORD;
        const statusInput = getVal('status').toUpperCase();
        const activeInput = getVal('isActive').toLowerCase();

        if (!username || !email || !firstName || !lastName || !roleInput) {
          errors.push({
            row: rowNumber,
            message: 'Username, email, nombres, apellidos y rol son obligatorios',
          });
          emitProgress(rowNumber);
          continue;
        }

        if (usernamesInFile.has(username)) {
          errors.push({ row: rowNumber, message: `El username "${username}" está duplicado en el archivo` });
          emitProgress(rowNumber);
          continue;
        }

        if (emailsInFile.has(email)) {
          errors.push({ row: rowNumber, message: `El email "${email}" está duplicado en el archivo` });
          emitProgress(rowNumber);
          continue;
        }

        const [existingUserByUsername, existingUserByEmail, existingPersonByEmail] = await Promise.all([
          userRepo.findOne({ where: { username } }),
          userRepo.findOne({ where: { email } }),
          personRepo.findOne({ where: { email } }),
        ]);

        if (existingUserByUsername) {
          errors.push({ row: rowNumber, message: `El username "${username}" ya existe` });
          emitProgress(rowNumber);
          continue;
        }

        if (existingUserByEmail || existingPersonByEmail) {
          errors.push({ row: rowNumber, message: `El email "${email}" ya existe` });
          emitProgress(rowNumber);
          continue;
        }

        const roleById = UUID_V4_REGEX.test(roleInput) ? await roleRepo.findOne({ where: { id: roleInput } }) : null;
        const role = roleById ?? (await roleRepo.findOne({ where: { name: ILike(roleInput) } }));

        if (!role) {
          errors.push({ row: rowNumber, message: `No se encontró el rol "${roleInput}"` });
          emitProgress(rowNumber);
          continue;
        }

        const normalizedStatus = Object.values(UserStatus).includes(statusInput as UserStatus)
          ? (statusInput as UserStatus)
          : UserStatus.ACTIVE;

        await this.dataSource.transaction(async manager => {
          const txPersonRepo = manager.getRepository(PersonEntity);
          const txUserRepo = manager.getRepository(UserEntity);

          const person = txPersonRepo.create({
            documentType: DocumentType.DNI,
            firstName,
            lastName,
            birthDate: new Date(2000, 0, 1),
            gender: Gender.OTHER,
            birthPlace: '',
            nationality: 'Peruana',
            address: '',
            district: '',
            province: '',
            department: '',
            phone: '',
            mobile: '',
            email,
            photoUrl: '',
            materialStatus: MaterialStatus.SINGLE,
          });
          const savedPerson = await txPersonRepo.save(person);

          const user = txUserRepo.create({
            username,
            email,
            password: await hashPassword(password),
            isActive: ['1', 'true', 'si', 'sí', 'yes', 'activo'].includes(activeInput) || activeInput === '',
            status: normalizedStatus,
            person: { id: savedPerson.id },
            role: { id: role.id },
          });
          await txUserRepo.save(user);
        });

        usernamesInFile.add(username);
        emailsInFile.add(email);
        created++;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        errors.push({ row: rowNumber, message });
      }

      emitProgress(rowNumber);
    }

    const result: ImportUsersProgressPayload = {
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
