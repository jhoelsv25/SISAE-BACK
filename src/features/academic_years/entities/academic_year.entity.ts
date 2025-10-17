import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PeriodEntity } from '../../periods/entities/period.entity';

@Entity('academic_years')
export class AcademicYearEntity extends BaseEntity {
  @Column({ type: 'int', unique: true })
  year: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => PeriodEntity, period => period.academicYear)
  periods: PeriodEntity[];
}
