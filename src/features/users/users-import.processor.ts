import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DataSource, ILike } from 'typeorm';
import { hashPassword } from '@common/utils/password.util';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RoleEntity } from '@features/roles/entities/role.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { StudentStatus, StudentType } from '@features/students/enums/student.enum';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import {
  ContractType,
  EmployementStatus,
  LaborRegime,
  WorkloadType,
} from '@features/teachers/enums/teacher.enum';
import { RedisService } from '../../infrastruture/redis/redis.service';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { AppGateway } from '../../infrastruture/sockets/app.gatewat';
import { UserImportHistoryEntity, UserImportHistoryStatus } from './entities/user-import-history.entity';
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
  errors: { row: number; message: string; rowData?: Record<string, unknown> }[];
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
    const historyRepo = this.dataSource.getRepository(UserImportHistoryEntity);
    const history = await historyRepo.findOne({ where: { jobId: String(job.id) } });

    try {
      const key = `${IMPORT_KEY_PREFIX}${uploadId}`;
      const rawData = await this.redis.getClient().get(key);

      if (!rawData) {
        throw new Error('Sesión de importación expirada');
      }

      const { rows } = JSON.parse(rawData) as { headers: string[]; rows: Record<string, unknown>[] };
      const total = rows.length;
      let created = 0;
      const errors: { row: number; message: string; rowData?: Record<string, unknown> }[] = [];
      const usernamesInFile = new Set<string>();
      const emailsInFile = new Set<string>();

      if (history) {
        history.status = UserImportHistoryStatus.PROCESSING;
        history.startedAt = new Date();
        history.totalRows = total;
        await historyRepo.save(history);
      }

      const emitProgress = async (processed: number) => {
        const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
        const payload: ImportUsersProgressPayload = {
          jobId: job.id!,
          processed,
          total,
          percentage,
          created,
          errors,
        };

        if (history) {
          history.processedRows = processed;
          history.createdRows = created;
          history.failedRows = errors.length;
          history.status = UserImportHistoryStatus.PROCESSING;
          await historyRepo.save(history);
        }

        this.appGateway.server.to(`user:${userId}`).emit('import:progress', payload);
      };

      const userRepo = this.dataSource.getRepository(UserEntity);
      const personRepo = this.dataSource.getRepository(PersonEntity);
      const roleRepo = this.dataSource.getRepository(RoleEntity);
      const institutionRepo = this.dataSource.getRepository(InstitutionEntity);

      const [defaultInstitution] = await institutionRepo.find({ take: 1 });

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
        const institutionInput = getVal('institution');
        const password = getVal('password') || DEFAULT_PASSWORD;
        const statusInput = getVal('status').toUpperCase();
        const activeInput = getVal('isActive').toLowerCase();
        const studentCode = getVal('studentCode');
        const studentTypeInput = getVal('studentType').toLowerCase();
        const studentStatusInput = getVal('studentStatus').toLowerCase();
        const admissionDateInput = getVal('admissionDate');
        const teacherCode = getVal('teacherCode');
        const specialization = getVal('specialization');
        const professionalTitle = getVal('professionalTitle');
        const university = getVal('university');
        const graduationYearInput = getVal('graduationYear');
        const professionalLicense = getVal('professionalLicense');
        const contractTypeInput = getVal('contractType').toLowerCase();
        const laborRegimeInput = getVal('laborRegime').toLowerCase();
        const hireDateInput = getVal('hireDate');
        const workloadTypeInput = getVal('workloadType').toLowerCase();
        const weeklyHoursInput = getVal('weeklyHours');
        const teachingLevel = getVal('teachingLevel');
        const employmentStatusInput = getVal('employmentStatus').toLowerCase();

        if (!username || !email || !firstName || !lastName || !roleInput) {
          errors.push({
            row: rowNumber,
            message: 'Username, email, nombres, apellidos y rol son obligatorios',
            rowData: row,
          });
          emitProgress(rowNumber);
          continue;
        }

        if (usernamesInFile.has(username)) {
          errors.push({ row: rowNumber, message: `El username "${username}" está duplicado en el archivo`, rowData: row });
          emitProgress(rowNumber);
          continue;
        }

        if (emailsInFile.has(email)) {
          errors.push({ row: rowNumber, message: `El email "${email}" está duplicado en el archivo`, rowData: row });
          emitProgress(rowNumber);
          continue;
        }

        const [existingUserByUsername, existingUserByEmail, existingPersonByEmail] = await Promise.all([
          userRepo.findOne({ where: { username } }),
          userRepo.findOne({ where: { email } }),
          personRepo.findOne({ where: { email } }),
        ]);

        if (existingUserByUsername) {
          errors.push({ row: rowNumber, message: `El username "${username}" ya existe`, rowData: row });
          emitProgress(rowNumber);
          continue;
        }

        if (existingUserByEmail || existingPersonByEmail) {
          errors.push({ row: rowNumber, message: `El email "${email}" ya existe`, rowData: row });
          emitProgress(rowNumber);
          continue;
        }

        const roleById = UUID_V4_REGEX.test(roleInput) ? await roleRepo.findOne({ where: { id: roleInput } }) : null;
        const role = roleById ?? (await roleRepo.findOne({ where: { name: ILike(roleInput) } }));

        if (!role) {
          errors.push({ row: rowNumber, message: `No se encontró el rol "${roleInput}"`, rowData: row });
          emitProgress(rowNumber);
          continue;
        }

        const normalizedRoleName = this.normalizeValue(role.name);
        const isStudentRole = normalizedRoleName === 'estudiante';
        const isTeacherRole = normalizedRoleName === 'docente' || normalizedRoleName === 'director';

        let institution =
          institutionInput && UUID_V4_REGEX.test(institutionInput)
            ? await institutionRepo.findOne({ where: { id: institutionInput } })
            : null;

        if (!institution && institutionInput) {
          institution = await institutionRepo.findOne({ where: { name: ILike(institutionInput) } });
        }

        institution ??= defaultInstitution ?? null;

        if (isStudentRole && !studentCode) {
          errors.push({
            row: rowNumber,
            message: 'Para el rol Estudiante, la columna "Codigo Estudiante" es obligatoria',
            rowData: row,
          });
          emitProgress(rowNumber);
          continue;
        }

        if (isStudentRole && !institution) {
          errors.push({
            row: rowNumber,
            message: 'Para el rol Estudiante se requiere una institución válida',
            rowData: row,
          });
          emitProgress(rowNumber);
          continue;
        }

        if (isTeacherRole && !teacherCode) {
          errors.push({
            row: rowNumber,
            message: 'Para el rol Docente/Director, la columna "Codigo Docente" es obligatoria',
            rowData: row,
          });
          emitProgress(rowNumber);
          continue;
        }

        if (
          isTeacherRole &&
          (!specialization ||
            !professionalTitle ||
            !university ||
            !professionalLicense ||
            !teachingLevel ||
            !institution)
        ) {
          errors.push({
            row: rowNumber,
            message:
              'Para el rol Docente/Director se requieren institución, especialidad, título, universidad, licencia y nivel de enseñanza',
            rowData: row,
          });
          emitProgress(rowNumber);
          continue;
        }

        const normalizedStatus = Object.values(UserStatus).includes(statusInput as UserStatus)
          ? (statusInput as UserStatus)
          : UserStatus.ACTIVE;

        const normalizedStudentType = Object.values(StudentType).includes(studentTypeInput as StudentType)
          ? (studentTypeInput as StudentType)
          : StudentType.REGULAR;

        const normalizedStudentStatus = Object.values(StudentStatus).includes(studentStatusInput as StudentStatus)
          ? (studentStatusInput as StudentStatus)
          : StudentStatus.ACTIVE;

        const admissionDate = this.parseDate(admissionDateInput) ?? new Date();
        const hireDate = this.parseDate(hireDateInput) ?? new Date();
        const graduationYear = this.parseInteger(graduationYearInput) ?? new Date().getFullYear();
        const weeklyHours = this.parseInteger(weeklyHoursInput) ?? 40;

        const normalizedContractType = Object.values(ContractType).includes(contractTypeInput as ContractType)
          ? (contractTypeInput as ContractType)
          : ContractType.FULL_TIME;

        const normalizedLaborRegime = Object.values(LaborRegime).includes(laborRegimeInput as LaborRegime)
          ? (laborRegimeInput as LaborRegime)
          : LaborRegime.PRIVATE;

        const normalizedWorkloadType = Object.values(WorkloadType).includes(workloadTypeInput as WorkloadType)
          ? (workloadTypeInput as WorkloadType)
          : WorkloadType.HOURS_40;

        const normalizedEmploymentStatus = Object.values(EmployementStatus).includes(
          employmentStatusInput as EmployementStatus,
        )
          ? (employmentStatusInput as EmployementStatus)
          : EmployementStatus.ACTIVE;

        await this.dataSource.transaction(async manager => {
          const txPersonRepo = manager.getRepository(PersonEntity);
          const txUserRepo = manager.getRepository(UserEntity);
          const txStudentRepo = manager.getRepository(StudentEntity);
          const txTeacherRepo = manager.getRepository(TeacherEntity);

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

          if (isStudentRole) {
            const student = txStudentRepo.create({
              studentCode,
              studentType: normalizedStudentType,
              religion: 'No especificada',
              nativeLanguage: 'Español',
              hasDisability: false,
              healthIssues: [],
              insunranceNumber: studentCode,
              bloodType: 'O+',
              allergies: 'Ninguna',
              medicalConditions: 'Ninguna',
              admisionDate: admissionDate,
              withdrawalReason: '',
              status: normalizedStudentStatus,
              institution: { id: institution!.id },
              person: { id: savedPerson.id },
            });
            await txStudentRepo.save(student);
          }

          if (isTeacherRole) {
            const teacher = txTeacherRepo.create({
              teacherCode,
              specialization,
              professionalTitle,
              university,
              graduationYear,
              professionalLicense,
              contractType: normalizedContractType,
              laborRegime: normalizedLaborRegime,
              hireDate,
              workloadType: normalizedWorkloadType,
              weeklyHours,
              teachingLevel,
              employmentStatus: normalizedEmploymentStatus,
              institution: { id: institution!.id },
              person: { id: savedPerson.id },
            });
            await txTeacherRepo.save(teacher);
          }
        });

        usernamesInFile.add(username);
        emailsInFile.add(email);
        created++;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido';
          errors.push({ row: rowNumber, message, rowData: row });
        }

        await emitProgress(rowNumber);
      }

      const result: ImportUsersProgressPayload = {
        jobId: job.id!,
        processed: total,
        total,
        percentage: 100,
        created,
        errors,
      };

      if (history) {
        history.processedRows = total;
        history.createdRows = created;
        history.failedRows = errors.length;
        history.status = UserImportHistoryStatus.COMPLETED;
        history.finishedAt = new Date();
        history.errorDetails = errors;
        await historyRepo.save(history);
      }

      this.appGateway.server.to(`user:${userId}`).emit('import:complete', result);
      await this.redis.getClient().del(key);
      return result;
    } catch (error) {
      if (history) {
        history.status = UserImportHistoryStatus.FAILED;
        history.finishedAt = new Date();
        history.errorDetails = [
          {
            row: 0,
            message: error instanceof Error ? error.message : 'Error desconocido',
          },
        ];
        await historyRepo.save(history);
      }
      throw error;
    }
  }

  private normalizeValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private parseDate(value: string): Date | null {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private parseInteger(value: string): number | null {
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
