import { BaseEntity } from '@common/entities/base.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'learning_modules' })
export class LearningModuleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title: string;
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  displayOrder: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'boolean' })
  isPublished: boolean;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourseId: SectionCourseEntity;
}
