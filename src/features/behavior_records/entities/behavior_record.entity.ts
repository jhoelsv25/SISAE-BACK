import { BaseEntity } from '@common/entities/base.entity';
import {
  BehaviorSeverity,
  BehaviorType,
} from '@features/behavior_records/enums/behavior_record.enum';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'behavior_records' })
export class BehaviorRecordEntity extends BaseEntity {
  @Column({ type: 'enum', enum: BehaviorType })
  type: BehaviorType;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'enum', enum: BehaviorSeverity })
  severity: BehaviorSeverity;

  @Column({ type: 'varchar', length: 100 })
  actionToken: string;

  @Column({ type: 'boolean', default: false })
  guardianNotified: boolean;

  @Column({ type: 'date', nullable: true })
  notificationDate: Date;

  @ManyToOne(() => StudentEntity)
  student: StudentEntity;

  @ManyToOne(() => PeriodEntity)
  period: PeriodEntity;

  @ManyToOne(() => TeacherEntity)
  teacher: TeacherEntity;
}
