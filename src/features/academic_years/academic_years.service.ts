import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { PeriodEntity } from '../periods/entities/period.entity';
import { CreateAcademicYearWithPeriodsDto } from './dto/create-academic-year-with-periods.dto';
import { CreateAcademicYearDto } from './dto/create-academic_year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic_year.dto';
import { AcademicYearEntity } from './entities/academic_year.entity';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYearEntity)
    private readonly repo: Repository<AcademicYearEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createWithPeriods(dto: CreateAcademicYearWithPeriodsDto) {
    return this.dataSource.transaction(async manager => {
      const existing = await manager
        .getRepository(AcademicYearEntity)
        .findOne({ where: { year: dto.year } });
      if (existing) throw new BadRequestException(`El año académico ${dto.year} ya existe`);

      const yearEntity = manager.getRepository(AcademicYearEntity).create({
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
      });
      const savedYear = await manager.getRepository(AcademicYearEntity).save(yearEntity);

      // Validar fechas de periodos
      for (const p of dto.periods) {
        if (p.startDate < dto.startDate || p.endDate > dto.endDate) {
          throw new BadRequestException(`El periodo ${p.name} debe estar dentro del año académico`);
        }
      }

      const periodEntities = dto.periods.map(p =>
        manager.getRepository(PeriodEntity).create({
          ...p,
          academicYear: savedYear,
        }),
      );

      await manager.getRepository(PeriodEntity).save(periodEntities);

      return { year: savedYear, periods: periodEntities };
    });
  }

  async create(dto: CreateAcademicYearDto): Promise<AcademicYearEntity> {
    try {
      const yearExists = await this.repo.findOne({ where: { year: dto.year } });
      if (yearExists) {
        return ErrorHandler.conflict(`El año académico ${dto.year} ya existe`, 'AcademicYear');
      }
      const entity = this.repo.create({
        ...dto,
        institution: dto.institution ? { id: dto.institution } : undefined,
      });
      return await this.repo.save(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al crear año académico');
    }
  }

  async findAll(): Promise<AcademicYearEntity[]> {
    try {
      return await this.repo.find({ order: { year: 'DESC' } });
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al obtener años académicos');
    }
  }

  async findOne(id: string): Promise<AcademicYearEntity> {
    try {
      const entity = await this.repo.findOne({ where: { id } });
      if (!entity) {
        return ErrorHandler.notFound('Año académico no encontrado', 'AcademicYear');
      }
      return entity;
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al buscar año académico');
    }
  }

  async update(id: string, dto: UpdateAcademicYearDto): Promise<AcademicYearEntity> {
    try {
      const entity = await this.findOne(id);
      Object.assign(entity, dto);
      return await this.repo.save(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al actualizar año académico');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const entity = await this.findOne(id);
      await this.repo.remove(entity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al eliminar año académico');
    }
  }
}
