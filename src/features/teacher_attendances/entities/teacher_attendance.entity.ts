import { BaseEntity } from '@common/entities/base.entity';
import { AttendanceStatus } from '@features/teacher_attendances/enums/teacher_attendance.enum';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'teacher_attendances' })
export class TeacherAttendanceEntity extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;
  @Column({ type: 'time' })
  checkInTime: Date;
  @Column({ type: 'time', nullable: true })
  checkOutTime: Date;
  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;
  @Column({ type: 'varchar', length: 100 })
  leaveType: string;
  @Column({ type: 'text', nullable: true })
  reason: string;
  @Column({ type: 'text', nullable: true })
  observations: string;
  @Column({ type: 'text', nullable: true })
  supportingDocuments: string;

  @ManyToOne(() => TeacherEntity)
  teacher: TeacherEntity;
}
