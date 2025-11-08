import { BaseEntity } from '@common/entities/base.entity';
import { ObservationType } from '@features/student_observations/enums/student_observation.enum';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'student_observations' })
export class StudentObservationEntity extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  observation: string;

  @Column({ type: 'enum', enum: ObservationType })
  type: ObservationType;

  @Column({ type: 'text' })
  followUp: string; // seguimiento

  @Column({ type: 'text' })
  referral: string; // derivacion

  @Column({ type: 'boolean', default: false })
  isConfidential: boolean;

  @ManyToOne(() => StudentEntity)
  student: StudentEntity;

  @ManyToOne(() => TeacherEntity)
  teacher: TeacherEntity;
}
