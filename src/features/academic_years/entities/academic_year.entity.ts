import { BaseEntity } from '@common/entities/base.entity';
import {
  AcademicYearStatus,
  GradingSystem,
  Modality,
} from '@features/academic_years/enums/academic_year.enum';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('academic_years')
export class AcademicYearEntity extends BaseEntity {
  @Column({ type: 'int', unique: true })
  year: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'enum', enum: Modality, default: Modality.IN_PERSON })
  modality: Modality;

  @Column({
    type: 'enum',
    enum: GradingSystem,
    default: GradingSystem.PERCENTAGE,
  })
  gradingSystem: GradingSystem;

  @Column({ type: 'date' })
  passingDate: Date;

  @Column({ type: 'int' })
  passingGrade: number;

  @Column({ type: 'varchar', length: 255 })
  academicCalendarUrl: string;

  @Column({
    type: 'enum',
    enum: AcademicYearStatus,
    default: AcademicYearStatus.PLANNED,
  })
  status: AcademicYearStatus;

  @OneToMany(() => PeriodEntity, period => period.academicYear)
  periods: PeriodEntity[];

  @ManyToOne(() => InstitutionEntity)
  institution: InstitutionEntity;
}
