import { BaseEntity } from '@common/entities/base.entity';
import { DayOfWeek } from '@common/enums/global.enum';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'schedules' })
export class ScheduleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'time with time zone' })
  startAt: Date;

  @Column({ type: 'time with time zone' })
  endAt: Date;

  @Column({ type: 'varchar', length: 255 })
  classroom: string;
  isActive(): boolean {
    return this.endAt > new Date();
  }

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;
}
