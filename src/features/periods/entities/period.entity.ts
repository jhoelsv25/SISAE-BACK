import { BaseEntity } from '@common/entities/base.entity';
import { PeriodStatus, PeriodType } from '@common/enums/global.enum';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('academic_periods')
export class PeriodEntity extends BaseEntity {
  @Column({ type: 'int' })
  periodNumber: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'enum', enum: PeriodType })
  type: PeriodType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'enum', enum: PeriodStatus, default: PeriodStatus.PLANNED })
  status: PeriodStatus;

  @ManyToOne(() => AcademicYearEntity, year => year.periods)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYearEntity;
}
