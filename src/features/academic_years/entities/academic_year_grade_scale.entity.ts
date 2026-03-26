import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AcademicYearEntity } from './academic_year.entity';

@Entity({ name: 'academic_year_grade_scales' })
export class AcademicYearGradeScaleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20 })
  label: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxScore: number;

  @Column({ type: 'int', default: 1 })
  orderIndex: number;

  @ManyToOne(() => AcademicYearEntity, (academicYear) => academicYear.gradeScales)
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: AcademicYearEntity;
}
