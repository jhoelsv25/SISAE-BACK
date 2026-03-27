import { BaseEntity } from '@common/entities/base.entity';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { CompetencyEntity } from '@features/competencies/entities/competency.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity({ name: 'period_competency_grades' })
@Unique('UQ_period_competency_grades_scope', ['enrollment', 'period', 'competency'])
export class PeriodCompetencyGradeEntity extends BaseEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  numericScore: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  literalScore: string | null;

  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0 })
  totalWeight: number;

  @Column({ type: 'int', default: 0 })
  assessmentsCount: number;

  @ManyToOne(() => EnrollmentEntity)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: EnrollmentEntity;

  @ManyToOne(() => AcademicYearEntity)
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: AcademicYearEntity;

  @ManyToOne(() => PeriodEntity)
  @JoinColumn({ name: 'period_id' })
  period: PeriodEntity;

  @ManyToOne(() => CompetencyEntity)
  @JoinColumn({ name: 'competency_id' })
  competency: CompetencyEntity;

  @ManyToOne(() => SectionCourseEntity)
  @JoinColumn({ name: 'section_course_id' })
  sectionCourse: SectionCourseEntity;
}
