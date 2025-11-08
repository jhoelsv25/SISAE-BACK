import { BaseEntity } from '@common/entities/base.entity';
import { AssessmentStatus, AssessmentType } from '@features/assessments/enums/assessment.enum';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'assessments' })
export class AssessmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  assessmentDate: Date;

  @Column({ type: 'int' })
  weightPercentage: number;

  @Column({ type: 'int' })
  maxScore: number;

  @Column({ type: 'enum', enum: AssessmentType })
  type: AssessmentType;

  @Column({ type: 'enum', enum: AssessmentStatus })
  status: AssessmentStatus;

  isPublished(): boolean {
    return this.status === AssessmentStatus.COMPLETED || this.status === AssessmentStatus.REVIEWED;
  }

  @ManyToOne(() => PeriodEntity)
  period: PeriodEntity;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;
}
