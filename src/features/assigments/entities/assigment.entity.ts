import { BaseEntity } from '@common/entities/base.entity';
import { AssigmentStatus, AssigmentType } from '@features/assigments/enums/assigment.enum';
import { AssessmentEntity } from '@features/assessments/entities/assessment.entity';
import { LearningModuleEntity } from '@features/learning_modules/entities/learning_module.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AssigmentQuestionEntity } from './assigment_question.entity';

@Entity({ name: 'assigments' })
export class AssigmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'text' })
  instructions: string;
  @Column({ type: 'int' })
  maxScore: number;
  @Column({ type: 'timestamptz' })
  assignedDate: Date;
  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'boolean' })
  lateSubmissionAllowed: boolean;

  @Column({ type: 'int' })
  latePenaltyPercentage: number;

  @Column({ type: 'enum', enum: AssigmentType })
  type: AssigmentType;

  @Column({ type: 'int' })
  maxFileSizeMB: number;

  @Column({ type: 'simple-array' })
  allowedFileTypes: string[];

  @Column({ type: 'int' })
  maxAttempts: number;

  @Column({ type: 'boolean' })
  groupAssignment: boolean;

  @Column({ type: 'varchar', length: 255 })
  rubricUrl: string;

  @Column({ type: 'enum', enum: AssigmentStatus })
  status: AssigmentStatus;

  @ManyToOne(() => SectionCourseEntity)
  @JoinColumn({ name: 'section_course_id' })
  sectionCourse: SectionCourseEntity;

  @ManyToOne(() => TeacherEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherEntity;

  @ManyToOne(() => LearningModuleEntity)
  @JoinColumn({ name: 'module_id' })
  module: LearningModuleEntity;

  @OneToMany(() => AssigmentQuestionEntity, (question) => question.assigment)
  questions: AssigmentQuestionEntity[];

  @ManyToOne(() => AssessmentEntity, { nullable: true })
  @JoinColumn({ name: 'assessment_id' })
  assessment?: AssessmentEntity | null;
}
