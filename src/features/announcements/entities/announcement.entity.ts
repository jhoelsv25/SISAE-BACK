import { BaseEntity } from '@common/entities/base.entity';
import { PriorityType } from '@common/enums/global.enum';
import { GradeEntity } from '@features/grades/entities/grade.entity';
import { SectionEntity } from '@features/sections/entities/section.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AnnouncementStatus, RecipientType } from '../enums/announcement.enum';

@Entity({ name: 'announcements' })
export class AnnouncementEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: RecipientType })
  recipient: RecipientType;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;
  @Column({ type: 'timestamptz' })
  expireAt: Date;
  @Column({ type: 'varchar', length: 255 })
  attachmentUrl: string;
  @Column({ type: 'enum', enum: PriorityType })
  priority: PriorityType;
  @Column({ type: 'enum', enum: AnnouncementStatus })
  status: AnnouncementStatus;
  @Column({ type: 'int' })
  view: number;
  @Column({ type: 'int', default: 0 })
  resolvedRecipientCount: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => GradeEntity)
  grade: GradeEntity;

  @ManyToOne(() => SectionEntity, { nullable: true })
  @JoinColumn({ name: 'sectionId' })
  section?: SectionEntity | null;
}
