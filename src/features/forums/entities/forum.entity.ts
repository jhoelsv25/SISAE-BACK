import { BaseEntity } from '@common/entities/base.entity';
import { ForumModerationLevel, ForumStatus, ForumType } from '@features/forums/enums/forum.enum';
import { LearningModuleEntity } from '@features/learning_modules/entities/learning_module.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'forums' })
export class ForumEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'enum', enum: ForumType })
  type: ForumType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isModerated: boolean;

  @Column({ type: 'boolean', default: true })
  allowAnonymousPosts: boolean;

  @Column({ type: 'int', default: 0 })
  maxPostLength: number;

  @Column({ type: 'enum', enum: ForumModerationLevel, default: ForumModerationLevel.NONE })
  moderationLevel: ForumModerationLevel;

  @Column({ type: 'enum', enum: ForumStatus, default: ForumStatus.ACTIVE })
  status: ForumStatus;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;

  @ManyToOne(() => LearningModuleEntity)
  module: LearningModuleEntity;
}
