import { ErrorHandler } from '@common/exceptions';
import { PaginatedResponse, Response } from '@common/types/global.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { StudentStatus, StudentType } from './enums/student.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { ImportStudentsDto } from './dto/import-students.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
    @InjectRepository(PersonEntity)
    private readonly personsRepository: Repository<PersonEntity>,
    @InjectRepository(InstitutionEntity)
    private readonly institutionsRepository: Repository<InstitutionEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateStudentDto): Promise<Response<StudentEntity>> {
    try {
      const student = this.studentsRepository.create({
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
        person: dto.person ? { id: dto.person } : undefined,
      });
      const data = await this.studentsRepository.save(student);
      return { message: 'Estudiante creado correctamente', data };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el estudiante', 500);
    }
  }

  async findAll(filter: FilterStudentDto): Promise<PaginatedResponse<StudentEntity>> {
    try {
      const { page = 1, size = 10, ...rest } = filter;
      const where: FindOptionsWhere<StudentEntity> = {};
      for (const key of Object.keys(rest)) {
        if (rest[key] !== undefined && rest[key] !== null) {
          where[key] = rest[key];
        }
      }
      const [data, total] = await this.studentsRepository.findAndCount({
        where,
        take: size,
        skip: (page - 1) * size,
      });
      return { data, total, page, size };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los estudiantes', 500);
    }
  }

  async findOne(id: string): Promise<Response<StudentEntity>> {
    try {
      const student = await this.studentsRepository.findOne({ where: { id } });
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      return { message: 'Estudiante encontrado', data: student };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al buscar el estudiante', 500);
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Response<StudentEntity>> {
    try {
      const student = await this.studentsRepository.findOne({ where: { id } });
      if (!student) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      this.studentsRepository.merge(student, {
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
        person: dto.person ? { id: dto.person } : undefined,
      });
      await this.studentsRepository.save(student);
      return { message: 'Estudiante actualizado correctamente', data: student };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el estudiante', 500);
    }
  }

  async remove(id: string): Promise<Response<null>> {
    try {
      const result = await this.studentsRepository.delete(id);
      if (result.affected === 0) {
        throw new ErrorHandler('Estudiante no encontrado', 404);
      }
      return { message: 'Estudiante eliminado correctamente', data: null };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el estudiante', 500);
    }
  }

  async import(dto: ImportStudentsDto): Promise<{ created: number; errors?: { row: number; message: string }[] }> {
    const errors: { row: number; message: string }[] = [];
    let created = 0;
    const prefix = `imp-${Date.now()}`;

    const [firstInstitution] = await this.institutionsRepository.find({ take: 1 });
    const institutionId = firstInstitution?.id ?? null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < dto.rows.length; i++) {
        const row = dto.rows[i];
        try {
          const nameParts = String(row.name ?? '').trim().split(/\s+/);
          const firstName = nameParts[0] || 'Sin nombre';
          const lastName = nameParts.slice(1).join(' ') || 'Importado';
          const email = String(row.email ?? '').trim() || `${prefix}-${i}@import.local`;
          const uniqueSuffix = `${prefix}-${i}`;

          const person = queryRunner.manager.create(PersonEntity, {
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
            email: email.includes('@') ? email : `${uniqueSuffix}@import.local`,
            photoUrl: '',
            materialStatus: MaterialStatus.SINGLE,
          });
          const savedPerson = await queryRunner.manager.save(PersonEntity, person);

          const studentCode = `EST-${prefix}-${i}`;
          const student = queryRunner.manager.create(StudentEntity, {
            studentCode,
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
          await queryRunner.manager.save(StudentEntity, student);
          created++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          errors.push({ row: i + 1, message: msg });
        }
      }
      await queryRunner.commitTransaction();
      return { created, errors: errors.length > 0 ? errors : undefined };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ErrorHandler(
        err instanceof Error ? err.message : 'Error al importar estudiantes',
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
