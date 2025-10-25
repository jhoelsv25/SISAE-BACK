import { BaseEntity } from '@common/entities/base.entity';
import { StatusType } from '@common/enums/global.enum';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import {
  PlatformType,
  VirtualClassroomType,
} from '@features/virtual_classrooms/enums/virtual_classroom.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'virtual_classrooms' })
export class VirtualClassroomEntity extends BaseEntity {
  @Column({ type: 'enum', enum: PlatformType })
  platform: PlatformType;

  @Column({ type: 'text' })
  accessUrl: string;

  @Column({ type: 'text' })
  accessCode: string;
  @Column({ type: 'text' })
  accessPassword: string;

  @Column({ type: 'enum', enum: VirtualClassroomType })
  type: VirtualClassroomType;
  @Column({ type: 'text' })
  meetingId: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: any;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;
}
