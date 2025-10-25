import { BaseEntity } from '@common/entities/base.entity';
import { LearningMaterialType } from '@features/learning_materials/enums/learning_material.enum';
import { LearningModuleEntity } from '@features/learning_modules/entities/learning_module.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'learning_materials' })
export class LearningMaterialEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'enum', enum: LearningMaterialType })
  type: LearningMaterialType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ type: 'text' })
  thumbnail: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int', default: 0 })
  dislikeCount: number;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'boolean', default: false })
  downloadEnabled: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;

  @ManyToOne(() => LearningModuleEntity)
  module: LearningModuleEntity;

  @ManyToOne(() => TeacherEntity)
  teacher: TeacherEntity;
}
