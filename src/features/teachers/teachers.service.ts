import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { PaginatedResponse, Response } from '../../common/types/global.types';
import { PersonEntity } from '../persons/entities/person.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherCredentialEntity } from './entities/teacher-credential.entity';
import { TeacherEntity } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  private readonly logger = new Logger(TeachersService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TeacherEntity)
    private readonly teachersRepository: Repository<TeacherEntity>,
    @InjectRepository(PersonEntity)
    private readonly personsRepository: Repository<PersonEntity>,
    @InjectRepository(TeacherCredentialEntity)
    private readonly teacherCredentialRepository: Repository<TeacherCredentialEntity>,
  ) {}

  private buildCredentialPayload(teacher: TeacherEntity) {
    const frontendOrigin = this.configService.get<string>('CORS_ORIGIN')?.split(',')[0]?.trim() || 'http://localhost:4200';
    const params = new URLSearchParams({
      mode: 'teacher',
      code: teacher.teacherCode,
    });
    return `${frontendOrigin}/attendance/quick-register?${params.toString()}`;
  }

  private async ensureCredential(teacher: TeacherEntity, regenerate = false) {
    const existing = await this.teacherCredentialRepository
      .createQueryBuilder('credential')
      .leftJoinAndSelect('credential.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId: teacher.id })
      .getOne();

    const credentialCode = `DOC-${teacher.teacherCode}`;
    const qrValue = this.buildCredentialPayload(teacher);

    if (existing && !regenerate) {
      existing.credentialCode = credentialCode;
      existing.qrValue = qrValue;
      existing.active = true;
      existing.issuedAt = existing.issuedAt ?? new Date();
      return this.teacherCredentialRepository.save(existing);
    }

    if (existing && regenerate) {
      existing.credentialCode = credentialCode;
      existing.qrValue = qrValue;
      existing.active = true;
      existing.issuedAt = new Date();
      return this.teacherCredentialRepository.save(existing);
    }

    const created = this.teacherCredentialRepository.create({
      credentialCode,
      qrValue,
      active: true,
      issuedAt: new Date(),
      teacher: { id: teacher.id } as TeacherEntity,
    });
    return this.teacherCredentialRepository.save(created);
  }

  async create(dto: CreateTeacherDto): Promise<Response<TeacherEntity>> {
    try {
      const { institution, person, photoUrl, ...restDto } = dto;
      const teacher = this.teachersRepository.create({
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      const saved = await this.teachersRepository.save(teacher);
      if (person && photoUrl) {
        await this.personsRepository.update(person, { photoUrl });
      }
      const hydrated = await this.teachersRepository.findOne({
        where: { id: saved.id },
        relations: ['person', 'institution'],
      });
      if (hydrated) {
        await this.ensureCredential(hydrated);
      }
      return { message: 'Docente creado correctamente', data: hydrated ?? saved };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al crear el docente', 500);
    }
  }

  async findAll(query: FilterTeacherDto): Promise<PaginatedResponse<TeacherEntity>> {
    try {
      const { page = 1, size = 10, search, ...rest } = query;
      const where: FindOptionsWhere<TeacherEntity> = {};

      for (const key of ['contractType', 'laborRegime', 'workloadType', 'employmentStatus']) {
        if (rest[key] !== undefined && rest[key] !== null) {
          where[key] = rest[key];
        }
      }

      const qb = this.teachersRepository
        .createQueryBuilder('teacher')
        .leftJoinAndSelect('teacher.person', 'person')
        .leftJoinAndSelect('teacher.institution', 'institution')
        .where(where);

      if (search) {
        qb.andWhere(
          `(
            teacher.teacherCode ILIKE :search OR
            teacher.specialization ILIKE :search OR
            teacher.professionalTitle ILIKE :search OR
            person.firstName ILIKE :search OR
            person.lastName ILIKE :search OR
            person.email ILIKE :search
          )`,
          { search: `%${search}%` },
        );
      }

      qb.skip((page - 1) * size).take(size);

      const [teachers, total] = await qb.getManyAndCount();

      return {
        data: teachers,
        total,
        page,
        size,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al obtener los docentes', 500);
    }
  }

  async findOne(id: string): Promise<Response<TeacherEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      return { message: 'Docente encontrado', data: teacher };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrio un error al obtener el docente', 500);
    }
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Response<TeacherEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({ where: { id } });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      const { institution, person, photoUrl, ...restDto } = dto;
      this.teachersRepository.merge(teacher, {
        ...restDto,
        institution: institution ? { id: institution } : undefined,
        person: person ? { id: person } : undefined,
      });
      await this.teachersRepository.save(teacher);
      const personId = person || (teacher.person as unknown as { id?: string } | undefined)?.id;
      if (personId && photoUrl) {
        await this.personsRepository.update(personId, { photoUrl });
      }
      const hydrated = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
      if (hydrated) {
        await this.ensureCredential(hydrated);
      }
      return { message: 'Docente actualizado correctamente', data: hydrated ?? teacher };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al actualizar el docente', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.teachersRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }
      return { message: 'Docente eliminado correctamente', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un error al eliminar el docente', 500);
    }
  }

  async getCredential(id: string): Promise<Response<TeacherCredentialEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }

      const credential = await this.ensureCredential(teacher);
      return { message: 'Carnet docente generado correctamente', data: credential };
    } catch (error) {
      this.logger.error(`Error getting teacher credential for ${id}`, error instanceof Error ? error.stack : String(error));
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrio un error al obtener el carnet docente', 500);
    }
  }

  async regenerateCredential(id: string): Promise<Response<TeacherCredentialEntity>> {
    try {
      const teacher = await this.teachersRepository.findOne({
        where: { id },
        relations: ['person', 'institution'],
      });
      if (!teacher) {
        throw new ErrorHandler('Docente no encontrado', 404);
      }

      const credential = await this.ensureCredential(teacher, true);
      return { message: 'Carnet docente regenerado correctamente', data: credential };
    } catch (error) {
      this.logger.error(
        `Error regenerating teacher credential for ${id}`,
        error instanceof Error ? error.stack : String(error),
      );
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrio un error al regenerar el carnet docente', 500);
    }
  }
}
