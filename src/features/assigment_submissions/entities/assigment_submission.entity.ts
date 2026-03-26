import { BaseEntity } from '@common/entities/base.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { AssigmentSubmissionStatus } from '@features/assigment_submissions/enums/assigment_submission.enum';
import { AssigmentEntity } from '@features/assigments/entities/assigment.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'assigment_submissions' })
export class AssigmentSubmissionEntity extends BaseEntity {
  @Column({ type: 'int' })
  attemptNumber: number;

  @Column({ type: 'timestamp' })
  submissionDate: Date;

  @Column({ type: 'text' })
  submissionText: string;

  @Column({ type: 'varchar', length: 255 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', length: 255 })
  linkUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  responseData?: unknown;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'text' })
  feedback: string;

  @Column({ type: 'timestamp' })
  feedbackDate: Date;

  @Column({ type: 'varchar', length: 255 })
  feedbackFileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  gradedBy: string;

  @Column({ type: 'timestamp' })
  gradedAt: Date;

  @Column({ type: 'enum', enum: AssigmentSubmissionStatus })
  status: AssigmentSubmissionStatus;

  @ManyToOne(() => AssigmentEntity)
  @JoinColumn({ name: 'assigment_id' })
  assigment: AssigmentEntity;

  @ManyToOne(() => EnrollmentEntity, { nullable: true })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: EnrollmentEntity | null;
}
