import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodStatus, PeriodType } from '@common/enums/global.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { PeriodEntity } from '../periods/entities/period.entity';
import { CreateAcademicYearWithPeriodsDto } from './dto/create-academic-year-with-periods.dto';
import { CreateAcademicYearDto } from './dto/create-academic_year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic_year.dto';
import { AcademicYearGradeScaleEntity } from './entities/academic_year_grade_scale.entity';
import { AcademicYearEntity } from './entities/academic_year.entity';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYearEntity)
    private readonly repo: Repository<AcademicYearEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private buildGradeScales(
    manager: EntityManager,
    academicYear: AcademicYearEntity,
    gradeScales: Array<{ label: string; minScore: number; maxScore: number; orderIndex?: number }> = [],
  ) {
    return gradeScales
      .filter((scale) => scale.label?.trim())
      .map((scale, index) =>
        manager.getRepository(AcademicYearGradeScaleEntity).create({
          label: scale.label.trim(),
          minScore: Number(scale.minScore),
          maxScore: Number(scale.maxScore),
          orderIndex: Number(scale.orderIndex ?? index + 1),
          academicYear,
        }),
      );
  }

  private normalizeDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value);
  }

  private resolvePeriodType(periodCount: number): PeriodType {
    switch (periodCount) {
      case 1:
        return PeriodType.ANNUAL;
      case 2:
        return PeriodType.SEMESTER;
      case 3:
        return PeriodType.QUARTERLY;
      case 4:
        return PeriodType.BIMONTHLY;
      default:
        return PeriodType.MONTHLY;
    }
  }

  private resolvePeriodName(periodType: PeriodType, periodNumber: number): string {
    switch (periodType) {
      case PeriodType.ANNUAL:
        return 'Periodo anual';
      case PeriodType.SEMESTER:
        return `${periodNumber}° Semestre`;
      case PeriodType.QUARTERLY:
        return `${periodNumber}° Trimestre`;
      case PeriodType.BIMONTHLY:
        return `${periodNumber}° Bimestre`;
      default:
        return `Periodo ${periodNumber}`;
    }
  }

  private serializeAcademicYear(entity: AcademicYearEntity | null): AcademicYearEntity | null {
    if (!entity) return null;

    (entity as any).institution = entity.institution
      ? {
          id: entity.institution.id,
          name: entity.institution.name,
        }
      : undefined;

    (entity as any).gradeScales = (entity.gradeScales ?? [])
      .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex))
      .map((scale) => ({
        id: scale.id,
        label: scale.label,
        minScore: Number(scale.minScore),
        maxScore: Number(scale.maxScore),
        orderIndex: scale.orderIndex,
      }));

    return entity;
  }

  private generatePeriods(
    manager: EntityManager,
    startDateInput: string | Date,
    endDateInput: string | Date,
    periodCount: number,
    academicYear: AcademicYearEntity,
  ): PeriodEntity[] {
    const startDate = this.normalizeDate(startDateInput);
    const endDate = this.normalizeDate(endDateInput);
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
    const periodType = this.resolvePeriodType(periodCount);

    return Array.from({ length: periodCount }, (_, index) => {
      const startOffset = Math.floor((totalDays * index) / periodCount);
      const endOffset = Math.floor((totalDays * (index + 1)) / periodCount) - 1;

      const periodStart = new Date(startDate);
      periodStart.setDate(startDate.getDate() + startOffset);

      const periodEnd = new Date(startDate);
      periodEnd.setDate(startDate.getDate() + Math.max(endOffset, startOffset));

      return manager.getRepository(PeriodEntity).create({
        periodNumber: index + 1,
        name: this.resolvePeriodName(periodType, index + 1),
        type: periodType,
        startDate: periodStart,
        endDate: periodEnd,
        status: PeriodStatus.PLANNED,
        academicYear,
      });
    });
  }

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
      return await this.dataSource.transaction(async manager => {
        const yearExists = await manager.getRepository(AcademicYearEntity).findOne({ where: { year: dto.year } });
        if (yearExists) {
          return ErrorHandler.conflict(`El año académico ${dto.year} ya existe`, 'AcademicYear');
        }

        const { periodCount, gradeScales, ...yearDto } = dto;
        const entity = manager.getRepository(AcademicYearEntity).create({
          ...yearDto,
          institution: dto.institution ? { id: dto.institution } : undefined,
        });
        const savedYear = await manager.getRepository(AcademicYearEntity).save(entity);

        if (periodCount && periodCount > 0) {
          const periods = this.generatePeriods(manager, dto.startDate, dto.endDate, periodCount, savedYear);
          await manager.getRepository(PeriodEntity).save(periods);
        }

        if (gradeScales?.length) {
          const scales = this.buildGradeScales(manager, savedYear, gradeScales);
          if (scales.length) {
            await manager.getRepository(AcademicYearGradeScaleEntity).save(scales);
          }
        }

        const hydratedYear = await manager.getRepository(AcademicYearEntity).findOne({
          where: { id: savedYear.id },
          relations: ['periods', 'institution', 'gradeScales'],
        });

        return this.serializeAcademicYear(hydratedYear ?? savedYear) as AcademicYearEntity;
      });
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al crear año académico');
    }
  }

  async findAll(): Promise<AcademicYearEntity[]> {
    try {
      const years = await this.repo.find({
        order: { year: 'DESC' },
        relations: ['periods', 'institution', 'gradeScales'],
      });
      return years.map((year) => this.serializeAcademicYear(year) as AcademicYearEntity);
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al obtener años académicos');
    }
  }

  async findOne(id: string): Promise<AcademicYearEntity> {
    try {
      const entity = await this.repo.findOne({
        where: { id },
        relations: ['periods', 'institution', 'gradeScales'],
      });
      if (!entity) {
        return ErrorHandler.notFound('Año académico no encontrado', 'AcademicYear');
      }
      return this.serializeAcademicYear(entity) as AcademicYearEntity;
    } catch (error) {
      return ErrorHandler.handleUnknownError(error, 'Error al buscar año académico');
    }
  }

  async update(id: string, dto: UpdateAcademicYearDto): Promise<AcademicYearEntity> {
    try {
      return await this.dataSource.transaction(async manager => {
        const entity = await manager.getRepository(AcademicYearEntity).findOne({
          where: { id },
          relations: ['institution', 'gradeScales'],
        });

        if (!entity) {
          return ErrorHandler.notFound('Año académico no encontrado', 'AcademicYear');
        }

        Object.assign(entity, {
          ...dto,
          institution: dto.institution ? { id: dto.institution } : entity.institution,
        });

        await manager.getRepository(AcademicYearEntity).save(entity);

        if (dto.gradeScales) {
          await manager
            .createQueryBuilder()
            .delete()
            .from(AcademicYearGradeScaleEntity)
            .where(`"academic_year_id" = :id`, { id })
            .execute();

          const nextScales = this.buildGradeScales(manager, entity, dto.gradeScales);
          if (nextScales.length) {
            await manager.getRepository(AcademicYearGradeScaleEntity).save(nextScales);
          }
        }

        const hydrated = await manager.getRepository(AcademicYearEntity).findOne({
          where: { id },
          relations: ['periods', 'institution', 'gradeScales'],
        });

        return this.serializeAcademicYear(hydrated ?? entity) as AcademicYearEntity;
      });
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
