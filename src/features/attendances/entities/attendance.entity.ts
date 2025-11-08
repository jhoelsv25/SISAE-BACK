import { BaseEntity } from '@common/entities/base.entity';
import { AttendanceStatus } from '@common/enums/global.enum';
import { SessionType } from '@features/attendances/enums/attendance.enum';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'attendances' })
export class AttendanceEntity extends BaseEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: SessionType })
  sessionType: SessionType;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @Column({ type: 'time' })
  checkInTime: Date;
  @Column({ type: 'time', nullable: true })
  checkOutTime: Date;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  justificationDocument: string;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @ManyToOne(() => EnrollmentEntity)
  enrollment: EnrollmentEntity;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;
}
