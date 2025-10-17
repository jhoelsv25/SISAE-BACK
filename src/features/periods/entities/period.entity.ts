import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYearEntity } from '../../academic_years/entities/academic_year.entity';

@Entity('academic_periods')
export class PeriodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @ManyToOne(() => AcademicYearEntity, year => year.periods)
  @JoinColumn({ name: 'academicYearId' })
  academicYear: AcademicYearEntity;

  @Column()
  academicYearId: string;
}
