import { BaseEntity } from '@common/entities/base.entity';
import { AssessmentEntity } from '@features/assessments/entities/assessment.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'assessment_scores' })
export class AssessmentScoreEntity extends BaseEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'varchar', length: 255 })
  observation: string;

  @Column({ type: 'timestamptz' })
  registerAt: Date;

  @ManyToOne(() => EnrollmentEntity)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: EnrollmentEntity;

  @ManyToOne(() => AssessmentEntity)
  @JoinColumn({ name: 'assessment_id' })
  assessment: AssessmentEntity;
}
